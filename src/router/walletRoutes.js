const express = require("express");
const router = express.Router();
const walletController = require("./../controller/walletController");
const isLoggedIn = require("./../../middleware/isLoggedIn");

router.get("/", isLoggedIn, walletController.showWallet);
router.post("/upgrade-with-wallet", isLoggedIn, walletController.upgradeToAdminWithWallet);

module.exports = router;
