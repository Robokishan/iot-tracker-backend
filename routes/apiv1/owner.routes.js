var router = require('express').Router();
var ownerController = require('./../../controllers/users.controller');
var { ImageUploader } = require('../../controllers/v1/image/imageController.js')

/**
 * @swagger
 * /api/v1/owner/picture:
 *  put:
 *      tags:
 *       - "Owner"
 *      description: Update owner profile picture
 *      summary: update profile picture of the logged in owner
 *      produces:
 *       - application/json
 *      consumes:
 *       - multipart/form-data
 *      parameters:
 *       - in: formData
 *         name: profile
 *         required: true
 *         type: "file"
 *         description: Profile picture to upload
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
router.put('/picture', ImageUploader , ownerController.updatePicture)

/**
 * @swagger
 * /api/v1/owner/picture:
 *  delete:
 *      tags:
 *       - "Owner"
 *      description: Update owner profile picture
 *      summary: update profile picture of the logged in owner
 *      produces:
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
router.delete('/picture', ownerController.removePicture);
/**
 * @swagger
 * /api/v1/owner/detail:
 *  get:
 *      tags:
 *       - "Owner"
 *      description: Get Owner Details
 *      summary: Get Owner details regarding Owner organization name profile and all other things which he has mentioned
 *      produces:
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
router.get('/detail', ownerController.getOwner)

/**
 * @swagger
 * /api/v1/owner/password:
 *  put:
 *      tags:
 *       - "Owner"
 *      description: Update password of owner
 *      summary: Update Password of owner
 *      produces:
 *       - application/json
 *      consumes:
 *       - application/json
 *      parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         type: "object"
 *         properties:
 *              currentPassword:
 *               required: true
 *               type: "string"
 *              newPassword:
 *               required: true
 *               type: "string"
 *              confirmPassword:
 *               required: true
 *               type: "string"
 *         description: Profile picture to upload
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
router.put('/password', ownerController.updatePassword);
/**
 * @swagger
 * /api/v1/owner/detail:
 *  put:
 *      tags:
 *       - "Owner"
 *      description: Update owner details
 *      summary: update details of owner
 *      produces:
 *       - application/json
 *      parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: "object"
 *           properties:
 *             owner_name:
 *               required: true
 *               type: "string"
 *             owner_details:
 *               required: true
 *               type: "object"
 *               properties:
 *                org:
 *                 required: true
 *                 type: "object"
 *             address:
 *               required: true
 *               type: "object"
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

router.put('/detail',ownerController.updateDetail);


/**
 * @swagger 
 * /api/v1/owner/asset: 
 *  delete: 
 *      tags:
 *       - "Owner"  
 *      description: Delete asset {asset_id}
 *      parameters:
 *      - in: query
 *        name: asset_id
 *        required: true
 *        type: string
 *      produces:
 *       - application/json
 *      consumes:
 *       - application/json
 *      responses:
 *          200:
 *              description: OK
 *          400:
 *              description: Bad request
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: "Forbidden"
 *          404:
 *              description: "Not Found"
 *      security:
 *        - authorization: []
 */
router.delete('/asset',ownerController.deleteAsset);
//rename everything --name --email --password --username
module.exports = router;