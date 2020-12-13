module.exports = {
	MERCHANT_ID: process.env.PAYTM_MERCHANT_ID,
    MERCHANT_KEY: process.env.PAYTM_MERCHANT_KEY,
    TRANSACTION_URL:"https://securegw-stage.paytm.in/order/process",
    TRANSACTION_STATUS :"https://securegw-stage.paytm.in/order/status",
    WEBSITE:"WEBSTAGING",
    CHANNEL_ID:"WEB",
    INDUSTRY_TYPE:"Retail",
    WEBSITE_URL:"http://localhost:5000",
    CALLBACK_URL:"http://localhost:5000/api/v1/public/callback"
};