var router = require('express').Router();
router.use("/agenda",require("../../../thirdparty/v1/agendadash/agendadash.js"))
module.exports = router;