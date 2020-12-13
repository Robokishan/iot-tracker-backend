var router = require('express').Router();
const uuidv1 = require('uuid/v1');
var bcrypt = require('bcrypt');
var config = require('../../../config/config');
var {authSuperAdmin} = require('../../../controllers/role.controller.js')
const saltRounds = config.SALT_ROUNDS;

/**
 * @swagger
 * /api/v1/util/genuuid:
 *  get:
 *      tags:
 *       - "Admin"
 *      description: Generate uuid
 *      produces:
 *       - application/json
 *      consumes:
 *       - application/json
 *      responses:
 *          200:
 *              description: OK
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: "Forbidden"
 *          404:
 *              description: "Not Found"
 *      security:
 *        - authorization: []
 */
router.get('/genuuid', authSuperAdmin, function (req, res) {
    req.body.uuid = uuidv1();
    res.json({
        uuid: req.body.uuid
    })
});


/**
 * @swagger
 * /api/v1/util/genpass:
 *  post:
 *      tags:
 *       - "Admin"
 *      description: Generate new password and hash
 *      parameters:
 *      - in: body
 *        name: password
 *        description: The user to create.
 *        schema:
 *          type: object
 *          required:
 *            - password
 *          properties:
 *            password:
 *              type: string
 *      produces:
 *       - application/json
 *      consumes:
 *       - application/json
 *      responses:
 *          200:
 *              description: OK
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: "Forbidden"
 *          404:
 *              description: "Not Found"
 *      security:
 *        - authorization: []
 */
router.post('/genpass', authSuperAdmin, function (req, res) {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        if (!err) {
            res.json({
                "password": req.body.password,
                "hash": hash
            })
        } else {
            res.json({
                "error": err
            })
        }
    })
});

module.exports = router;