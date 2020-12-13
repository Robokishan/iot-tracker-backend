var router = require('express').Router();
var usersController = require('../../controllers/users.controller');
var {authSuperAdmin} = require('../../controllers/role.controller.js');
//register api for owner





// router.post('/owner/register', authSuperAdmin, usersController.createUser);
module.exports = router;