process.env.NODE_ENV = process.env.NODE_ENV || 'development';

require('dotenv/config')
var config = require('./config/config');
var express = require('./config/express');
var colors = require('colors');
var Table = require('cli-table3');

console.log('\nAPI for ' + "quadx");
console.log('********************************************');
const listEndpoints = require('express-list-endpoints')
// Create server
var app = express();

/**
 * @swagger
 *  definitions:
 *  data:
 *    type: "object"
 *    properties:
 *      payload:
 *       type: "object"
 *       properties:
 *        d:
 *         description: "data available here"
 *         type: "object"
 * 
 *  definitions:
 *  project_url:
 *     type: "object"
 *     properties:
 *       url:
 *         type: "string"
 *       type:
 *         type: "string"             
 *              
 * securityDefinitions:
 *  authorization:
 *    description: >-
 *      Authorize using **Bearer [access_token]**. The access token can be
 *      obtained by authenticating with the ** /users/login** endpoint.
 *    type: apiKey
 *    name: authorization
 *    in: header
 */

// Start listening
app.listen(config.PORT, function() {
    if(process.env.NODE_ENV != "proudction") {
        var table = new Table({ head: [ "", "APi", "Method", "Admin", "dOne"] });
        var doneapis = [
            "/api/v1/owner/login",
            "/api/v1/asset/login",
            "/api/v1/owner/register",
            "/api/v1/util/getuuid",
            "/api/v1/assetdata/:assetId/",
            "/api/v1/asset/registerasset",
            "/api/v1/asset",
            "/api/v1/asset/data/:assetId",
            "/api/v1/asset/overview",
            "/api/v1/asset/add",
            "/api/v1/util/genpass"
        ]

        var webAdmin = [
            "/api/v1/util/getuuid",
            "/api/v1/util/genpass",
            "/api/v1/owner/register",
            "/api/v1/owner/owners",
            "/api/v1/asset/registerasset",
            "/api/v1/admin/hits",
            "/api/v1/admin/overview",
            "/api/v1/admin/getallowners"
        ]
        var routeList = listEndpoints(app);
        routeList.forEach((link,index) => {
            let done = doneapis.includes(link.path) ? "✅ ": "📌";
            let webAdminCheck = webAdmin.includes(link.path) ? "🔐" : " ";
            table.push([index,link.path, colors.red(link.methods[0]),webAdminCheck, done]);
        })
        console.log(table.toString());
        console.log('********************************************\n');
    }
    console.log(colors.green('Listening with ' + process.env.NODE_ENV + ' config on port ' + config.PORT));
});