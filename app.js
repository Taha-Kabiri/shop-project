const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");

app.use(express.static(path.join(__dirname, "public")));

// session
app.use(
  session({
    secret: "l654fd5dfkjdklsfjd",
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 24 },
  })
);
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});
// flash message
app.use(flash());

// middlware for flash messages
app.use((req, res, next) => {

  const rawErrors = req.flash("errors"); 
  
  res.locals.errors = rawErrors.flatMap(err => {
    if (typeof err === 'object' && err.msg) return err.msg;
    if (Array.isArray(err)) return err.map(e => e.msg || e);
    return err;
  });

  const success = req.flash("success");
  res.locals.successMessage = success.length > 0 ? success[0] : null;
  res.locals.user = req.session.user || null; 
  
  next();
});

// parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// views
app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/main");
app.get("/", (req, res) => {
  res.redirect("/api/auth");
});

// routers
const userRouter = require("./src/router/user");
const authRoutes = require("./src/router/authRoutes");
const productRoutes = require("./src/router/products");
const cartRoutes = require("./src/router/cart");
const paymentRoutes = require("./src/router/paymentRoutes");
const walletRoutes = require("./src/router/walletRoutes");
const orderRoutes = require("./src/router/orderRoutes");
// ...
app.use("/users", userRouter);
app.use("/api/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/payment", paymentRoutes);
app.use("/wallet", walletRoutes);
app.use("/orders", orderRoutes);
module.exports = app;


