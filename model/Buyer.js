const mongoose = require("mongoose")
const { Schema } = mongoose;
const buyerSchema = new Schema({
    buyerName:{
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


const Buyer = mongoose.model("Buyer",buyerSchema);
Buyer.createIndexes();
module.exports = Buyer;
