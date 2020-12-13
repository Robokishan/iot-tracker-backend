var router = require('express').Router();
var jwt = require('jsonwebtoken');
var User = require('../../models/v1/owner.js')
var config = require('../../config/config');

authentication = (req, res, next) => {
    const authorization = req.headers['authorization'];
    if (!authorization && !req.cookies.token ){
      var message = process.env.NODE_ENV === "production" ? "Page Not found" : "Please mention authorizatin token"
      return res.status(404).json({
        message:message
      });
    }
  
    //get the token from authorization : Bearer <token>
    if ( req.cookies.token ) {
      var token = req.cookies.token;
    }
    else {
      var token = authorization.split(' ')[1]; 
    }
  
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
            if(decoded.iat <= parseInt(user.last_change) ) {
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