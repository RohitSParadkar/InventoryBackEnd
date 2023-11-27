const Products = require("../model/Products");
const Transactions = require("../model/Transaction");
const Buyer = require("../model/Buyer");
const Seller = require("../model/Seller");
const { sendTransactionMail } = require("../utilities/customMail");

exports.createProducts = async (req, res) => {
  console.log("inventory body");
  try {
    const { productID, productName, category, quantity, amount, expiry } =
      req.body;
    // Convert quantity and amount to integers
    const parsedQuantity = parseInt(quantity);
    const parsedAmount = parseInt(amount);

    // Check if there is an existing entry with the same category and expiry
    const existingProduct = await Products.findOne({
      productID,
      expiry,
    });

    if (existingProduct) {
      // If entry exists, update the amount
      existingProduct.quantity += parsedQuantity;
      await existingProduct.save();
    } else {
      const newProduct = new Products({
        productID,
        productName,
        category,
        quantity: parsedQuantity,
        amount: parsedAmount,
        expiry,
      });
      await newProduct.save();
    }

    // Retrieve and send the updated list of all products
    const allProducts = await Products.find({});
    res.send(allProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getProductsByName = async (req, res) => {
  console.log("search by product name");
  try {
    const { productName } = req.body;

    console.log("productName:", productName);

    if (!productName) {
      console.log("Product name is required in the request body");
      return res
        .status(400)
        .send("Product name is required in the request body");
    }

    // Use a regular expression for a case-insensitive partial match
    const regex = new RegExp(productName, "i");

    const products = await Products.find({ productName: { $regex: regex } });
    res.send(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.inventoryList = async (req, res) => {
  console.log("inventory list");
  try {
    // Retrieve and send the updated list of all products
    const allProducts = await Products.find({});
    res.send(allProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.inventoryByProductid = async (req, res) => {
  console.log("inventory inventoryByProductid");
  try {
    const { productID } = req.body;
    // Retrieve and send the updated list of all products
    const allProducts = await Products.find({ productID });
    res.send(allProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.createTransactions = async (req, res) => {
  console.log("transaction body");
  try {
    const { buyerId, productId, category, quantity, amount, type } = req.body;

    // Get the product details
    const existingProduct = await Products.findOne({ productID: productId });

    if (!existingProduct) {
      return res.status(404).send("Product not found");
    }

    // Create a new transaction
    const newTransaction = new Transactions({
      buyerId,
      productId,
      productName: existingProduct.productName, // Include productName in the transaction
      category,
      quantity,
      amount,
      type,
    });

    // Save the new transaction
    await newTransaction.save();
    sendTransactionMail(type, newTransaction._id);
    // Update the quantity based on the transaction type
    if (type === "buy") {
      // If the transaction type is "buy", add the quantity
      existingProduct.quantity += parseInt(quantity);
    } else if (type === "sell") {
      // If the transaction type is "sell", subtract the quantity
      existingProduct.quantity -= parseInt(quantity);
    }

    // Save the updated product
    await existingProduct.save();

    // Retrieve and send the updated list of all transactions
    const allTransactions = await Transactions.find({});
    res.send(allTransactions);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.transactionsList = async (req, res) => {
  console.log("transactions list");
  try {
    // Retrieve and send the updated list of all products
    const allTransactions = await Transactions.find({});
    res.send(allTransactions);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};


exports.transactionDetail = async (req, res) => {
  console.log("transactions Detail");
  try {
    const { transactionID } = req.body;
    const transaction = await Transactions.find({ _id: transactionID });
    res.send(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getTransactionsByProductName = async (req, res) => {
  console.log("search transactions by product name");
  try {
    const { productName } = req.body;

    console.log("productName:", productName);

    if (!productName) {
      console.log("Product name is required in the request body");
      return res
        .status(400)
        .send("Product name is required in the request body");
    }

    // Use a regular expression for a case-insensitive partial match
    const regex = new RegExp(productName, "i");

    const transactions = await Transactions.find({
      productName: { $regex: regex },
    });
    res.send(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.OverView = async (req, res) => {
    console.log("get total buy amount and product frequency");
    try {
      // Filter transactions by type "buy" and "sell"
      const buyTransactions = await Transactions.find({ type: "buy" });
      const sellTransactions = await Transactions.find({ type: "sell" });
  
      // Calculate total quantity and amount for buy transactions
      let cost = 0;
      buyTransactions.forEach((transaction) => {
        cost += transaction.quantity * transaction.amount;
      });
  
      // Calculate total quantity and amount for sell transactions
      let sell = 0;
      sellTransactions.forEach((transaction) => {
        sell += transaction.quantity * transaction.amount;
      });
  
      // Calculate profit
      const profit = sell - cost;
  
      // Find the frequency of each product with type "sell" and include product name
      const productFrequency = await Transactions.aggregate([
        {
          $match: {
            type: "sell",
          },
        },
        {
          $group: {
            _id: "$productId",
            productCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "products", // The name of the Products collection
            localField: "_id",
            foreignField: "productID",
            as: "productDetails",
          },
        },
        {
          $unwind: "$productDetails",
        },
        {
          $project: {
            productName: "$productDetails.productName",
            productCount: 1,
          },
        },
      ]);
  
      // Create a response object with total quantity, amount, profit, and product frequency
      const response = {
        cost,
        sell,
        profit,
        productFrequency,
      };
  
      // Send the response
      res.send(response);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  };
//create Buyer
exports.createBuyer = async (req, res) => {
  console.log("buyer  is created");
  try {
    const { buyerName, email, phone, address } = req.body;
    const newBuyer = new Buyer({
      buyerName,
      email,
      phone,
      address,
    });
    await newBuyer.save();
    res.send(newBuyer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.createSeller = async (req, res) => {
  console.log("buyer  is created");
  try {
    const { sellerName, email, phone, address } = req.body;
    const newSeller = new Seller({
      sellerName,
      email,
      phone,
      address,
    });
    await newSeller.save();
    res.send(newSeller);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
