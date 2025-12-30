const express = require("express");
const router = express.Router()

// --------------
const paymentController = require("./../controller/paymentController");
const isLoggedIn = require("./../../middleware/isLoggedIn");
// --------------
router.post("/request" , isLoggedIn , paymentController.requestPayment);
router.get("/verify" , isLoggedIn , paymentController.verifyPayment);



module.exports = router;