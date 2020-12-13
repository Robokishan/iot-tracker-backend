var User = require('../models/v1/owner.js');
const ownerController = require("../controllers/users.controller.js")
const Admin = require("../models/mongo/Admin.js")
module.exports = function (agenda) {
        agenda.define('upsert_developers',{priority: 'high', concurrency: 1}, async job => {
            if (job.attrs.data.owner_id) {
                const owner_id = job.attrs.data.owner_id;
                console.log("STARTING_UPSERT_JOB",owner_id)
                var req = {
                    owner: {
                        userId: owner_id
                    }
                }
                
                try {
                    var owner = await User.getowner(req);
                    delete owner.created_on;
                    console.log("OWNER",owner)
                    var currentAdmin = await Admin.findOne({ owner_id: owner_id }).exec()
                    owner.modified_on = Math.round((new Date).getTime() / 1000);
                    if (currentAdmin === null) {
                        owner.created_on = owner.modified_on;
                    }
                    const newAdmin = await Admin.update({ owner_id: owner.owner_id }, owner, { upsert: true, new: true })
                    console.log("NEW_ADMIN", newAdmin)
                } catch (error) {
                    console.error("AGENDA_UPSERT_ERROR", error)
                }
            }
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
    }
