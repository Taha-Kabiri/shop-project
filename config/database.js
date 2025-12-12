const mongoose = require('mongoose');


async function connectDB(URL){
  try{
    await mongoose.connect(URL);
    console.log('database connected successfuly');
  }catch(err){
    console.log('database connected failed' , err);
    process.exit(1);
  }
};

module.exports = connectDB ;