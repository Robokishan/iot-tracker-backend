/* asset Controllers */

var User = require('../../models/v2/owner');

module.exports = {

    getOverview: function (req, res) {
        const userId = req.userId;
        User.findDeviceOverview(userId).then(function(result){
            return res.status(200).json(result)
        }).catch(function (err){
            return res.status(400).json({
                message: process.env.NODE_ENV == "production" ? "NOT AVAILABLE" : err
            })
        })
    }
}