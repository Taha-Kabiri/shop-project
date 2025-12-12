const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controller/authController");

// Register Router
router.post(
  "/register",
  [
    body("name", " Name is required ").not().isEmpty(),
    body("email", " please enter valid email ").isEmail(),
    body("password", "password must be at length 6 or more").isLength({
      min: 6,
    }),
  ],
  authController.register
);
// login Router
router.post(
  "/login",
  [
    body("emailorname", " please enter valid emailorname ").isEmail(),
    body("password", " password is requires ").not().isEmpty(),
  ],
  authController.login
);

// get peges
router.get("/login", authController.showLogin);
router.get("/register", authController.showRegister);
router.get("/", authController.lobbyPage);

// post pages
router.post("/login", authController.loginUser);
router.post("/register", authController.registerUser);

module.exports = router;
