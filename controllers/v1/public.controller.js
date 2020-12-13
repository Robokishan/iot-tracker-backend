var Public = require('../../models/v1/public.js');
module.exports = {
    getPortfolio: async function(req,res) {
        try {
            const portfolio = await Public.getAdminDetails();    
            return res.status(200).json(portfolio);
        } catch (err) {
            return res.status(400).json({
                message: "Something went wrong"
            })
        }
    }
}