var router = require('express').Router();

// Any route past this point requires a valid auth token
router.use("/v1/asset/p",require('./asset.auth.function.js'), require('../apiv1/asset/asset.routes.js'))
router.use("/v1/util",require('./owner.auth.function.js'), require('../apiv1/utils/utils.js'));
router.use('/v1/owner',require('./owner.auth.function.js'),require('./owner.routes'));
router.use('/v1/asset',require('./owner.auth.function.js'),require('./assets.routes'));
router.use('/v1/admin',require('./owner.auth.function.js'),require('./admin.routes'));
router.use("/v1/dashboard",require('./owner.auth.function.js'),require("../apiv1/thirdparty/dashboard.js"))
router.use("/v1/swagger", process.env.NODE_ENV === "production" ? require('./owner.auth.function.js') : (req, res, next) => {next()},require("../apiv1/swagger/swagger.js"))
// // API v1
// router.use('/v1/owner', require('./owner.routes')); //users api lists
// router.use('/v1/asset', require('./assets.routes')); //assets api lists

module.exports = router;