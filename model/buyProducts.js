const mongoose = require("mongoose")
const { Schema } = mongoose;
const buyProductsSchema = new Schema({
    productID: {
        type: Number,
        required: true
    },
    productName: {
        type: String,
        required: true,


    },
    category: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    expiry: {
        type: String, // Change the type to Date
        required: true,
    },
    date: {
        type: Date,
        default: Date.now  //Donn't call the function
    }
});
const buyProducts = mongoose.model("buyProducts", buyProductsSchema);
buyProducts.createIndexes();
module.exports = buyProducts;
