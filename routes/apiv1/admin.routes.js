var router = require('express').Router();
var adminController = require('../../controllers/admin.controller.js');
var usersController = require('../../controllers/users.controller.js');
var assetController = require('../../controllers/assets.controller.js');
var {authAdmin, authSuperAdmin} = require('../../controllers/role.controller.js');

//everyt asset route data, data modification, asset rename, asset add , asset delete
//asset rename, asset add , asset delete
// router.get('/',                 assetController.listAssets)

// *      parameters:
// *       - name: "userId"
// *         in: "path"
// *         required: true
// *         type: "string"
// *       - in: "body"
// *         name: "body"
// *         required: false

/**
 * @swagger 
 * /api/v1/admin/owner: 
 *  post: 
 *      tags:
 *       - "Admin"  
 *      description: Register new owner 
 *      produces:
 *       - application/json
 *      consumes:
 *       - application/json
 *      parameters:
 *       - in: body
 *         name: body
 *         required: false
 *         schema:
 *           type: "object"
 *           properties:
 *             email:
 *               required: true
 *               type: "string"
 *               format: email
 *             username:
 *               required: true
 *               type: "string"
 *             name:
 *               required: true
 *               type: "string"
 *             type:
 *               required: true
 *               type: "integer"
 *             role:
 *               required: true
 *               type: "string"
 *             address:
 *               required: true
 *               type: "object"
 *             owner_details:
 *               required: true
 *               type: "object"
 *               properties:
 *                org:
 *                 type: "object"
 *             password:
 *               required: true
 *               type: "string"
 *             confirmPassword:
 *               required: true
 *               type: "string"
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
router.post('/owner', authSuperAdmin, usersController.createUser);

/**
 * @swagger 
 * /api/v1/admin/owner: 
 *  get: 
 *      tags:
 *       - "Admin"  
 *      description: Get List of all owners
 *      produces:
 *       - application/json
 *      consumes:
 *       - application/json
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/data'
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: "Forbidden"
 *          404:
 *              description: "Not Found"
 *      security:
 *        - authorization: []
 */
router.get('/owner', authAdmin, adminController.getOwnerAssetCount)


/**
 * @swagger 
 * /api/v1/admin/owner/{owner_id}: 
 *  get: 
 *      tags:
 *       - "Admin"  
 *      description: Get List of assets of owner {owner_id}
 *      parameters:
 *      - in: path
 *        name: owner_id
 *        required: true
 *        type: string
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
router.get('/owner/:owner_id',authAdmin, adminController.getownerdetails)

/**
 * @swagger 
 * /api/v1/admin/asset: 
 *  post: 
 *      tags:
 *       - "Admin"  
 *      description: Register new Asset
 *      produces:
 *       - application/json
 *      consumes:
 *       - application/json
 *      parameters:
 *       - in: body
 *         name: body
 *         required: false
 *         schema:
 *           type: "object"
 *           properties:
 *             name:
 *               required: true
 *               type: "string"
 *             type:
 *               required: true
 *               type: "string"
 *             address:
 *               required: true
 *               type: "object"
 *             bookmark:
 *               required: true
 *               type: "object"
 *             email:
 *               required: true
 *               type: "string"
 *             id:
 *               required: true
 *               type: "string"
 *             password:
 *               required: true
 *               type: "string"
 *             confirmPassword:
 *               required: true
 *               type: "string"
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
router.post('/asset', authSuperAdmin , assetController.registernewAsset)

/**
 * @swagger 
 * /api/v1/admin/overview/count: 
 *  get: 
 *      tags:
 *       - "Admin"  
 *      description: Get total assets count and total users count
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

router.get('/overview/count', authAdmin, adminController.Overview);


/**
 * @swagger 
 * /api/v1/admin/overview: 
 *  get: 
 *      tags:
 *       - "Admin"  
 *      description: Overview of all assets data count for given lte and gte, if lte and gte is not provided then current month is selected
 *      parameters:
 *      - in: query
 *        name: lte
 *        type: integer
 *      - in: query
 *        name: gte
 *        type: integer
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
router.get('/overview',authAdmin, adminController.getHits);

/**
 * @swagger 
 * /api/v1/admin/asset: 
 *  delete: 
 *      tags:
 *       - "Admin"  
 *      description: Delete asset {asset_id}
 *      parameters:
 *      - in: query
 *        name: asset_id
 *        required: true
 *        type: string
 *      - in: query
 *        name: delete_data
 *        type: string
 *      - in: query
 *        name: delete_asset
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
router.delete('/asset',authAdmin,adminController.deleteAsset);
/**
 * @swagger
 * /api/v1/admin/owner:
 *  delete:
 *      tags:
 *       - "Admin"
 *      description: Delete Owner {owner_id}
 *      parameters:
 *      - in: query
 *        name: owner_id
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

router.delete('/owner',authAdmin,adminController.deleteOwner);

/**
 * @swagger
 * /api/v1/admin/all/assets:
 *  get:
 *      tags:
 *       - "Admin"
 *      description: get all assets
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

router.get('/all/assets',authAdmin,adminController.getallAssets)



/**
 * @swagger
 * /api/v1/admin/mail:
 *  post:
 *      tags:
 *       - "Admin"
 *      description: Send email to only one client
 *      produces:
 *       - application/json
 *      consumes:
 *       - application/json
 *      parameters:
 *       - in: body
 *         name: body
 *         required: false
 *         schema:
 *           type: "object"
 *           properties:
 *             to:
 *               required: true
 *               type: "string"
 *               format: email
 *             subject:
 *               required: true
 *               type: "string"
 *             text:
 *               required: true
 *               type: "string"
 *             cc:
 *               required: false
 *               type: "array"
 *               items:
 *                 type: "string"
 *                 format: "email"
 *             html:
 *               required: false
 *               type: "string"
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
router.post('/mail',authSuperAdmin,adminController.sendEmail)

/**
 * @swagger
 * /api/v1/admin/type/owner:
 *  get:
 *      tags:
 *       - "Admin"
 *      description: Get all types of owner
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
router.get('/type/owner', authAdmin, adminController.getOwnerType)


/**
 * @swagger
 * /api/v1/admin/project:
 *  post:
 *      tags:
 *       - "Admin"
 *      description: Create a project 
 *      produces:
 *       - application/json
 *      consumes:
 *       - application/json
 *      parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: "object"
 *           properties:
 *             avatar:
 *               required: true
 *               type: "string"
 *             project_name:
 *               required: true
 *               type: "string"
 *             project_title:
 *               required: true
 *               type: "string"
 *             project_description:
 *               required: true
 *               type: "string"
 *             project_message:
 *               required: true
 *               type: "string"
 *             project_url:
 *               required: false
 *               type: "array"
 *               items:
 *                 $ref: '#/definitions/project_url'
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
router.post('/project', authAdmin, adminController.createProject);



/**
 * @swagger
 * /api/v1/admin/project/{projectId}:
 *  patch:
 *      tags:
 *       - "Admin"
 *      description: Edit a project 
 *      produces:
 *       - application/json
 *      consumes:
 *       - application/json
 *      parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         type: string
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: "object"
 *           properties:
 *             avatar:
 *               required: true
 *               type: "string"
 *             name:
 *               required: true
 *               type: "string"
 *             title:
 *               required: true
 *               type: "string"
 *             description:
 *               required: true
 *               type: "string"
 *             message:
 *               required: true
 *               type: "string"
 *             url:
 *               required: false
 *               type: "array"
 *               items:
 *                 $ref: '#/definitions/project_url'
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
router.patch('/project/:projectId',authAdmin, adminController.UpdateProject);

/**
 * @swagger
 * /api/v1/admin/project/{projectId}:
 *  delete:
 *      tags:
 *       - "Admin"
 *      description: Delete a project 
 *      produces:
 *       - application/json
 *      parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         type: string
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
router.delete('/project/:projectId',authAdmin, adminController.DeleteProject);

/**
 * @swagger
 * /api/v1/admin/project:
 *  get:
 *      tags:
 *       - "Admin"
 *      description: Get projects List
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
router.get('/project',authAdmin, adminController.getProjects);
// router.post('/registerasset',  assetController.registernewAsset)
// router.get('/overview', assetController.getOverview)
// router.post('/add', assetController.addAsset);
module.exports = router;