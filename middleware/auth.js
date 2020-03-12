//middleware is just a function that has access to the request and response cycle
//and req and res object, every time we hit EndPoints we can fire off this middleware
//and we just wont to check if there is a token in the header

const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next){
   //Get token from header
   //x-auth-token -> key to the token
   const token = req.header("x-auth-token");

   //Check if not token
   if(!token){
      //401 - unauthorized
      return res.status(401).json({msg:"No token, authorization denied"})
   }

   try {
      const decoded = jwt.verify(token, config.get("jwtSecret"))
      //once it gets verified the payload is gonna be put in decoded
      //we will assign that user to request object
      req.user = decoded.user
      next();
   } catch (err) {
      res.status(401).json({msg:"Token is not valid"})
   }
}