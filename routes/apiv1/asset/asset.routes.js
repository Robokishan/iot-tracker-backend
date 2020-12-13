var {ImageUploader}  = require ("../../../controllers/v1/image/imageController");

var router = require('express').Router();
var assetController = require('../../../controllers/assets.controller')

/**
 * @swagger
 * /api/v1/asset/p/password:
 *  put:
 *      tags:
 *       - "Asset"
 *      description: Update password of asset
 *      summary: Update Password of asset
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
router.put('/password', assetController.updatePassword);

/**
 * @swagger
 * /api/v1/asset/p/picture:
 *  put:
 *      tags:
 *       - "Asset"
 *      description: Update asset profile picture by itself
 *      summary: update profile picture of the logged in asset
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
router.put('/picture', ImageUploader , assetController.updatePicture)

/**
 * @swagger
 * /api/v1/asset/p/picture:
 *  delete:
 *      tags:
 *       - "Asset"
 *      description: Delete asset profile picture
 *      summary: delete picture of the logged in asset
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
router.delete('/picture', assetController.removePicture);


module.exports = router;