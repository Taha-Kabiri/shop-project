const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.js");

JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

// register --------------------------------------------------------------------------------

exports.register = async (req, res) => {
  const errors = validationResult(req);
  const errorArray = errors.isEmpty() ? [] : errors.array();

  if (!errors.isEmpty()) {
    req.flash("errors", errorArray);
    return res.redirect("/api/auth/register");
  }

  const { name, email, password } = req.body;

  try {
    let exsistingUser = await User.findOne({ $or: [{ email }, { name }] });
    if (exsistingUser) {
      req.flash("errors", [
        { msg: "کاربری با این نام یا ایمیل قبلاً ثبت نام کرده است." },
      ]);
      return res.redirect("/api/auth/register");
    }

    const saltRounds = 10;
    const hashid = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      name,
      email,
      password: hashid,
    });

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    req.flash("success", "ثبت‌نام شما با موفقیت انجام شد. لطفا وارد شوید.");
    return res.redirect("/api/auth/login");
  } catch (err) {
    console.error(err);
    req.flash("errors", [{ msg: "خطای سرور رخ داد. لطفا دوباره تلاش کنید." }]);
    return res.redirect("/api/auth/register");
  }
};

// login --------------------------------------------------------------------------------

exports.login = async (req, res) => {
  const { emailorname, password } = req.body;
  const loginError = [{ msg: "ایمیل یا رمز عبور اشتباه است." }];

  try {
    let finduser = await User.findOne({
      $or: [{ email: emailorname }, { name: emailorname }],
    }).select("+password");

    if (!finduser) {
      req.flash("errors", loginError);
      return res.redirect("/api/auth/login");
    }

    const isMach = await bcrypt.compare(password, finduser.password);
    if (!isMach) {
      req.flash("errors", loginError);
      return res.redirect("/api/auth/login");
    }

    req.session.user = {
      id: finduser._id,
      role: finduser.role,
      name: finduser.name,
    };

    const token = jwt.sign({ id: finduser._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    req.flash("success", "ورود شما با موفقیت انجام شد. خوش آمدید.");
    return res.redirect("/products/dashboard");
  } catch (err) {
    console.error(err);
    req.flash("errors", [{ msg: "خطای داخلی سرور." }]);
    return res.redirect("/api/auth/login");
  }
};

// show login pages ----------------------------------------------------------------------------
exports.showLogin = (req, res) => {
  res.render("auth/login", {
    title: "ورود",
  });
};
//show register pages---------------------------------------------------------------------------
exports.showRegister = (req, res) => {
  res.render("auth/register", {
    title: "ثبت‌نام",
  });
};
// post login pages ----------------------------------------------------------------------------
exports.loginUser = (req, res) => {
  res.send("LOGIN HANDLER");
};
// post register oages --------------------------------------------------------------------------
exports.registerUser = (req, res) => {
  res.send("REGISTER HANDLER");
};
// lobby page -----------------------------------------------------------------------------------
exports.lobbyPage = (req, res) => {
  res.render("pages/lobby", {
    title: "خانه",
  });
};

// logout

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);

      return res.redirect("/api/auth/login?error=true");
    }

    res.clearCookie("connect.sid");
    return res.redirect("/api/auth/login?success=loggedOut");
  });
};
