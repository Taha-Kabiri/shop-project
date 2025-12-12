require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/database");
const mongoose = require('mongoose');




const PORT = process.env.PORT || 3000;

async function start() {
  await connectDB(process.env.URL);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

start();
