var fs = require('fs'),
var mongoConfig = (process.env.MONGODB_URL || JSON.parse(fs.readFileSync('mongodb.json', 'UTF-8')));
module.exports = {
    mongoURL: mongoConfig.url
}