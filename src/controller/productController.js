const Product = require("../../models/Product");

// get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.render("pages/dashboard", {
      title: "داشبورد",
      products,
       user: req.session.user  
    });
  } catch (err) {
    req.flash("errors", "خطا در نمایش محصولات");
    res.redirect("/products/dashboard");
  }
};

// created products
exports.createProduct = async (req, res) => {
  try {
  
    const { title, price, stock, description, category } = req.body;

    

const imagePath = req.file ? '/uploads/profileProducts/' + req.file.filename : null;
    
    // 
    if (!title || !price || !stock || !description) {
        req.flash("errors", "همه فیلدهای ضروری را پر کنید.");
        return res.redirect("/products/add");
    }

    const product = new Product({
      title,
      price: parseFloat(price), 
      stock: parseInt(stock),   
      description,
      category,
      imageUrl: imagePath, 
    });

    await product.save();

  
    req.flash("success", "محصول شما با موفقیت اضافه شد ");
    return res.redirect("/products/dashboard");
  } catch (err) {
    console.error("خطا در ذخیره محصول:", err); 
    
    
    let errorMessage = "خطا در اضافه کردن محصول جدید";
    if (err.name === 'ValidationError') {
        errorMessage = 'خطا در اعتبارسنجی: مطمئن شوید همه فیلدهای ضروری پر شده باشند.';
    }

    req.flash("errors", errorMessage);
    res.redirect("/products/add"); 
  }
};
// show add product form ----------------------------------------------------------------------------
exports.showAddProduct = (req, res) => {
  res.render("products/addProduct", {
    title: "افزودن محصول جدید",
  });
};