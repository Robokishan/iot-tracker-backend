var User = require('../models/v1/owner');
var jwt = require('jsonwebtoken');
const uuidv1 = require('uuid/v1');
var {FirebaseImageRemove} = require('../controllers/v1/image/imageController.js')
var firebaseConfig = require('../config/firebase/config.js');
module.exports = {

  createUser: function(req, res) {
    var milliseconds = Math.round( (new Date).getTime() / 1000 );
    req.body.last_password_change = milliseconds;
    req.body.timestamp = milliseconds;
    req.body.owner_id = uuidv1();
    User.create(req.body)
      .then(function(result) {
        return res.status(200).json({
          message: `success! created account for new user ${req.body.email}`,
          id: result.id
        });
      })
      .catch(function(err) {
        return res.status(400).json({
          message: err
        });
      });
  },

  getAllUserDetails: function (req, res) {
    try {
      const userId = req.userId;
      if (userId !== null) {
        User.findAll()
          .then(function (result) {
            return res.status(200).json(result);
          })
          .catch(function (err) {
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

  validateUser: function (req, res) {
    User.loginUser(req.body)
      .then(function (result) {
        console.log("expr",new Date(Date.now() + 123))
        if (result.isAuthorized === true) {
          return res.cookie('token', result.accessToken, {
            // expires: new Date(Date.now() + expiration),
            secure: false, // set to true if your using https
            httpOnly: true,
          }).status(200).json({
              // "userId": result.userId,
              "name":result.name,
              "email": result.email,
              "address":result.address,
              "org":result.owner_details,
              "token": {
                "access_token": result.accessToken,
                "expires_in": jwt.decode(result.accessToken).exp,
                "token_type": "bearer"
              },
              "updated_on": result.createdOn,
              "created_on": result.createdOn,
              "avatar":result.avatar
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
        console.log("error",err)
        return res.status(401).json({
          message: 'bad credentials'
        })
      })
  },

  logOutuser: function (req, res) {
    res.clearCookie('refreshtoken', { path: '/refresh_token' })
    User.deleteRefreshToken(req.params.id)
    return res.send({
      message: 'Logged out',
    })
  },

    updatePicture:async function (req,res) {
        try{
          const {avatar} = await User.getowner(req);
          if(avatar != null){
              FirebaseImageRemove(avatar).catch(err => {
                  process.env.NODE_ENV != "production" ? console.error("REMOVE_PROFILE", err) : null
              })
          }
        }
        catch (e) {
          console.error("UPDATE PICTURE", "error")
        }

        User.updateProfile(req)
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
        User.removeProfile(req)
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
    getOwner(req, res) {
        User.getowner(req)
            .then(result => {
                result.avatar = (result.avatar != null ? `${firebaseConfig.URL_PREFIX}${firebaseConfig.PROJECT_ID}.appspot.com/${result.avatar}`: result.avatar)
                return res.status(200).json(result)
                    .catch(error=>{
                        return res.status(403).json({
                            message: process.env.NODE_ENV != "production" ? error : "Something went wrong"
                        })
                    });
            })
    },
    updatePassword(req, res) {
        if(!req.body.currentPassword || !req.body.newPassword || !req.body.confirmPassword || !req.owner.userId)
            return res.status(401).send("Unauthorized");
        User.updatePassword(req)
            .then(result => {
                return res.status(200).json(result)
            }).catch(error => {
                return res.status(403).json({
                    message: process.env.NODE_ENV != "production" ? error : "Something went wrong"
                })
        })
    },
    updateDetail: function(req, res){
        User.updateDetails(req).then(function(result){
            return res.status(200).json({
                message: result
            })
        })
            .catch(function(err){
                console.log(err.message)
                res.status(400).send("something went wrong ", err )
            })
    },

    deleteAsset: function(req ,res ){
        User.deleteAsset(req).then(function(result){
          return res.status(200).json({
              message:result
          });
        }).catch(function(err){
            console.log("OWNER_DELETE_ASSET",err.message)
            return res.status(400).json({
              message: err.message
            });
        })
    }
}


