const Products = require('../model/Products');

exports.createProducts = async (req, res) => {
    try {
        const {
            productID,
            productName,
            category,
            quantity,
            amount,
            expiry
        } = req.body;

        // Check if there is an existing entry with the same category and expiry
        const existingProduct = await Products.findOne({
            productID,
            expiry
        });

        if (existingProduct) {
            // If entry exists, update the amount
            existingProduct.quantity += quantity;
            await existingProduct.save();
        } else {
            // If no entry exists, create a new one
            const newProduct = new Products({
                productID,
                productName,
                category,
                quantity,
                amount,
                expiry
            });
            await newProduct.save();
        }

        // Retrieve and send the updated list of all products
        const allProducts = await Products.find({});
        res.send(allProducts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getProductsByName = async (req, res) => {
    try {
      const { productName } = req.body;
  
      console.log('productName:', productName);
  
      if (!productName) {
        console.log('Product name is required in the request body');
        return res.status(400).send('Product name is required in the request body');
      }
  
      // Use a regular expression for a case-insensitive partial match
      const regex = new RegExp(productName, 'i');
  
      const products = await Products.find({ productName: { $regex: regex } });
  
      console.log('Retrieved products:', products);
  
      res.send(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Internal Server Error');
    }
  };