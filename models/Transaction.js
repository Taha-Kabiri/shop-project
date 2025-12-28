const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user : {
    type :  mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : true
  },
  amount : {
    type : Number,
    required : true
  },
  authority : String ,
  status : {
    type : String,
    enum : ["pending" , "success" , "failed"],
    default : "pending"
  },
  createdAt : {
    type : Date,
    default : Date.now
  }
});


module.exports = mongoose.model("Transaction" , transactionSchema);
