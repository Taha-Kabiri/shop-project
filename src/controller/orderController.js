const Order = require("./../../models/order");

exports.showOrders = async (req, res) => {
  const orders = await Order.find({ user: req.session.user.id })
    .populate("items.product")
    .sort({ createdAt: -1 });

  res.render("pages/orders", {
    orders
  });
};
