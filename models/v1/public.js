const Promise = require('promise');
const Project = require('../mongo/Project.js')
const Admin = require('../mongo/Admin.js')
var firebaseConfig = require('../../config/firebase/config');
var Redis  = require('../../connection/redis.js');
const { promisify } = require("util");
const Cache = promisify(Redis.get).bind(Redis);

var hour = 3600;
var time = 2;

// const WriteCache = promisify(Redis.set).bind(Redis);
module.exports = {
    getAdminDetails: function (data) {
        return new Promise(async function (resolve, reject) {
            try {
                var Projects = await Project.find().exec()
                var Admins = await Admin.find().exec()
                try {
                    var cachedPortfolio = await Cache("main_dev")
                    var portfolio = JSON.parse(cachedPortfolio)
                    if( portfolio === null )
                     throw new Error("No cached portfolio")
                    resolve(portfolio);
                } catch (error) {
                    console.error("Error cachedPortoflio",error)
                    //TODO: BAD PRACTISE MAKE SOMETHING DIFFERENT FROM HERE
                    Admins.forEach(admin => {
                        admin.avatar = (admin.avatar != null ? `${firebaseConfig.URL_PREFIX}${firebaseConfig.PROJECT_ID}.appspot.com/${admin.avatar}`: data.avatar)
                    })
                    var portfolio = {
                            "main_developers":Admins,
                            "projects":Projects
                        }
                    resolve(portfolio);
                    Redis.setex("main_dev", (hour*time) ,JSON.stringify(portfolio))
                }
            } catch (error) {   
                console.error("PROJECT_ERROR",error)
                reject("Something went wrong");
            }
            
        });
    },

}