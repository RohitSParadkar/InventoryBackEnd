const mongoose = require("mongoose")
const { Schema } = mongoose;
const bcrypt = require('bcrypt')
const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true
        
    },
    password:{
        type:String,
        required:true
    },
    varified:{
      type:Boolean,   
      default:false,
      required:true
    },
    date:{
        type:Date,
        default:Date.now  //Donn't call the function
    }
});
//----------privous to save hash the password
userSchema.pre('save',async function(next){
  if(this.isModified('password')){
    const hash = await bcrypt.hash(this.password,8)
    this.password = hash;
  }
   next();
})

userSchema.methods.comparePassword = function(password){
    const result = bcrypt.compareSync(password,this.password)    //this is async await method
    return result
}
const User = mongoose.model("user",userSchema);
User.createIndexes();
module.exports = User;
