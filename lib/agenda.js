const Agenda = require('agenda');
const mongoURL = require('../connection/mongodb.js')
const connectionOpts = {db: {address: mongoURL.mongoURL,options: {useUnifiedTopology: true}, collection: 'agendaJobs'}};
const agenda = new Agenda(connectionOpts);
const jobTypes = process.env.JOB_TYPES ? process.env.JOB_TYPES.split(',') : [];
// require('../jobs/email.js')(agenda)
require('../jobs/admin.js')(agenda)
require('../jobs/adminSchedular.js')(agenda)
// jobTypes.forEach(type => {
//   require('../jobs/' + type)(agenda);
//   console.log('../jobs',type)
// });

// if (jobTypes.length) {
  agenda.start().then(() => {
    console.log("Agenda started successfully")
  }).catch(error => {
    console.log("Failed", error)
  }); // Returns a promise, which should be handled appropriately
// }

module.exports = agenda;