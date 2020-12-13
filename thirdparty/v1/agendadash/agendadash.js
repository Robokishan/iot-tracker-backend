var router = require('express').Router();
var agenda = require('../../../lib/agenda.js')
var Agendash = require('agendash');
router.use('/', Agendash(agenda))
module.exports = router;

