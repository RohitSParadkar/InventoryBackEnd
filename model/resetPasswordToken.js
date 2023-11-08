const mongoose = require("mongoose")
const { Schema } = mongoose;
const bcrypt = require('bcrypt')
const resetPasswordTokenSchema = new Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    token:{
        type:String,
        required:true,
        
    },
    //createdAt object is needed to delete the complete entry 
    createdAt:{
        type:Date,
        default:Date.now,  //Donn't call the function
        expires:300   //object will be deleted  after 300sec
    },
});
//----------privous to save hash the password
resetPasswordTokenSchema.pre('save',async function(next){
  if(this.isModified('token')){
    const hash = await bcrypt.hash(this.token,8)
    this.token = hash;
  }
   next();
})

resetPasswordTokenSchema.methods.compareToken= function(token){
    const result = bcrypt.compareSync(token,this.token)    //this is async await method
    return result
}
const resetPasswordToken = mongoose.model("resetPasswordToken",resetPasswordTokenSchema);
resetPasswordToken.createIndexes();
module.exports = resetPasswordToken;