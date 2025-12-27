const express = require("express");
const router = express.Router();
const cartController = require("../controller/cartController");
const isLoggedIn = require("../../middleware/isLoggedIn");

// show cart
router.get("/", isLoggedIn , cartController.showCart);

// add to cart
router.post("/add/:productId", isLoggedIn , cartController.addToCart);
// remove product form cart
router.post("/remove/:productId" , isLoggedIn , cartController.removeFormCart)

module.exports = router;

