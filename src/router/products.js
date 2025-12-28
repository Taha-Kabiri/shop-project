const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// ------------------
const authMiddleware = require("../../middleware/authMiddleware");
// add productController
const productController = require("../controller/productController");
// add middleware "isAdmin" & "isLoggedin"
const isAdmin = require("../../middleware/isAdmin");
const isLoggedin = require("../../middleware/isLoggedIn");

// multer custom

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "profileProducts"
    );

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/\s+/g, "-");
    cb(null, Date.now() + "-" + name + ext);
  },
});

const upload = multer({ storage: storage });
// see just admin
router.get("/add", isLoggedin, isAdmin, (req, res) => {
  res.render("products/addProduct", {
    title: "افزودن محصول",
  });
});

// see all product

router.get("/dashboard", isLoggedin, productController.getAllProducts);

// add new product (POST)
router.post(
  "/add",
  isLoggedin,
  isAdmin,
  upload.single("image"),
  productController.createProduct
);
module.exports = router;
