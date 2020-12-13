/* asset Controllers */



var User = require('../models/v1/owner');
var Device = require('../models/v1/asset');
var jwt = require('jsonwebtoken');
const {FirebaseImageRemove} = require("./v1/image/imageController");

module.exports = {

    addAsset: function (req, res) {
      Device.addAsset(req)
      .then(function (result){
        return res.status(200).json(result);
      }).catch(function (error) {
        process.env.NODE_ENV == "production" ? null : console.log("[CONTROLLER addasset]",error);
        if(process.env.NODE_ENV == "production")
        {
          error = "Something went wrong";
        }
        return res.status(401).json({
          message: error
        });
      })
    },

    registernewAsset: function(req, res) {
            Device.register(req.body)
            .then(function (result){
                return res.status(200).json(result);
            }).catch(function(err){
                res.status(401).json({
                    message:err
                });
            }) 
    },
    
    validateAsset: function (req, res) {
        Device.loginAsset(req.body)
          .then(function (result) {
            if (result.isAuthorized === true) {
              return res.status(200).json({
                  "asset_id":result.userid,
                  "username":result.username,
                  "name":result.asset_name,
                  "token": {
                    "access_token": result.accessToken,
                    "expires_in": jwt.decode(result.accessToken).exp,
                    "token_type": "bearer"
                  }
                }
              );
            }
            else {
              return res.status(401).json({
                message: 'bad credentials'
              });
            }
          })
          .catch(function (err) {
              process.env.NODE_ENV == "production" ? null : console.log("[CONTROLLER validateAsset]",err); 
            return res.status(401).json({
              message: 'bad credentials'
            })
          })
      },


    getOverview: function (req, res) {
        const userId = req.userId;
        User.findDeviceOverview(userId).then(function(result){
            return res.status(200).json(result)
        }).catch(function (err){
            return res.status(400).json({
                message: process.env.NODE_ENV == "production" ? "NOT AVAILABLE" : err
            })
        })
    },

    listAssets: function (req, res) {
        const userId = req.userId;
        User.findUserAsset(userId).then(function (result) {
                return res.status(200).json(result)
            }).catch(function (err) {
                return res.status(400).json({
                    message: process.env.NODE_ENV === "production" ? "NOT AVAILABLE" : err
                })
            })
    },

    getALldata: function(req, res) {
        try {
          const userId = req.userId;
          if (userId !== null) {
            User.dataRange(req.params.start,req.params.end)
          .then(function(result) {
            return res.status(200).json(result)
          })
          .catch(function(err) {
            console.log("Get All data",err);
            return res.status(400).json({
              message: err
            })
          })
         }
        } catch (err) {
          res.send({
            error: `${err.message}`,
          })
        }
    },

    insertData: function (req, res) {
        if(!req.body.d){
            return res.status(400).json({
                err:"something wend wrong"
            });
        } else{
        User.storeData(req.params.assetId, req.body.d)
            .then(function (result) {
                return res.status(200).json(result)
            })
            .catch(function (err) {
                return res.status(400).json({
                    message: err
                })
            })
        }
    },

    //TODO: protect this api with only owner who has access to asset id can access
    getData: function (req, res) {
        User.getAssetdata(req)
        .then(function(result){
            // console.log("[OVERVIEW]:",result);
            return res.status(200).json({
                data: {
                    payload:result
                }
            })
        })
        .catch(function(err){
            res.status(400).send("Something went wrong: " + err)
        })
    },


    // README: PROVIDE LTE GTE
    getAssethits: function(req, res){
      User.getAssethits(req).then(function(result){
          return res.status(200).json({
            data: {
                payload:result
            }
        })
      }).catch(function(err){
        res.status(400).send("Something went wrong: " + err)
      })
    },
    updateDetail: function(req, res){
      Device.updateDetails(req).then(function(result){
        return res.status(200).json({
            message: result
        })
      })
      .catch(function(err){
          console.log(err.message)
          res.status(400).send("something went wrong ", err )
      })
    },
    updatePassword(req, res) {
        if(!req.body.currentPassword || !req.body.newPassword || !req.body.confirmPassword || !req.asset.id)
            return res.status(401).send("Unauthorized");
        Device.updatePassword(req)
            .then(result => {
                return res.status(200).json(result)
            }).catch(error => {
            return res.status(403).json({
                message: process.env.NODE_ENV != "production" ? error : "Something went wrong"
            })
        })
    },
    updatePicture:async function (req,res) {
        try{
            const {avatar} = await Device.getAsset(req);
            if(avatar != null){
                FirebaseImageRemove(avatar).catch(err => {
                    process.env.NODE_ENV != "production" ? console.error("REMOVE_PROFILE", err) : null
                })
            }
        }
        catch (e) {
            console.error("UPDATE PICTURE", "error")
        }

        Device.updateProfile(req)
            .then(function(result){
                return res.status(200).json({
                    image: result.url,
                    filename : result.filename
                })
            }).catch(function (err){
            return res.status(403).json({
                message: process.env.NODE_ENV != "production" ? err : "Something went wrong"
            })
        })
    },
    removePicture(req,res) {
        Device.removeProfile(req)
            .then(result=>{
                return res.status(200).json({
                    message: result
                })
            })
            .catch(err=>{
                return res.status(403).json({
                    message : process.env.NODE_ENV != "production" ? err : "No profile picture"
                })
            })
    },
}