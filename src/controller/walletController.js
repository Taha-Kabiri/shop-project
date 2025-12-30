const User = require("./../../models/user");

exports.showWallet = async (req, res) => {
  const user = await User.findById(req.session.user.id);
  res.render("pages/wallet", { user });
};

// متد جدید برای کسر از کیف پول و ارتقا
exports.upgradeToAdminWithWallet = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const upgradeCost = 500000; // ۵۰ هزار تومان به ریال

    const user = await User.findById(userId);

    // بررسی موجودی کافی
    if (user.walletBalance < upgradeCost) {
      req.flash("errors", "موجودی کیف پول شما کافی نیست. ابتدا کیف پول را شارژ کنید.");
      return res.redirect("/wallet");
    }

    // کسر مبلغ و تغییر نقش به ادمین
    user.walletBalance -= upgradeCost;
    user.role = 'admin';
    await user.save();

    // بروزرسانی سشن برای اعمال دسترسی آنی
    req.session.user.role = 'admin';

    req.flash("success", "حساب شما با موفقیت با استفاده از موجودی کیف پول به ادمین ارتقا یافت.");
    return res.redirect("/products/add");

  } catch (err) {
    console.error("Wallet Upgrade Error:", err);
    req.flash("errors", "خطایی در پردازش درخواست شما رخ داد.");
    res.redirect("/wallet");
  }
};