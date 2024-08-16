const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, );
    console.log("Database connection is good ..");
  } catch (err) {
    console.error("Database connection failed ..", err);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
