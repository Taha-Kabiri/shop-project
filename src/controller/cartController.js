const User = require("./../../models/user");
const Product = require("./../../models/product");
const flash = require('connect-flash');


exports.showCart = async (req, res) => {

  if (!req.session.user) {
    return res.redirect("/login");
  }

  const user = await User.findById(req.session.user.id)
    .populate("cart.product");

  let totalPrice = 0;

  user.cart.forEach(item => {
    totalPrice += item.product.price * item.quantity;
  });

  res.render("pages/cart", {
    title: "سبد خرید",
    cart: user.cart,
    totalPrice
  });
};

exports.addToCart = async (req , res) =>{
try{
    const user = await User.findById(req.session.user.id);
 const product = await Product.findById(req.params.productId);

if(!product || product.stock <= 0){
  req.flash("errors" , "موجودی این کالا به اتمام رسیده است");
  return res.redirect("/products/dashboard")
}
  
const itemIndex = user.cart.findIndex(
  item => item.product.toString() === product._id.toString()
);

if (itemIndex > -1){
  user.cart[itemIndex].quantity += 1
}else{
  user.cart.push({
    product : product._id,
    quantity : 1
  });
}

product.stock -= 1 ;
await product.save();
await user.save();

req.flash("success" , "محصول با موفقیت به سبد خرید اضافه شد ");
res.redirect("/cart");

}catch(err){
  console.error(err);
  req.flash("errors" , "خطایی در افزودن سبد خرید رخ داده ، از سمت سرور");
  res.redirect("/products/dashboard");
}
};

exports.removeFormCart = async (req,res) => {
  try{
const user = await User.findById(req.session.user.id);
const product = await Product.findById(req.params.productId);

if (!product){
  return res.redirect("/cart");
}

const itemIndex = user.cart.findIndex(
  item => item.product.toString() === product._id.toString()
);

if (user.cart[itemIndex].quantity > 1){
  user.cart[itemIndex].quantity -= 1;
}else{
  user.cart.splice(itemIndex , 1);
}

product.stock += 1 ;

await product.save();
  await user.save();

  req.flash("success" , " محصول با موفقیت از سبدخرید حذف شده است");
  res.redirect("/cart");
  }catch(err){
    console.error(err);
    req.flash("errors" , "خطایی هنگام حف از سبد خرید رخ داده است ");
    res.redirect("/products/dashboard");
  }
}