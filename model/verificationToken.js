const mongoose = require("mongoose")
const { Schema } = mongoose;
const bcrypt = require('bcrypt')
const verificationTokenSchema = new Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    token:{
        type:String,
        required:true,
        
    },
    createdAt:{
        type:Date,
        default:Date.now,  //Donn't call the function
        expires:3600
    },
});
//----------privous to save hash the password
verificationTokenSchema.pre('save',async function(next){
  if(this.isModified('token')){
    const hash = await bcrypt.hash(this.token,8)
    this.token = hash;
  }
   next();
})

verificationTokenSchema.methods.compareToken= function(token){
    const result = bcrypt.compareSync(token,this.token)    //this is async await method
    return result
}
const verificationToken = mongoose.model("VarificationToken",verificationTokenSchema);
verificationToken.createIndexes();
module.exports = verificationToken;