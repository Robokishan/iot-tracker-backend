'use strict';
const mongoose = require('mongoose');
var mongoConfig = process.env.MONGODB_URL;
const dbURL = mongoConfig

async function connectToDB() {
    try {
        await mongoose.connect(dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        
        console.log('Succefully Connected To MongoDB');
    } catch (error) {
        console.error('Database Connection Failed',error);
        // process.exit(1);
    }

}

connectToDB();



const db = mongoose.connection;
// db.on('error', console.error('connection error while connecting to DB'));
// db.once('open', function() {
// 	console.log('Succefully Connected To DB');
// });


module.exports = db;