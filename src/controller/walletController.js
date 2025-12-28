const User = require("./../../models/user");

exports.showWallet = async (req, res) => {
  const user = await User.findById(req.session.user.id);

  res.render("pages/wallet", {
    user
  });
};
