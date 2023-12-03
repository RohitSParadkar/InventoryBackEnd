// const mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1:27017/inventory',{ useNewUrlParser: true, useUnifiedTopology: true }
// )
// .then(() => {
//   console.log('Connected to MongoDB');
// })
// .catch((error) => {
//   console.error('Error connecting to MongoDB:', error);
// });

const mongoose = require('mongoose');

// Replace '<password>' with your actual MongoDB Atlas password
const password = 'LGhytAc3NZojMbHH';

mongoose.connect(
  `mongodb+srv://root:${password}@cluster0.fnbkeuf.mongodb.net/inventory?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });
