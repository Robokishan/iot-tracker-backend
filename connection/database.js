var Promise = require('promise');
var pg = require('pg');
const pool = require('./pool.js');
const {sendEmail} = require("../controllers/v1/email/emailController");


module.exports = {
  query: function(text, values) {
    return new Promise(function(resolve, reject) {
      pool.connect(function (err, client, done) {
        if(err) {
          var data = {}
          console.log("[DATABASE_ERROR]",err)
          data.html = "<p><strong>Database Crash</strong></p>\n" +
              "<p>Error logs:</p>\n" +
              "<p>&nbsp;</p>" +
              `<p> ${err} <p>`
          data.to = process.env.ALERT_EMAIL
          data.subject = "DATABASE_ERROR"
          sendEmail(data);
          reject("Database Full")
        } else {
          client.query(text, values, function (err, result) {
            done();
            if (err) {
              handleErrorMessages(err)
                  .then(function (message) {
                    reject(message);
                  })
                  .catch(function () {
                    reject();
                  });
            } else {
              resolve(result);
            }
          })
        }
      });
    });
  }
};


// module.exports = {
//   query: function(text, values) {
//     return new Promise(function(resolve, reject) {
//       pg.connect(connectionString, function(err, client, done) {
//         client.query(text, values, function(err, result) {
//           done();
//           if (err) {
//             handleErrorMessages(err)
//               .then(function(message) {
//                 reject(message);
//               })
//               .catch(function() {
//                 reject();
//               });
//           }
//           else {
//             resolve(result);
//           }
//         });
//       });
//     });
//   }
// };

function handleErrorMessages(err) {
  return new Promise(function(resolve, reject) {
    if (err && process.env.NODE_ENV === "production") {
      err = 'something went wrong'
    }
    resolve(err);
  });
}