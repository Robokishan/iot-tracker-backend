var Promise = require('promise');
const uuidv1 = require('uuid/v1');
var db = require('../../connection/database.js');
var bcrypt = require('bcrypt');
var {sign} = require('jsonwebtoken');
var config = require('../../config/config');
const saltRounds = config.SALT_ROUNDS;
var verifier = require('email-verify');
var emailVerification = verifier.infoCodes;
var {sendEmail} = require('../../controllers/v1/email/emailController.js')
var {transporter, transporterConfig} = require('../../config/mail/sendemail.js')
var {adminRoles} = require('../../config/rules.js')

module.exports = {
  OwnerAssetCount : function (data) {
    return new Promise(function (resolve, reject) {
      const query = `SELECT owner_name, user_name, owner_id, email, level_permission, 
      (SELECT COUNT(*) FROM asset_permission od WHERE  od.owner_id =c.owner_id) totalasset 
      FROM owners c`;
      console.log(query);
      db.query(query).then(function (result) {
        if(process.env.NODE_ENV == "production")
        {
          console.log("[OWNER_ASSET_COUNT COUNT]",result.rows);
        }
        resolve(result.rows);
      })
      .catch(function (error) {
        if(process.env.NODE_ENV == "production"){
          error = "Something went wrong"
        } else {
            console.log("[OWNER_ASSET_COUNT ERROR]", error);
        }
        reject(error);
      });
    });
  },
  Overview : function (data){
    return new Promise(function(resolve, reject){
      const query = `SELECT 
      ( SELECT COUNT(*) FROM   owners ) AS totalOwners,
      ( SELECT COUNT(*) FROM   assets ) AS totalAssets`;
      console.log("ADMIN_CONTROLLER_OVERVIEW",query);
      db.query(query).then(function (result) {
        if(process.env.NODE_ENV == "production")
        {
          console.log("[OWNER_ASSET_COUNT COUNT]",result.rows[0]);
        }
        resolve(result.rows[0]);
      })
      .catch(function (error) {
        if(process.env.NODE_ENV == "production"){
          error = "Something went wrong"
        } else {
            console.log("[OWNER_ASSET_COUNT ERROR]", error);
        }
        reject(error);
      });
    });
  },
  getAssethits : function(req){
    return new Promise(function(resolve,reject) {
      const data  = req.query;
      let lte = data.lte ? parseInt(data.lte) : parseInt(new Date().getTime() / 1000);
      let gte = data.gte ? parseInt(data.gte) : parseInt(lte - 3600);
      var query = `select count(*) hits, assets.asset_username, assets.asset_name, asset_data.asset_id,to_timestamp(cast(asset_data.added_on as bigint))::date time_stamp 
      from asset_data inner join assets on asset_data.asset_id=assets.asset_id where asset_data.added_on between ${gte} and ${lte} group by assets.asset_name,asset_data.asset_id,assets.asset_username,time_stamp ORDER BY time_stamp ASC`;
      // query = "select assets.asset_id, assets.asset_username, assets.asset_name,to_timestamp(cast(asset_data.added_on as bigint))::date time_stamp,COUNT(asset_data.added_on) hits  from assets left outer join asset_data on asset_data.asset_id=assets.asset_id group by assets.asset_username, assets.asset_name,assets.asset_id, time_stamp ORDER BY time_stamp ASC"
      console.log("[ASSET_HITS]", query);
      db.query(query)
      .then(function(result){
        if (process.env.NODE_ENV != 'production'){
          console.log("[GET_ASSET_HITS]",result.rows)
        }
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
  getOwnerDetails: function(req){
    return new Promise(function(resolve, reject){
      const owner_id =  req.params.owner_id;
      const query = `select owners.owner_name, owners.user_name,assets.asset_name, assets.asset_id, assets.asset_type, assets.added_on, asset_permission.added_on ordered_on ,assets.asset_username  from assets inner join asset_permission on assets.asset_id=asset_permission.asset_id inner join owners on owners.owner_id=asset_permission.owner_id  where asset_permission.owner_id='${owner_id}' `
      console.log("[GET OWNER DETAILS]",query);
      db.query(query)
      .then(function(result){
        if (process.env.NODE_ENV != 'production'){
          console.log("[GET_ASSET_HITS]",result.rows)
        }
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
  deleteAsset: function(req) {
    return new Promise(async function(resolve, reject){
      const asset_id =  req.query.asset_id ;
      const delete_asset_permission = `delete from asset_permission where asset_permission.asset_id='${asset_id}'`
      const delete_asset_data = `delete from asset_data where asset_data.asset_id='${asset_id}'`
      const delete_assets = `delete from assets where assets.asset_id='${asset_id}'` 

      try {
        let {rowCount} = await db.query(delete_asset_permission);
        // if(req.query.delete_data && rowCount > 0) {
        if(req.query.delete_data) {
          console.log("[DELETE_ADMIN_delete_asset_data]",delete_asset_data);
          let {rowCount} = await db.query(delete_asset_data);
        }
        if(req.query.delete_asset === 'true'){
          console.log("[DELETE_ADMIN_delete_assets]",delete_assets);
          let {rowCount} = await db.query(delete_assets);
        }
        resolve(`${asset_id} Deleted`);
      } catch(error) {
        if(process.env.NODE_ENV=='production'){
          error = "Not success"
        }
        else{
          console.error("DELETE_ADMIN_ASSET",error);
        }
        reject(error)
      }
    })
  },

    getallAssets(req) {
      return new Promise(async function(resolve, reject){
        const query = `select * from assets`;
        db.query(query)
            .then(function(result){
              if (process.env.NODE_ENV != 'production'){
                console.log("[GET_ALL_ASSETS]",result.rows)
              }
              resolve(
                  result.rows
              )
            }).catch(function(error){
          if (process.env.NODE_ENV != 'production'){
            console.error("[GET_ALL_ASSETS]",error)
          }
          else {
            error = "somthing went wrong";
          }
          reject(error);
        })
      });
    },
    sendEmail(req) {
        return new Promise( async function(resolve, reject) {
          if (!req.body.to || !req.body.subject || (!req.body.text && !req.body.html)) {
            console.log("Please provide every detail")
            reject("Please provide every detail")
          }
          else {
              // verifier.verify(req.body.to, async function (err, info) {
                try {
                  // if (err) {
                  //   console.error("error",err.message);
                  //   throw (err.message)
                  // } else if (!info.success) {
                  //   reject("Invalid email")
                  // } else {
                    let mailOptions = {
                      cc: Array.isArray(req.body.cc) === true ? req.body.cc : null,
                      from: transporterConfig.from, // sender address (who sends)
                      to: req.body.to, // list of receivers (who receives)
                      subject: req.body.subject, // Subject line
                      text: req.body.text, // plaintext body
                      html: req.body.html
                    };
                    const response = await transporter.sendMail(mailOptions)
                    resolve({
                      message:"email sent",
                      result:response
                    })
                  }
                // } 
                catch (e) {
                  console.error("EMAIL_ERROR",e);
                  reject({
                    "email": "NOT VERIFIED"
                  })
                }
              // });
          }
        });
    },
    deleteOwner: function(req) {
      return new Promise(async function(resolve, reject){
        const id =  req.query.owner_id ;

        const delete_asset_permission = `delete from asset_permission where asset_permission.owner_id='${id}'`
        const delete_owners = `delete from owners where owners.owner_id='${id}'`

        try {
          console.log("[DELETE_ADMIN_asset_permission]",delete_asset_permission);
          let {rowCount1} = await db.query(delete_asset_permission);

          console.log("[DELETE_ADMIN_delete_owner]",delete_owners);
          let {rowCount2} = await db.query(delete_owners);

          resolve(`Owner Deleted ${id}`);
        } catch(error) {
          if(process.env.NODE_ENV=='production'){
            error = ""
          }
          else{
            console.error("DELETE_ADMIN_ASSET",error);
          }
          reject(error)
        }
      })
    },

    getAdminList : function (){
      return new Promise(function(resolve, reject){
        var query = `select owner_id from owners where`
        adminRoles.forEach((admin,index) => {
          query+= ` level_permission='${admin}'`
          if((index+1) < adminRoles.length){
            query+= ` or`
          }
        })
        db.query(query).then(function (result) {
          // result.rows.map((data) => {
          //   delete data.password
          //   delete data.last_change
          //   delete data.level_permission
          //   delete data.type
          //   delete data.id,
          //   delete created_on
          // });
          resolve(result.rows);
        })
        .catch(function (error) {
          if(process.env.NODE_ENV == "production"){
            error = "Something went wrong"
          } else {
              console.log("[GET_ADMIN_LIST_ERROR]", error);
          }
          reject(error);
        });
      });
    }
}