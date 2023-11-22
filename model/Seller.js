const mongoose = require("mongoose")
const { Schema } = mongoose;
const sellerSchema = new Schema({
    sellerName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true
        
    },
    phone:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,  //Donn't call the function
    },
});


const Seller = mongoose.model("Seller",sellerSchema);
Seller.createIndexes();
module.exports = Seller;
