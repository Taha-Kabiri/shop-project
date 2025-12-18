module.exports = ((req,res,next)=>{
  if(!req.session.user || req.session.user.role!=="admin"){
   req.flash("errors",[{msg :" دسترسی مجاز نیست"}]);
  return res.redirect('/api/auth/login')};
    next();
})