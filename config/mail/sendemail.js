var nodemailer = require('nodemailer');
var config = require('./config')
// Create the transporter with the required configuration for Gmail
// change the user and pass !
var transporter = nodemailer.createTransport({
    host: config.smtp,
    port: config.port,// config.port,
    secure: true, // use SSL
    transportMethod: 'SMTP',
    // service: "Gmail",
    auth: {
        user: config.email,
        pass: config.pass
    }
});

var transporterConfig = {
    from : config.from
}

module.exports = {
    transporter,
    transporterConfig
};

// '<b>Hello world </b><br> This is the first email sent with Nodemailer in Node.js' // html body