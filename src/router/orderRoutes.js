const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const isLoggedIn = require("./../../middleware/isLoggedIn");

router.get("/", isLoggedIn, orderController.showOrders);

module.exports = router;
