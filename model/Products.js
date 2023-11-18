const mongoose = require("mongoose")
const { Schema } = mongoose;
const productSchema = new Schema({
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
const Products = mongoose.model("products", productSchema);
Products.createIndexes();
module.exports = Products;
