var Admin = require('../models/v1/admin.js');
var jwt = require('jsonwebtoken');
var config = require('./../config/config');
const uuidv1 = require('uuid/v1');
var { adminRoles, superadminRoles }  = require('../config/rules.js')

module.exports = {
    authAdmin: function (req, res, next) {
        try {
            if(adminRoles.includes(req.owner.role))
            {
                process.env.NODE_ENV != "production" ? console.log("AUTH_ADMIN",req.owner.role) : null;
                next();
            }
            else 
            {                
                process.env.NODE_ENV != "production" ? console.log("AUTH_ADMIN",req.owner) : null;
                res.status(401).json({
                    error:"unauthorized"
                })
            }
        }
        catch(err)
        {
            process.env.NODE_ENV != "production" ? console.log("AUTH_ADMIN",err) : null;
            res.status(401).json({
                error:"unauthorized"
            })
        }
    },
    authSuperAdmin: function (req, res, next) {
        try {
            if(superadminRoles.includes(req.owner.role))
            {
                process.env.NODE_ENV != "production" ? console.log("AUTH_ADMIN",req.owner.role) : null;
                next();
            }
            else 
            {                
                process.env.NODE_ENV != "production" ? console.log("AUTH_ADMIN",req.owner) : null;
                res.status(401).json({
                    error:"unauthorized"
                })
            }
        }
        catch(err)
        {
            process.env.NODE_ENV != "production" ? console.log("AUTH_ADMIN",err) : null;
            res.status(401).json({
                error:"unauthorized"
            })
        }
    },
}