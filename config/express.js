const express = require('express')
const db = require('../connection/mongo.js')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const bodyParser = require('body-parser')
var routes = require("./../routes/routes")


var initApp = function () {

    var app = express();
    app.use(bodyParser.json());
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));
    app.use(cookieParser());
    app.use(express.static('NuxtClient/nuxtBuild/'))
    if (process.env.NODE_ENV === "production") { //production then use cores for security
        console.log("Production version:", process.env.NODE_ENV);

        app.use(cors({
            credentials: true,
            origin: [
                "http://quadx-backend.eu-gb.mybluemix.net",
                "https://quadx-backend.eu-gb.mybluemix.net",
                "http://localhost:5000",
                "https://quadx-admin.web.app",
                "http://quadx-admin.web.app",
                "http://xoxodashboard.herokuapp.com"
            ]
        }))

        /* legacy way of setting cors */
        // app.use(function(req, res, next) {
        //     console.log("req.headers",req.header('origin'));
        //     res.header("Access-Control-Allow-Credentials",true);
        //     res.header("Access-Control-Allow-Origin", req.header('origin')|| "http://quadx-backend.eu-gb.mybluemix.net");
        //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
        //     if(req.method === 'OPTIONS') {
        //         console.log("req.method",req.method)
        //         res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        //         return res.status(200).json({});
        //     }
        //     next();
        //   });
        // app.use(subdomain('api', require('./routes/api.routes')));
    } else { // in development disable cors

        console.log("development version:", process.env.NODE_ENV);
        /* advance and easy way of setting cors */
        app.use(cors({
            credentials: true,
            origin: ["http://localhost:5000", "http://localhost:3001", "http://localhost:3002","http://localhost:8080", "http://localhost:4200"]
        }))


        /* legacy way of setting cors */
        // app.use(function(req, res, next) {
        //     res.header("Access-Control-Allow-Credentials",true);
        //     res.header("Access-Control-Allow-Origin", req.header('origin') || "http://localhost:5000" );
        //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
        //     if(req.method === 'OPTIONS') {
        //         console.log("req.method",req.method)
        //         console.log(res.getHeaders());
        //         res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        //         return res.status(200).json({});
        //     }
        //     next();
        //   });

    }

    routes(app);
    return app;
};
module.exports = initApp;