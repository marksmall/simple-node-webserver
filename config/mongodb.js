const mongoose = require('mongoose');

const connectDB = async () => {
  mongoose.set('strictQuery', false);
  try {
    await mongoose.connect(process.env.DB_URI, { 
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch(error) {
    console.error(error);
  }
};

module.exports = connectDB;
