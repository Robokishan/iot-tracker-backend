var router = require('express').Router();

// Any route past this point requires a valid auth token
router.use('/v2/asset',require('./auth.function.js'),require('./assets.routes'));

// // API v1
// router.use('/v1/owner', require('./owner.routes')); //users api lists
// router.use('/v1/asset', require('./assets.routes')); //assets api lists

module.exports = router;