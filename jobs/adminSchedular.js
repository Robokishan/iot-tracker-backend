const  adminController  = require("../controllers/admin.controller.js");
module.exports = function(agenda){
        agenda.define("schedule_developer",async job => {
            // make a que here
            // TODO:
            try {
                const admin = await adminController.getAdminList()
                admin.adminList.map( async(admin) => {
                    console.log("Creating job for ", admin.owner_id);
                    const job = await agenda.create('upsert_developers', {owner_id: admin.owner_id});
                    await job.save();
                } )    
            } catch (error) {
                console.error("SCHEDULAR_DEVELOPER",error);
            }
            
        })

        agenda.on('ready', function () {
            // here we can write the schedular when the agenda is launched
            if(process.env.NODE_ENV === "production" || process.env.QUEUE === "start") {
                console.log("Starting the schedular")
                var interval = "5 minute";
                if(process.env.NODE_ENV === "production" ) {
                    interval = "1 hour"
                }
                console.log("agenda interval", interval);
                agenda.every(interval,"schedule_developer")    
            }
        });
    }