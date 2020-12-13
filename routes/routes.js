var subdomain = require('express-subdomain');

module.exports = function(app) {
    // app.use(subdomain('api', require('./api.routes')));
    app.use('/api', require('./api.routes'));
};
