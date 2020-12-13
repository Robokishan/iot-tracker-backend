'use strict';
const mongoose = require('mongoose');
var fs = require('fs'),
var mongoConfig = process.env.MONGODB_URL || JSON.parse(fs.readFileSync('mongodb.json', 'UTF-8'));
const dbURL = mongoConfig.url

async function connectToDB() {
    try {
        await mongoose.connect(dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        
        console.log('Succefully Connected To MongoDB');
    } catch (error) {
        console.error('Database Connection Failed');
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