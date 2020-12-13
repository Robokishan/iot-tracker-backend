var router = require('express').Router();
var jwt = require('jsonwebtoken');
var User = require('../../models/v1/owner.js');
var config = require('../../config/config');

authentication = (req, res, next) => {
    const authorization = req.headers['authorization'];
    if (!authorization){
      return res.status(404).json({
        message:"Page Not found"
      });
    }
  
    //get the token from authorization : Bearer <token>
    const token = authorization.split(' ')[1]; 
  
    //check if token exists
    if (token) {
      
      jwt.verify(token, config.SECRET, function(err, decoded) {
        if (err) {
          return res.status(401).json({
            message: 'failed authentication: invalid token'
          });
        }
        //success token
        User.findOne({ 'id': decoded.userId })
          .then(function(user) {
            if(decoded.iat <= parseInt(user.last_password_change) ) {
              console.log("error authentication");
              throw "expired";
            }
            process.env.NODE_ENV != "production" ? console.log("AUTHENTICATION_V1", decoded):null;
            req.userId = decoded.userId;
            req.owner = decoded;
            next();
          })
          .catch(function(err) {
            console.log("Authorization",err);
            return res.status(401).json({
              message: 'failed authentication'
            });
          });
      });
    }
    //no token found
    else {
      return res.status(401).json({
        message: 'failed authentication: no token provided.'
      });
    }
  }

  module.exports = authentication;