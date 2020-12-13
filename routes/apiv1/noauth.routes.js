var router = require('express').Router();

router.use("/public",require('./public.routes.js'))

module.exports = router;