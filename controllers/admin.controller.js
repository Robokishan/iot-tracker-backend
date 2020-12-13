var Admin = require('../models/v1/admin.js');
var jwt = require('jsonwebtoken');
var config = require('./../config/config');
const uuidv1 = require('uuid/v1');
var {adminRoles} = require('../config/rules.js')
var Project= require("../models/mongo/Project.js")
module.exports = {
    getOwnerAssetCount: function (req, res) {
        try {
            if(adminRoles.includes(req.owner.role))
            {
                try {
                    const userId = req.owner.userId;
                    if (userId !== null) {
                      
                        Admin.OwnerAssetCount()
                        .then(function (result) {
                            return res.status(200).json(result);
                        })
                        .catch(function (err) {
                            return res.status(400).json({
                            message: err
                            })
                        })
                    }
                } catch (err) {
                    res.send({
                        error: `${err.message}`,
                    })
                }
            }
            else{
                throw ("you are not admin");
            }   
        } catch (error) {
            if(process.env.NODE_ENV == "production")
            {
                error = "Unauthorized"
            } else {
                console.log("ADMIN_CONTROLLER_OWNER_ASSET", error);
            }
            res.status(401).json({
                "error":error
            });
        }
    },
    Overview: function(req,res){
        try{
            const userId = req.owner.userId;
            if (userId !== null) 
            {
                Admin.Overview()
                        .then(function (result) {
                            return res.status(200).json(result);
                        })
                        .catch(function (err) {
                            return res.status(400).json({
                            message: err
                            })
                        })
            }
            else {
                throw "something not found";
            }
        }
        catch(err)
        {
            process.env.NODE_ENV != "production" ? console.log("ADMIN_CONTROLLER_OVERVIEW_ERROR", err) : null;
            res.status(401).json({
                error:"something went wrong"
            })
        }
    },
    getHits: function(req, res){
      Admin.getAssethits(req).then(function(result){
          return res.status(200).json({
            data: {
                payload:result
            }
        })
      }).catch(function(err){
        res.status(400).send("Something went wrong: " + err)
      })
    },
    getownerdetails: function(req, res){
        Admin.getOwnerDetails(req).then(function(result){
            return res.status(200).json({
              data: {
                  payload:result
              }
          })
        }).catch(function(err){
          res.status(400).send("Something went wrong: " + err)
        })
      },

    deleteAsset: function(req, res) {
        if(Object.keys(req.query).length === 0){
            return res.status(400).send("Something went wrong");
        }
        if(!req.query.asset_id){
            return res.status(400).send("Something went wrong")
        }
        else{
            if(!req.query.delete_data){
                req.query.delete_data = false
            }
            console.log("req.query.asset_id",req.query.asset_id);
            console.log("req.query.delete_data",req.query.delete_data);
            Admin.deleteAsset(req).then(function(result){
                return res.status(200).json({
                    data:result
                })
            }).catch(function(err){
                res.status(400).send("Something went wrong: "+err)
            })
        }
    },
    deleteOwner: function(req, res) {
        if(Object.keys(req.query).length === 0){
            return res.status(400).send("Something went wrong");
        }
        if(!req.query.owner_id){
            return res.status(400).send("Something went wrong")
        }
        else{
            console.log("req.query.owner_id",req.query.owner_id);
            console.log("req.query.delete_data",req.query.delete_data);
            Admin.deleteOwner(req).then(function(result){
                return res.status(200).json({
                    data:result
                })
            }).catch(function(err){
                res.status(400).send("Something went wrong: "+err)
            })
        }
    },
    getallAssets: function(req, res) {
        Admin.getallAssets(req).then(function(result){
            return res.status(200).json({
                data:result
            })
        }).catch(function(err){
            res.status(400).send("Something went wrong: "+err)
        })
    },
    sendEmail(req, res) {
        // send mail with defined transport object
        Admin.sendEmail(req).then(result => {
            return res.json({
                "success": result
            })
        }).catch(error => {
            console.log("error => ",error)
            return res.status(400).json({
                "error":error
            })
        })
    },
    getOwnerType(req, res) {
        return res.json({
            "type":[
                "client",
                "employee",
                "admin"
            ]
        })
    },
    FindAll(req,res) {
        Admin.getAdminList().then(result => {
            return res.json({
                "message": result
            })
        }).catch(error => {
            console.error("Findall_admin",error)
            res.status(403).json({
                "error":"Something went wrong"
            })
        }) 
    },
    async getAdminList(){
        try {
            const adminList = await Admin.getAdminList()
            return {
                adminList: adminList
            };
        } catch (error) {
            if(process.env.NODE_ENV !== "production") {
                console.error("GET_ADMIN_LIST", error);
            }
            return {
                adminList:[]
            }
        }
    },
    async createProject(req, res) {
        try {
            const project_message = req.body.project_message;
            const projectName = req.body.project_name;
            const projectTitle = (req.body.project_title ? req.body.project_title: req.body.project_name)
            const projectDescription = req.body.project_description;
            const url = req.body.project_url;
            const created_on = Math.round( (new Date).getTime() / 1000 );
            const modified_on = Math.round( (new Date).getTime() / 1000 );
            const project = new Project({
                avatar: req.body.avatar,
                name: projectName,
                message:project_message,
                title:projectTitle,
                description: projectDescription,
                url:url,
                created_on: created_on,
                modified_on:modified_on,
            })
            const savedProject = await project.save()
            res.json(savedProject)
        }
        catch(error) {
            console.error("CREATE_PROJECT", error)
            res.status(403).json({
                "message":"Something went wrong"
            })
        }
    },
    async UpdateProject(req,res) {
        try {
            Project.findById(req.params.projectId, (err, project) => {
                if(req.body._id){
                    delete req.body._id
                }
                for (let b in req.body){
                    project[b] = req.body[b];
                }
                const savedProject = project.save()
                return res.json(savedProject)
            })
        }
        catch(error) {
            console.error("UPDATE_PROJECT", error)
            return res.status(403).json({
                "message":"Something went wrong"
            })
        }
    },
    async getProjects(req, res) {
        try {
            var projects = await Project.find().exec();
            var response = {
                "projects":projects
            }
            return res.json(response);
        } catch (error) {
            console.error("get Projects", error)
            return res.status(403).json({
                "message":"Something went wrong"
            })
        }
    },
    async DeleteProject(req, res) {
        try {
            var projects = await Project.remove({_id: req.params.projectId});
            var response = {
                "projects":projects
            }
            return res.json(response);
        } catch (error) {
            
        }
    }
}