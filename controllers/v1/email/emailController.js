var verifier = require('email-verify');
var emailVerification = verifier.infoCodes;
var {transporter, transporterConfig} = require('../../../config/mail/sendemail.js')
module.exports = {

    //data.subject => topic of mail
     //data.to => email to
     //data.text => for sending raw text
     //data.html => for sending html page (optional)

     sendEmail(data){
       //  TODO:SELECT SUPER ADMIN AND SEND EMAIL
       return new Promise( function(resolve, reject) {
           data.cc = [process.env.EMAIL_CC]
           if (!data.to || !data.subject || (!data.text && !data.html)) {
               reject("Please provide every detail")
           } else {
               verifier.verify(data.to, async function (err, info) {
                   try {
                       if (err) {
                           reject("Something went wrong")
                       } else if (!info.success) {
                           reject("Invalid email")
                       } else {
                           let mailOptions = {
                               bcc:Array.isArray(data.bcc) === true ? data.cc : null,
                               cc: Array.isArray(data.cc) === true ? data.cc : null,
                               from: transporterConfig.from, // sender address (who sends)
                               to: data.to, // list of receivers (who receives)
                               subject: data.subject, // Subject line
                           };
                           if(data.text) mailOptions.text = data.text;
                           if(data.html ) mailOptions.html = data.html;
                           console.log("[mailOptions]",mailOptions);
                           const response = await transporter.sendMail(mailOptions)
                           resolve({
                               message: "email sent",
                               result: response
                           })
                       }
                   } catch (e) {
                       reject({
                           "email": "NOT VERIFIED"
                       })
                   }
               });
           }
       });
    },
    verifyEmail(email){
         return new Promise(function(resolve, reject){
             verifier.verify( email, function( error, info ) {
                 if (error) {
                     console.error("EMAIL_VERIFICATION_ERROR",error)
                     reject("Invalid email");
                 } else {
                     if (!info.success) throw ("Invalid email");
                     console.log("EMAIL_VERIFICATION_RESULT",info)
                     resolve(info)
                 }
             });
         });
    }
}