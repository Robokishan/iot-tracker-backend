var router = require('express').Router();
var assetController = require('../../controllers/v2/assets.controller');
var {authSuperAdmin} = require('../../controllers/role.controller.js')
//everyt asset route data, data modification, asset rename, asset add , asset delete
//asset rename, asset add , asset delete

router.get('/overview', assetController.getOverview)

module.exports = router;