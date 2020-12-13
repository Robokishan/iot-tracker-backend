const {sendEmail} = require("../controllers/v1/email/emailController.js");

module.exports = function(agenda) {
  agenda.define('registration email', async job => {
    var data = {};
    console.log("Sending agenda email",job.attrs.data.userId);
    // console.log("agenda job",job);
    data.html = "<p><strong>Email from agenda schedular</strong></p>\n" +
                `<p> job_id => ${job} </p>`+
                `<sending data to> job.attrs.data.userId => ${job.attrs.data.userId} </p>`
          data.to = process.env.ALERT_EMAIL
          data.subject = "Agenda check"
    console.log("email option",data)
    await sendEmail(data);
    try {
      // await job.remove();
      console.log('Successfully removed job from collection');
    } catch (e) {
      console.error('Error removing job from collection');
    }
    var to = job.attrs.data.userId;
    
  });

  agenda.on('ready', function () {
    // here we can write the schedular when the agenda is launched
    // agenda.every(90000, 'print to console');
  });


  // removed this is just for fun
  // agenda.every('3 minutes', 'registration email', {userId: `robokishan.blogspot@gmail.com`});

  agenda.define('reset password', async job => {
    // Etc
  });

  // More email related jobs
};