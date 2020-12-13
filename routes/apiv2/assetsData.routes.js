var router = require('express').Router();
var assetController = require('../../controllers/assets.controller');



/**
 * @swagger 
 * /api/v2/asset/data/{assetId}: 
 *  post: 
 *      tags:
 *       - "Asset"  
 *      description: Post data of asset {assetId}
 *      produces:
 *       - application/json
 *      consumes:
 *       - application/json
 *      parameters:
 *       - in: path
 *         name: assetId
 *         required: true
 *         type: string
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: "object"
 *           properties:
 *             d:
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
 */
router.post('/asset/data/:assetId/', assetController.insertData);
module.exports = router;