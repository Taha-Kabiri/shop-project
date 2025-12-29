const User = require("./../../models/user");
const Product = require("./../../models/product");
const Transaction = require("./../../models/Transaction");
const Order = require("./../../models/order");
const flash = require("connect-flash");
const { response } = require("express");

exports.showCart = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const user = await User.findById(req.session.user.id).populate(
    "cart.product"
  );

  let totalPrice = 0;

  user.cart.forEach((item) => {
    totalPrice += item.product.price * item.quantity;
  });

  res.render("pages/cart", {
    title: "سبد خرید",
    cart: user.cart,
    totalPrice,
  });
};

exports.addToCart = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    const product = await Product.findById(req.params.productId);

    if (!product || product.stock <= 0) {
      req.flash("errors", [{ msg: "موجودی این کالا به اتمام رسیده است" }]);
      return res.redirect("/products/dashboard");
    }

    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === product._id.toString()
    );

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += 1;
    } else {
      user.cart.push({
        product: product._id,
        quantity: 1,
      });
    }

    product.stock -= 1;
    await product.save();
    await user.save();

    req.flash("success", [{ msg: "محصول با موفقیت به سبد خرید اضافه شد" }]);
    res.redirect("/cart");
  } catch (err) {
    console.error(err);
    req.flash("errors", [
      { msg: "خطایی در افزودن سبد خرید رخ داده ، از سمت سرور" },
    ]);
    res.redirect("/products/dashboard");
  }
};

exports.removeFormCart = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.redirect("/cart");
    }

    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === product._id.toString()
    );

    if (user.cart[itemIndex].quantity > 1) {
      user.cart[itemIndex].quantity -= 1;
    } else {
      user.cart.splice(itemIndex, 1);
    }

    product.stock += 1;

    await product.save();
    await user.save();

    req.flash("success", [{ msg: " محصول با موفقیت از سبدخرید حذف شده است" }]);
    res.redirect("/cart");
  } catch (err) {
    console.error(err);
    req.flash("errors", [{ msg: "خطایی هنگام حف از سبد خرید رخ داده است " }]);
    res.redirect("/products/dashboard");
  }
};

exports.payWithWallet = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id).populate(
      "cart.product"
    );

    if (!user || user.cart.length === 0) {
      req.flash("errors", [{ msg: "سبد خرید شما خالی است" }]);
      return res.redirect("/cart");
    }

    let totalPrice = 0;
    user.cart.forEach((item) => {
      totalPrice += item.product.price * item.quantity;
    });

    if (user.walletBalance < totalPrice) {
      req.flash("errors", [{ msg: "موجودی کیف پول شما کافی نیست" }]);
      return res.redirect("/cart");
    }

    //maines wallet
    user.walletBalance -= totalPrice;

    // creat order
    await Order.create({
      user: user._id,
      items: user.cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalPrice: totalPrice,
      status: "paid",
      paymentMethod: "wallet",
    });

    user.cart = [];
    await user.save();

    req.flash("success", [
      { msg: "پرداخت با موفقیت انجام شد و سفارش شما ثبت گردید." },
    ]);
    res.redirect("/orders");
  } catch (err) {
    console.error(err);
    req.flash("errors", [{ msg: "خطایی در هنگام پرداخت رخ داده است" }]);
    res.redirect("/cart");
  }
};
