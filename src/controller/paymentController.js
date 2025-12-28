const axios = require("axios");
const flash = require("connect-flash");
const Transaction = require("./../../models/Transaction");
const User = require("./../../models/user");

const MERCHANT_ID = "00000000-0000-0000-0000-000000000000"; 
const CALLBACK_URL = "http://localhost:3000/payment/verify";

exports.requestPayment = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    const userId = req.session.user.id;

    
    const response = await axios.post("https://sandbox.zarinpal.com/pg/v4/payment/request.json", {
      merchant_id: MERCHANT_ID,
      amount: amount,
      description: "شارژ کیف پول",
      callback_url: CALLBACK_URL,
    });

    
    const { code, authority } = response.data.data;

    if (code === 100) {
      await Transaction.create({
        user: userId,
        amount: amount,
        authority: authority,
        status: "pending",
      });

      return res.redirect(`https://sandbox.zarinpal.com/pg/StartPay/${authority}`);
    } else {
      req.flash("errors", "خطا در ایجاد درخواست پرداخت");
      return res.redirect("/wallet");
    }
  } catch (err) {
    console.error("Payment Request Error:", err.response ? err.response.data : err.message);
    req.flash("errors", "خطا در اتصال به درگاه پرداخت");
    res.redirect("/wallet");
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { Authority, Status } = req.query;

   
    const transaction = await Transaction.findOne({ authority: Authority });

    if (!transaction) {
      req.flash("errors", "تراکنشی با این مشخصات یافت نشد");
      return res.redirect("/wallet");
    }

    if (Status !== "OK") {
      transaction.status = "failed";
      await transaction.save();
      req.flash("errors", "پرداخت توسط کاربر لغو شد");
      return res.redirect("/wallet");
    }

    
    const response = await axios.post("https://sandbox.zarinpal.com/pg/v4/payment/verify.json", {
      merchant_id: MERCHANT_ID,
      amount: transaction.amount,
      authority: Authority,
    });

    if (response.data.data && response.data.data.code === 100) {
      transaction.status = "success";
      await transaction.save();

      
      await User.findByIdAndUpdate(transaction.user, {
        $inc: { walletBalance: transaction.amount },
      });

      req.flash("success", "کیف پول با موفقیت شارژ شد");
      return res.redirect("/wallet");
    } else {
      transaction.status = "failed";
      await transaction.save();
      req.flash("errors", "تایید پرداخت با خطا مواجه شد");
      return res.redirect("/wallet");
    }
  } catch (err) {
    console.error("Verify Error:", err.response ? err.response.data : err.message);
    req.flash("errors", "خطا در تایید تراکنش");
    res.redirect("/wallet");
  }
};