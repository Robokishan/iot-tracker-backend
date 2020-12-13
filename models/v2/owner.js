var Promise = require('promise');
var db = require('../../connection/database');
var bcrypt = require('bcrypt');
var config = require('../../config/config');
const { sign } = require('jsonwebtoken');
var verifier = require('email-verify');
var emailVerification = verifier.infoCodes;
//change it in production
const saltRounds = config.SALT_ROUNDS;

module.exports = {
  
  findDeviceOverview: function(userId) {
    return new Promise(function (resolve, reject){
      if(userId){
      // const query = `SELECT assets.asset_username, tt.asset_id, tt.added_on, tt.payload, tt.payload_id, assets.asset_name, assets.asset_type
      //               FROM asset_data tt
      //               INNER JOIN
      //               (SELECT asset_id, MAX(payload_id) AS PAYID, MAX(added_on) AS MaxDateTime
      //               FROM asset_data 
      //               GROUP BY asset_id) groupedtt 
      //               ON tt.asset_id = groupedtt.asset_id 
      //               AND tt.added_on = groupedtt.MaxDateTime
      //               AND tt.payload_id=groupedtt.PAYID
      //               INNER JOIN assets ON tt.asset_id = assets.asset_id
      //               WHERE tt.asset_id IN (
      //               SELECT assets.asset_id FROM owners INNER JOIN asset_permission ON asset_permission.owner_id=owners.owner_id 
      //               INNER JOIN assets ON assets.asset_id=asset_permission.asset_id WHERE asset_permission.owner_id='${userId}')`
      const query =`select ass.asset_username, tt.asset_id, tt.added_on, tt.payload, tt.payload_id, ass.asset_name, ass.asset_type
      from 
      asset_permission ap
      left outer JOIN
      (SELECT asset_id, MAX(payload_id) AS PAYID, MAX(added_on) AS MaxDateTime
      FROM asset_data 
      GROUP BY asset_id) groupedtt 
      ON ap.asset_id = groupedtt.asset_id
      left outer join assets ass on  ap.asset_id=ass.asset_id
      left outer join asset_data tt
      ON tt.asset_id = groupedtt.asset_id 
      AND tt.added_on = groupedtt.MaxDateTime
      AND tt.payload_id=groupedtt.PAYID
      where ap.owner_id='${userId}'`
        db.query(query).then(result => {
          process.env.NODE_ENV == "production" ? null: console.log("[MODEL USER findDeviceOverview]",result.rows);
          result.rows.map((data) => {
            delete data.payload_id;
            data.payload = {
              d: data.payload
            }
          })
          resolve(
            result.rows
          )
        }).catch(err => {
          console.log("[API ASSET OVERVIEW ERRR]",err);
          reject(err)
        })
      }
      else{
        reject("No userId");
      }
    })
  }
}

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

findOneById = id => {
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
        console.log("bcrypt compare",err);
        reject(err);
      }
      else {
        if(process.env.NODE_ENV != "production")
        {
          console.log("[VERFY_PASSWORD]",user);
        }
        resolve({ isValid: result, owner_id:user.owner_id, id: user.id, email: user.email, role: user.level_permission });
      }
    });
  });
}

updateToken = (id, refreshToken, accessToken) => {
  return new Promise(function(resolve, reject){
    const rToken = refreshToken
    const aToken = accessToken
    db.query('UPDATE owners SET refresh_token = $1 WHERE email = $2',[refreshToken,id])
    .then(function(result){
      resolve({ user:id, referenceToken:rToken, accessToken:aToken})
    })
    .catch(function(err){
      reject({
        update : err
      })
    })
  })
}

ownerData = (data) => {
  return new Promise(function(resolve, reject) {
    const query = `select owner_id,user_name,email,created_on, address, owner_name, owner_details from owners where owner_id = '${data.owner_id}'`;
    db.query(query)
    .then(function(result){
      const name = result.rows[0].owner_name
      const userId = result.rows[0].owner_id
      const userName = result.rows[0].user_name
      const email = result.rows[0].email
      const createdOn = result.rows[0].created_on
      const address = result.rows[0].address
      const owner_details = result.rows[0].owner_details
      const refreshToken = data.referenceToken
      const accessToken = data.accessToken
      const isAuthorized = true;
      resolve({
        name,
        userId,
        userName,
        email,
        createdOn,
        refreshToken,
        accessToken,
        isAuthorized,
        address,
        owner_details
      })
    })
    .catch(function(err){
      console.log("owners data errors",err);
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