//without auth middleware 

var router = require('express').Router();
var usersController = require('../../controllers/users.controller');
var assetController = require('../../controllers/assets.controller');


/**
 * @swagger 
 * definitions:
 *  request:
 *    type: "object"
 *    properties:
 *      email:
 *        type: "string"
 *        format: email
 *      password:
 *        type: "string"
 *  password:
 *    type: "object"
 *    properties:
 *      email:
 *        type: "string"
 *        format: email
 *      password:
 *        type: "string"
 *      newpassword:
 *        type: "string"
 *      confirmpassword:
 *        type: "string"   
 * 
 * /api/v1/owner/login: 
 *  post: 
 *      tags:
 *       - "Owner"  
 *      description: Owner Login
 *      produces:
 *       - application/json
 *      consumes:
 *       - application/json
 *      parameters:
 *       - in: body
 *         name: body
 *         required: false
 *         schema:
 *           $ref: '#/definitions/request'
 *      responses:
 *          200:
 *              description: OK
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: "Forbidden"
 *          404:
 *              description: "Not Found"
 */
router.post('/owner/login', usersController.validateUser);

/**
 * @swagger
 * /api/v1/asset/login:
 *  post:
 *      tags:
 *       - "Asset"
 *      description: Asset Login
 *      produces:
 *       - application/json
 *      consumes:
 *       - application/json
 *      parameters:
 *       - in: body
 *         name: body
 *         required: false
 *         schema:
 *          type: "object"
 *          properties:
 *           username:
 *            type: "string"
 *           password:
 *            type: "string"
 *      responses:
 *          200:
 *              description: OK
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: "Forbidden"
 *          404:
 *              description: "Not Found"
 */

router.post('/asset/login',assetController.validateAsset);
// Registration of new users via API

module.exports = router;