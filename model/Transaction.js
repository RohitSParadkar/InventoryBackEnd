const mongoose = require("mongoose")
const { Schema } = mongoose;
const transactionSchema = new Schema({
    supplierId: {
        type: Number,
        required: true
    },
    productId: {
        type: Number,
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
    type: {
        type: String, // Change the type to Date
        required: true,
    },
    date: {
        type: Date,
        default: Date.now  //Donn't call the function
    }
});
const Transactions = mongoose.model("transactions", transactionSchema);
Transactions.createIndexes();
module.exports = Transactions;
