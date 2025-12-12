const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

async function  authMiddleware(req , res , next){
  const authHeader = req.hreaders.authorization;
  if(!authHeader || !authHeader.startsWith('Bearer ')){
    return res.status (401).json({message:'No token provided'});
  }

  const token = authHeader.split(' ')[1];

try{
  // vrify token 
  const decoded = jwt.verify(token , JWT_SECRET);
   // loading user not includ password 
   const user = await User.findById(decoded.id).select('-password');
   if(!user){
    return res.status(401).json({message : 'invalid token - user not found'});
   }
   req.user = user;
   next();
}catch(err){
  return res.status(401).json({message : ' invalid token '})
}
}


module.exports = authMiddleware;