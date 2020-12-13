var Promise = require('promise');
var db = require('../../connection/database');
var bcrypt = require('bcrypt');
var config = require('../../config/config');
const { sign } = require('jsonwebtoken');
var verifier = require('email-verify');
var emailVerification = verifier.infoCodes;
var {FirebaseImageRemove} = require('../../controllers/v1/image/imageController.js')
var firebaseConfig = require('../../config/firebase/config');
const {verifyEmail} = require("../../controllers/v1/email/emailController");
//change it in production
const saltRounds = config.SALT_ROUNDS;
const {sendEmail} = require("../../controllers/v1/email/emailController");

module.exports = {
  findAll: function() {
    return new Promise(function(resolve, reject) {
      db.query('SELECT owner_id, user_name, email FROM owners', [])
        .then(function(results) {
          resolve(results.rows);
        })
        .catch(function(err) {
          reject(err);
        });
    });
  }, 

  findDeviceOverview: function(userId) {
    return new Promise(function (resolve, reject){
      if(userId){
      const query = `SELECT assets.asset_username, tt.asset_id, tt.added_on, tt.payload, tt.payload_id, assets.asset_name, assets.asset_type, assets.avatar
                    FROM asset_data tt
                    INNER JOIN
                    (SELECT asset_id, MAX(payload_id) AS PAYID, MAX(added_on) AS MaxDateTime
                    FROM asset_data 
                    GROUP BY asset_id) groupedtt 
                    ON tt.asset_id = groupedtt.asset_id 
                    AND tt.added_on = groupedtt.MaxDateTime
                    AND tt.payload_id=groupedtt.PAYID
                    INNER JOIN assets ON tt.asset_id = assets.asset_id
                    WHERE tt.asset_id IN (
                    SELECT assets.asset_id FROM owners INNER JOIN asset_permission ON asset_permission.owner_id=owners.owner_id 
                    INNER JOIN assets ON assets.asset_id=asset_permission.asset_id WHERE asset_permission.owner_id='${userId}')`
        db.query(query).then(result => {
          process.env.NODE_ENV == "production" ? null: console.log("[MODEL USER findDeviceOverview]",result.rows);
          result.rows.map((data) => {
            data.avatar = (data.avatar != null ? `${firebaseConfig.URL_PREFIX}${firebaseConfig.PROJECT_ID}.appspot.com/${data.avatar}`: data.avatar)
            delete data.payload_id;
            data.payload = {
              d: data.payload
            }
          })
          resolve(
            result.rows
          )
        }).catch(err => {
          reject(err)
        })
      }
      else{
        reject("No userId");
      }

    })
  },

  dataRange: function(start,end) {
    return new Promise(function(resolve, reject) {
      db.query('SELECT * FROM asset_data WHERE added_on >= ($1) and added_on <= ($2) order by added_on desc',[start,end])
      .then(function(results) {
        resolve(results.rows)
      })
      .catch(function(err) {
        reject(err)
      })
    })
  },

  findUserAsset: function(userId) {
    return new Promise(function(resolve, reject){
      const query = `select owners.owner_id, owners.user_name, owners.owner_name, owners.email, asset_permission.asset_id, assets.asset_name, assets.asset_type, assets.asset_username, asset_permission.added_on, assets.avatar from asset_permission right join owners on asset_permission.owner_id=owners.owner_id inner join assets on assets.asset_id=asset_permission.asset_id where asset_permission.owner_id = '${userId}'`
      db.query(query)
      .then(function(results) {
        results.rows.map((data) =>{
          data.avatar = (data.avatar != null ? `${firebaseConfig.URL_PREFIX}${firebaseConfig.PROJECT_ID}.appspot.com/${data.avatar}`: data.avatar)
        })
        resolve(results.rows)
      })
      .catch(function(err) {
        if(process.env.NODE_ENV != "production")
        reject(err)
      })
    })
  },

  storeData: function(id,data) {
    return new Promise(function(resolve,reject) {
      validateJson(data)
      .then(function(data) {
        var t = data.t;
        if(!(data.hasOwnProperty("t")))
        {
          t = parseInt(Math.round( (new Date).getTime() / 1000 ));
        }
        if (data.t < 123456) {
          t = parseInt(Math.round( (new Date).getTime() / 1000 ));
        }

          db.query('insert into asset_data (added_on, modified_on, payload, asset_id) VALUES ($1,$2,$3, $4)',[t,t,data,id])
          .then(function(result) {
            if(result.rowCount > 0)
            {
              resolve({
                message:"Data send successfully"
              })
            }
            else {
              reject({
                err:"Something wend wrong"
              })
            }
          })
          .catch(function(err) {
          reject(err)
        })
      })
      
    })
  },

  getAssetdata: function(req) {
    return new Promise(function(resolve, reject){
      const data = req.query;

      const userId = req.userId;
      let lte = data.lte ? parseInt(data.lte) : parseInt(new Date().getTime() / 1000);
      let gte = data.gte ? parseInt(data.gte) : parseInt(lte - 3600);
      let limit = data.limit ? parseInt(data.limit) : 25;
      let page = data.page ? parseInt(data.page) : 0;
      page = parseInt((page-1) * limit);
      page = page < 0 ? 0 : page;
      let assetId = req.params.assetId ? req.params.assetId : false;

      //CHECK IF asset_id is UUID or not for future TODO: GET DATA USING NAME

      if(assetId == false) {
        reject("no deviceid found");
      } else {

        const query = `SELECT assets.asset_name, assets.asset_username, assets.asset_id, assets.avatar, asset_data.added_on, asset_data.payload, count(*) OVER() AS total_data FROM asset_data inner join asset_permission on asset_permission.asset_id=asset_data.asset_id inner join assets on asset_data.asset_id=assets.asset_id WHERE asset_data.added_on between ${gte} and ${lte} and asset_permission.asset_id = '${assetId}' and asset_permission.owner_id='${userId}' ORDER  BY payload_id asc`;

        //TODO: CREATE NEW API FOR TABLEVIEW
        // const query = `SELECT assets.asset_name, assets.asset_username, assets.asset_id, asset_data.added_on, asset_data.payload, count(*) OVER() AS total_data FROM asset_data inner join asset_permission on asset_permission.asset_id=asset_data.asset_id inner join assets on asset_data.asset_id=assets.asset_id WHERE asset_data.added_on between ${gte} and ${lte} and asset_permission.asset_id = '${assetId}' and asset_permission.owner_id='${userId}' ORDER  BY payload_id asc  limit ${limit} offset ${page}`;


        db.query(query).then(result => {
          result.rows.map((data) =>{
            data.avatar = (data.avatar != null ? `${firebaseConfig.URL_PREFIX}${firebaseConfig.PROJECT_ID}.appspot.com/${data.avatar}`: data.avatar)
          })
          resolve(
            result.rows
          )
        }).catch(err => {
          reject(err)
        })
      }
    })
  },

  latestData: function(id) {
    return new Promise(function(resolve,reject) {
      db.query('SELECT * FROM user_table WHERE device_id = ($1) ORDER BY time DESC FETCH FIRST ROW ONLY',[id])
      .then(function(result){
        resolve(result.rows)
      })
      .catch(function(err){
        reject(err)
      })
    })
  },



  // bad function use authenticate function for better purpose
  loginUser: function(data) {
    return new Promise(function(resolve, reject){
      if (!data.email || !data.password) {
        reject('email and/or password missing')
      } else {
        findByEmail(data.email)
        .then(function(user){
          return verifyPassword(data.password, user)
        })
        .then(function(result) {
          if (!result.isValid) {
            reject("Password incorrect")
          }
          const accesstoken = createAccessToken(result)
          return ({ owner_id:result.owner_id, accessToken:accesstoken})
        })
        .then(function(result){
          return ownerData(result)
        })
        .then(function(result){
          resolve(result)
        })
        .catch(function(err) {
          reject(err);
        })
      }
    })
  },

  create: function(data) {
    return new Promise(async function(resolve,reject) {

      data.type ? data.type : reject("something went wronginsh");
      
      //verify if domain email exists
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
      if(ver || process.env.EMAIL_VERIFICATION != true) {
        if (data.password === data.confirmPassword) {
          bcrypt.hash(data.password, saltRounds, function (err, hash) {
            data.password = hash;
            // const query = `INSERT INTO owners (user_name, password, email, owner_name, last_change, address, owner_details, owner_id, created_on, type) VALUES
            // ( '${data.username}', '${data.password}', '${data.email}', '${data.name}', '${data.last_password_change}', '${JSON.stringify(data.address)}', '${JSON.stringify(data.owner_details)}', '${data.owner_id}', ${data.timestamp}, ${data.type})`;
            // console.log(query)
            const query = `
                INSERT INTO owners (user_name, password, email, owner_name, last_change, address, owner_details, owner_id, created_on, type, level_permission) VALUES 
                ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`
            db.query(query, [data.username, data.password, data.email, data.name, data.last_password_change, JSON.stringify(data.address), JSON.stringify(data.owner_details), data.owner_id, data.timestamp, data.type, data.role])
                .then(function (result) {
                  let emailBody = {};
                  emailBody.html = "<p><strong>NEW USER ADDED</strong></p>\n" +
                      "<p>&nbsp;</p>" +
                      `<p> NEW USER ADDED : ${data.email} <p>`
                  emailBody.to = "quadreax@gmail.com"
                  emailBody.subject = "NEW USER ADDED"
                  sendEmail(emailBody);
                  result.rows.id = data.owner_id;
                  resolve(result.rows)
                })
                .catch(function (error) {
                  process.env.NODE_ENV == "production" ? null : console.log("[MODE CREATE USER]", error);
                  reject("Registration Failed");
                })
          });
        } else {
          reject("Password is different");
        }
      }
    })
  },

  findOne: function(data) {
    return new Promise(function(resolve, reject) {
        if (!data.id ) {
          reject('error: must provide id or email')
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
          else if (data.email) {
            findByEmail(data.email)
              .then(function(result) {
                delete result.password;
                resolve(result);
              })
              .catch(function(err) {
                reject(err);
              });
          }
        }
      });
    },


  authenticate: function(data) {
    return new Promise(function(resolve, reject) {
      if (!data.email || !data.password) {
        reject('error: email and/or password missing')
      }
      else {
        // change all of this to one transaction?
        findOneByEmail(data.email)
          .then(function(user) {
            // Reset login attempts if more than 15 minutes have passed
            if (Date.now() - user.last_login_attempt >= 900000) {
              // user.login_attempts = -1;
            }
            user.login_attempts = -1;
            return db.query(
              'UPDATE users SET last_login_attempt = now(), login_attempts = $2 WHERE email = $1 returning *',
              [data.email, user.login_attempts + 1]
            );
          })
          .then(function(result) {
            if (result.rows[0].login_attempts < 10) {
              return result.rows[0];
            }
            else {
              reject('error: attempting to login too frequently, try again in 15 minutes');
            }
          })
          .then(function(user) {
            return verifyPassword(data.password, user);
          })
          .then(function(result) {
            resolve({ isAuthorized: result.isValid,owner_id:result.owner_id, id: result.id });
          })
          .catch(function(err) {
            reject(err);
          });
      }
    });
  },

  deleteRefreshToken: function(id) {
    db.query('UPDATE owners SET refresh_token = NULL WHERE user_id = $1',[id])
    .then(function(result){
      resolve(result)
    })
    .catch(function(err){
      reject(err)
    })
  },

  getAssethits : function(req){
    return new Promise(function(resolve,reject) {
      const owner_id = req.owner.userId;
      const data  = req.query;
      let lte = data.lte ? parseInt(data.lte) : parseInt(new Date().getTime() / 1000);
      let gte = data.gte ? parseInt(data.gte) : parseInt(lte - 3600);
      const query = `select count(*) hits, assets.asset_username, assets.asset_name, asset_data.asset_id,to_timestamp(cast(asset_data.added_on as bigint))::date time_stamp 
      from asset_data inner join assets on asset_data.asset_id=assets.asset_id inner join asset_permission on asset_data.asset_id=asset_permission.asset_id where asset_permission.owner_id='${owner_id}' and asset_data.added_on between ${gte} and ${lte} group by assets.asset_name,asset_data.asset_id,assets.asset_username,time_stamp ORDER BY time_stamp ASC`;

      db.query(query)
      .then(function(result){
        resolve(
          result.rows
        )
      }).catch(function(error){
        if (process.env.NODE_ENV != 'production'){
           console.error("[GET_ASSET_HITS]",error)
        }
        else {
          error = "somthing went wrong";
        }
        reject(error);
      })
    })
  },
    updateProfile : function(req) {
      return new Promise(function(resolve, reject){
        const owner_id = req.owner.userId;
        const fileName = req.body.file.filename;
        const query = `UPDATE owners SET avatar = '${fileName}' WHERE owner_id = '${owner_id}'`
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
      const ownerId = req.owner.userId;
      const query = `select avatar from owners where owner_id='${ownerId}'`
      const deleteQuery = `UPDATE owners SET avatar = null WHERE owner_id = '${ownerId}'`
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
  },
  getowner(req) {
    return new Promise(function ( resolve, reject) {
      const ownerId = req.owner.userId;
      const query = `SELECT * from owners where owner_id='${ownerId}'`;
      db.query(query)
          .then(function (result) {
            if (result.rows[0]) {
              delete result.rows[0].password;
              delete result.rows[0].id;
              delete result.rows[0].last_change;
              delete result.rows[0].created_on;
              delete result.rows[0].type;
              delete result.rows[0].level_permission;
              
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
    updatePassword(req) {
        return new Promise(function(resolve, reject){
          const owner_id = req.owner.userId;
          const currentPassword = req.body.currentPassword;
          let newPassword = req.body.newPassword;
          let confirmPassword = req.body.confirmPassword;

          findOneById(owner_id)
              .then(function(user){
                bcrypt.compare(currentPassword, user.password, function(err, result) {

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
                        const query = `UPDATE owners set password = '${newPassword}' , last_change = ${last_password_change} where owner_id='${owner_id}'`
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
  updateDetails: function(data) {
    return new Promise(function(resolve,reject){
      const owner_id = data.owner.userId ;
      var query = `UPDATE owners SET`;
      data.body.owner_name ? query+=` owner_name=$1` : null;
      data.body.owner_details ? query+=`, owner_details=$2` : null;
      data.body.address ? query+=`, address=$3` : null;
      query+= ` WHERE owner_id = '${owner_id}'`
      console.log("UPDATE_ASSET",query)
      db.query(query,[data.body.owner_name, JSON.stringify(data.body.owner_details), JSON.stringify(data.body.address)])
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


  // deleteAsset if it is owned by OWNER
  deleteAsset: function(req) {
    return new Promise(async function(resolve, reject){
      const asset_id =  req.query.asset_id ;
      const owner_id = req.owner.userId;
      const delete_asset_permission = `delete from asset_permission where asset_permission.asset_id='${asset_id}' 
                                       and asset_permission.owner_id='${owner_id}'`
      const check_asset = `select count(*) from asset_permission where asset_permission.asset_id='${asset_id}'`
      const delete_asset_data = `delete from asset_data where asset_data.asset_id='${asset_id}'` 

      try {
        console.log("delete_asset_permission",delete_asset_permission);
        console.log("check_asset",check_asset);
        console.log("delete_asset_data",delete_asset_data);
        let {rowCount} = await db.query(delete_asset_permission);
        
        if( rowCount == 0) {
          throw new Error("Asset not deleted");
        }
        
        let {rows} = await db.query(check_asset);
        let leftAsset = parseInt(rows[0].count);

        if(leftAsset === 0 ) {
          let {rowCount} = await db.query(delete_asset_data);
          rowCount = parseInt(rowCount);
          if(rowCount !== 0){
            resolve(`${asset_id} deleted but data kept because someone else owe this asset`);
          }
          else {
            resolve(`${asset_id} and its data has been Deleted `);
          }
        }
        else {
          resolve(`${asset_id} Deleted`);
        }
        
      } catch(error) {
        if(process.env.NODE_ENV=='production'){
          error = "Not success"
        }
        else{
          console.error("DELETE_OWNER_ASSET",error);
        }
        reject(error)
      }
    })
  },
}

/* function list for misc things */

function validateJson(data) {
  return new Promise(function(resolve) {
    var objectConstructor = ({}).constructor
    if (data.constructor === objectConstructor) {
      resolve(data)
    } else {
      reject("Data must be in Json formate")
    }
  })
}

findByEmail = email => {
  return new Promise(function(resolve, reject) {
    db.query('SELECT * FROM owners WHERE email = $1', [email])
      .then(function(result) {
        if (result.rows[0]) {
          resolve(result.rows[0]);
        }
        else {
          reject('no user found')
        }
      })
      .catch(function(err) {
        reject(err);
      });
  })
}

function findOneById (id) {
  return new Promise(function(resolve, reject) {
    db.query('SELECT * FROM owners WHERE owner_id = $1', [id])
      .then(function(result) {
        if (result.rows[0]) {
          resolve(result.rows[0]);
        }
        else {
          reject('no user found')
        }
      })
      .catch(function(err) {
        reject(err);
      });
  })
}

function verifyPassword(password, user) {
  return new Promise(function(resolve, reject) {
    bcrypt.compare(password, user.password, function(err, result) {
      if (err) {
        reject(err);
      }
      else {
        resolve({ isValid: result, owner_id:user.owner_id, id: user.id, email: user.email, role: user.level_permission });
      }
    });
  });
}

function ownerData(data) {
  return new Promise(function(resolve, reject) {
    const query = `select owner_id,user_name,email,created_on, address, owner_name, owner_details, avatar from owners where owner_id = '${data.owner_id}'`;
    db.query(query)
    .then(function(result){
      const name = result.rows[0].owner_name
      const userId = result.rows[0].owner_id
      const userName = result.rows[0].user_name
      const email = result.rows[0].email
      const createdOn = result.rows[0].created_on
      const address = result.rows[0].address
      const owner_details = result.rows[0].owner_details
      const accessToken = data.accessToken
      var avatar = "null"

      if(result.rows[0].avatar != null ) {
        avatar = `${firebaseConfig.URL_PREFIX}${firebaseConfig.PROJECT_ID}.appspot.com/${result.rows[0].avatar}`
      }
      const isAuthorized = true;
      resolve({
        name,
        userId,
        userName,
        email,
        createdOn,
        avatar,
        accessToken,
        isAuthorized,
        address,
        owner_details
      })
    })
    .catch(function(err){
      reject(err)
    })
  })
}
const createAccessToken = (user) => {
  if(process.env.NODE_ENV != "production")
  {
    console.log("[CREATE_ACCESS_TOKEN]", user);
  }
  return sign({
    role:user.role,
    userId:user.owner_id,
    email:user.email
   }, config.SECRET, {
    expiresIn: config.JWT_EXPIRATION,
  });
};