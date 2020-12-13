var router = require('express').Router();

//login api without authentication routes
router.use("/v1", require('./apiv1/login.routes.js'));
router.use("/v1", require('./apiv1/assetsData.routes.js'));
router.use("/v1", require('./apiv1/register.routes.js'));
router.use("/v1",require('./apiv1/noauth.routes.js'));

/*** thirdparty dashboard ***/
// router.use("/v1/swagger",require("./apiv1/swagger/swagger.js"))
/***************************/


// v2
router.use("/v2", require('./apiv2/assetsData.routes.js'));

/****** Protected routes for user **********/
router.use(require('./apiv1/auth.routes.js'));
router.use(require('./apiv2/auth.routes.js'));
/****** Authentication route **********/

// API Error routes
router.use(function(req, res) {
  return res.status(404).json({
      message : process.env.NODE_ENV != 'production' ? "NOT FOUND" : "Page Not found"
    });
});

module.exports = router;