var Promise = require('promise');
const uuidv1 = require('uuid/v1');
var db = require('../../connection/database');
var bcrypt = require('bcrypt');
var {sign} = require('jsonwebtoken');
var config = require('../../config/config');
var verifier = require('email-verify');
const {verifyEmail} = require("../../controllers/v1/email/emailController");
const {sendEmail} = require("../../controllers/v1/email/emailController");
const {FirebaseImageRemove} = require("../../controllers/v1/image/imageController");
const saltRounds = config.SALT_ROUNDS;

module.exports = {

  updateDetails: function(data) {
    return new Promise(function(resolve,reject){
      const assetId = data.params.assetId;
      const userId = data.owner.userId ;
      var query = `UPDATE assets SET`;
      data.body.asset_name ? query+=` asset_name='${data.body.asset_name}'` : null;
      data.body.bookmark ? query+=`, bookmark='${JSON.stringify(data.body.bookmark)}'` : null;
      data.body.address ? query+=`, address='${JSON.stringify(data.body.address)}'` : null;
      data.body.assetType ? query+=`, asset_type='${data.body.assetType}'` : null;

      query+= ` WHERE asset_id = '${assetId}'
      AND asset_id IN (
      SELECT asset_id from asset_permission p, owners o
      WHERE p.owner_id = o.owner_id
      and o.owner_id = '${userId}')`
      console.log("UPDATE_ASSET",query)
      db.query(query)
      .then(function(result){
        if(result.rowCount == 1){
          resolve("Asset updated successfully")
        }
        else{
          resolve("Asset not updated")
        }
      })
      .catch(function(err){
        process.env.NODE_ENV!= "production" ? console.error('UPDATE_ASSET_DETAILS',err.message) : null
        reject(function(err){
          process.env.NODE_ENV != "production" ? err : "Asset not found"
        })
      })
    })
  },
  addAsset : function (data) {
    return new Promise(function (resolve, reject) {
      if(!(data.body.hasOwnProperty('asset_username')) || !(data.userId))
      {
        reject({
          message: "something went wrong"
        })
      }
      const currentTime = Math.round( (new Date).getTime() / 1000 );
      const query = `INSERT INTO asset_permission
      (level,asset_id, owner_id, added_on)
      SELECT 1, (SELECT asset_id FROM assets WHERE asset_username='${data.body.asset_username}') , '${data.userId}' , ${currentTime} 
      WHERE
      NOT EXISTS (
          SELECT asset_permission.asset_id, owners.owner_id,assets.asset_username
          FROM asset_permission
          INNER JOIN owners ON asset_permission.owner_id=owners.owner_id
      INNER JOIN assets ON asset_permission.asset_id=assets.asset_id
      WHERE assets.asset_username = '${data.body.asset_username}'
      )`
      console.log(query);
      db.query(query).then(function (result) {
        if(process.env.NODE_ENV == "production")
        {
          console.log("[MODEL addAsset]",result.rows[0]);
        }
        resolve("Successfully added");
      })
      .catch(function (error) {
        if(process.env.NODE_ENV == "production"){
          error = "Something went wrong"
        }
        reject(error);
      });
    });
  },
  loginAsset: function (data) {
    return new Promise(function (resolve, reject) {
      if (!data.username || !data.password) {
        reject('username and/or password missing')
      } else {
        findAssetbyId(data.username)
          .then(function (asset) {
            return verifyAssetPassword(data.password, asset)
          })
          .then(function (result) {
            if (!result.isValid) {
              reject("Password incorrect")
            }
            const accesstoken = createAccessToken(result)
            return ({ id: result.asset_id, username:result.username, accessToken: accesstoken })
          })
          .then(function (result) {
            return getAssetdata(result)
          })
          .then(function (result) {
            resolve(result)
          })
          .catch(function (err) {
            console.log("Login asset:", err);
            reject(err);
          })
      }
    })
  },
  register: function (data) {
    return new Promise(async function (resolve, reject) {
      
        var added_on = data.t;
        if (data.hasOwnProperty("t")) {
          delete data.t;
        }
        if (!(data.hasOwnProperty("t"))) {
          added_on = parseInt(Math.round((new Date).getTime() / 1000));
        }
        if (!data.hasOwnProperty("id") || !data.hasOwnProperty('email')) {
          reject("no id found");
          return;
        }

        if(data["id"].length < 2) {
          reject("too small");
          return;
        }

        else if(data.password !== data.confirmPassword)
        {
          reject("Please confirm the password");
          return;
        }
        else {
            if(process.env.EMAIL_VERIFICATION === true) {
                try {
                    var emailVerificaiton = await verifyEmail(data.email);
                    console.log("Success (T/F): " + emailVerificaiton.success);
                    console.log("Info: " + emailVerificaiton.info);
                    if (!emailVerificaiton.success) {
                        reject("Invalid email")
                        return
                    }
                } catch (error) {
                    console.error("[OWNER_REGISTRATION_EMAIL_VERIFICATION]", error);
                    let emailBody = {};
                    emailBody.html = "<p><strong>Email not verified</strong></p>\n" +
                        "<p>Error logs:</p>\n" +
                        "<p>&nbsp;</p>" +
                        `<p> ${error} <p>` +
                        `<p> ${data.email} <p>`
                    emailBody.to = "quadreax@gmail.com"
                    emailBody.subject = "EMAIL VERIFICATION ERROR"
                    sendEmail(emailBody).then();
                    reject("Something went wrong");
                    return;
                }
            }

            const ver = emailVerificaiton && emailVerificaiton.success ? emailVerificaiton.success : null;
            if (ver || process.env.EMAIL_VERIFICATION != true) {
                bcrypt.hash(data.confirmPassword, saltRounds, function (err, hash) {
                    // '2016-11-09T15:13:00.380Z' standard UTC ISO8601 timestamp use toISOString()
                    // https://stackoverflow.com/questions/40510080/nodejs-how-to-get-current-day-without-timezone
                    // if (data.t < 123456) {
                    //     added_on = parseInt(Math.round( (new Date).getTime() / 1000 ));
                    // }
                    if (err) {
                        reject("Password Problem");
                    } else {
                        added_on = new Date().toISOString();
                        const last_change = parseInt(new Date().getTime() / 1000);
                        var deviceId = uuidv1();
                        var user_name = data.id;
                        var password = hash;
                        const query = `insert into assets (asset_name, asset_type, added_on, address, bookmark, asset_id, asset_username, asset_password, email, last_change) 
              values 
              ('${data.name}','${data.type}', '${added_on}', '${JSON.stringify(data.address)}', '${JSON.stringify(data.bookmark)}', '${deviceId}', '${user_name}', '${password}', '${data.email}', ${last_change})`;
                        console.log(query);
                        db.query(query)
                            .then(function (result) {
                                process.env.NODE_ENV == "production" ? null : console.log("Register resolve", result);
                                let emailBody = {};
                                emailBody.html = "<p><strong>NEW ASSET ADDED</strong></p>\n" +
                                    "<p>&nbsp;</p>" +
                                    `<p> NEW asset ADDED : ${user_name} <p>`
                                emailBody.to = "quadreax@gmail.com"
                                emailBody.subject = "NEW asset ADDED"
                                sendEmail(emailBody);
                                resolve({
                                    message: "Registration done"

                                });
                            })
                            .catch(function (error) {
                                process.env.NODE_ENV == "production" ? null : console.log("[MODEL DEVICE REGISTER] error", error);
                                reject("Something got error!");
                            })
                    }
                });
            }
        }
    })
  },
  updatePassword(req) {
    return new Promise(function(resolve, reject){
      const asset_id = req.asset.id;
      const currentPassword = req.body.currentPassword;
      let newPassword = req.body.newPassword;
      let confirmPassword = req.body.confirmPassword;

      findOneById(asset_id)
          .then(function(user){
            console.log(user);
            bcrypt.compare(currentPassword, user.asset_password, function(err, result) {

              if (err) {
                process.env.NODE_ENV != "production" ? console.error("WRONG PASSWORD",err) : null;
                reject(
                    process.env.NODE_ENV != "production" ? err : "Please use appropriate password"
                );
              }
              else if(result == true) {
                process.env.NODE_ENV != "production" ? console.log("result PASSWORD",result) : null;
                if (newPassword === confirmPassword) {
                  bcrypt.hash(confirmPassword, saltRounds, function (err, hash) {
                    newPassword = hash;
                    var milliseconds = Math.round( (new Date).getTime() / 1000 );
                    let last_password_change = milliseconds;
                    const query = `UPDATE assets set asset_password = '${newPassword}' , last_change = ${last_password_change} where asset_id='${asset_id}'`
                    db.query(query)
                        .then(function (result) {
                          resolve("Password Changed Successfully")
                        })
                        .catch(function (error) {
                          process.env.NODE_ENV != "production" ? console.log("[MODE CREATE USER]", error) : null;
                          reject(process.env.NODE_ENV == "production" ? "Something went Wrong" : error);
                        })
                  });
                }
                else{
                  reject("Confirm new password again")
                }
              }
              else{
                reject("Wrong password")
              }
            });
          }).catch(err => {
        process.env.NODE_ENV != "production" ? console.error("UPDATE_PASSWORD",err) : null
        reject(
            process.env.NODE_ENV != "production" ? err : "Password not changed"
        )
      })
    })
  },
  findOne: function(data) {
    return new Promise(function(resolve, reject) {
      if (!data.id ) {
        reject('error: must provide id')
      }
      else {
        if (data.id) {
          findOneById(data.id)
              .then(function(result) {
                delete result.password;
                resolve(result);
              })
              .catch(function(err) {
                reject(err);
              });
        }
        else{
          reject("Nothing found")
        }
      }
    });
  },
  getAsset(req) {
    return new Promise(function ( resolve, reject) {
      const asset_id = req.asset.id;
      const query = `SELECT * from assets where asset_id='${asset_id}'`;
      db.query(query)
          .then(function (result) {
            if (result.rows[0]) {
              delete result.rows[0].asset_password;
              delete result.rows[0].id;
              delete result.rows[0].last_change;
              delete result.rows[0].added_on;
              delete result.rows[0].asset_type;
              delete result.rows[0].asset_id;

              resolve(result.rows[0])
            } else {
              reject('No User Found')
            }
          })
          .catch(function (err) {
            reject(err);
          });
    })
  },
  updateProfile : function(req) {
    return new Promise(function(resolve, reject){
      const asset_id = req.asset.id;
      const fileName = req.body.file.filename;
      const query = `UPDATE assets SET avatar = '${fileName}' WHERE asset_id = '${asset_id}'`
      db.query(query)
          .then(function(result){
            resolve(
                req.body.file
            )
          }).catch(function(error){
        if (process.env.NODE_ENV != 'production'){
          console.error("[PUT_UPDATE_PROFILE]",error)
        }
        else {
          error = "somthing went wrong";
        }
        reject(error);
      })
    })
  },
  removeProfile(req) {
    return new Promise(function (resolve, reject) {
      const asset_id = req.asset.id;
      const query = `select avatar from assets where asset_id='${asset_id}'`
      const deleteQuery = `UPDATE assets SET avatar = null WHERE asset_id = '${asset_id}'`
      db.query(query)
          .then(function (result) {
            if (result.rows[0]) {
              if(result.rows[0].avatar != null) {
                FirebaseImageRemove(result.rows[0].avatar).catch(err => {
                  process.env.NODE_ENV != "production" ? console.error("REMOVE_PROFILE_error", err) : null
                })
                db.query(deleteQuery).then(result => {
                  process.env.NODE_ENV != 'production' ? console.log("REMOVE_PROFILE_LOG", result) : null;
                  resolve("Deleted Successfully")
                }).catch(err => {
                  process.env.NODE_ENV != 'production' ? console.error("REMOVE_PROFILE_error", err) : null;
                  reject(process.env.NODE_ENV != "production" ? err : "No Profile Picture")
                })
              }
              else {
                resolve("No profile picture")
              }
            } else {
              reject('No profile Picture')
            }
          })
          .catch(function (err) {
            process.env.NODE_ENV != 'production' ? console.error("REMOVE_PROFILE_error", err) : null;
            reject(
                process.env.NODE_ENV != "production"  ? err : "No Profile Picture"
            );
          });
    })
  }
}

function findOneById  (asset_id) {
  return new Promise(function (resolve, reject) {
    const query = `SELECT * FROM assets where asset_id= '${asset_id}'`;
    db.query(query)
        .then(function (result) {
          if (result.rows[0]) {
            resolve(result.rows[0]);
          }
          else {
            reject('no user found')
          }
        })
        .catch(function (err) {
          reject(err);
        });
  })
}


findAssetbyId =  user_name =>{
  return new Promise(function (resolve, reject) {
    const query = `SELECT * FROM assets where asset_username= '${user_name}'`;
    db.query(query)
      .then(function (result) {
        if (result.rows[0]) {
          resolve(result.rows[0]);
        }
        else {
          reject('no user found')
        }
      })
      .catch(function (err) {
        reject(err);
      });
  })
}




function verifyAssetPassword(password, asset) {
  return new Promise(function (resolve, reject) {
    bcrypt.compare(password, asset.asset_password, function (err, result) {
      if (err) {
        console.log("bcrypt compare", err);
        reject(err);
      }
      else {
        resolve({ isValid: result, asset_id: asset.asset_id, username: asset.asset_username });
      }
    });
  });
}

const createAccessToken = (asset) => {
  return sign({
    id:asset.asset_id,
    username:asset.username
   }, config.SECRET, {
    expiresIn: config.JWT_EXPIRATION,
  });
};

getAssetdata = data => {
  return new Promise(function(resolve, reject) {
    const query = `select * from assets where asset_id = '${data.id}'`
    db.query(query)
      .then(function(result){
        const userid = result.rows[0].asset_id
        const username = result.rows[0].asset_username
        const accessToken = data.accessToken
        const asset_name = result.rows[0].asset_name;
        const isAuthorized = true;
        resolve({
          userid,
          username,
          accessToken,
          asset_name,
          isAuthorized
        })
      })
      .catch(function(err){
        console.log("owners data errors",err);
        reject(err)
      })
  })
}