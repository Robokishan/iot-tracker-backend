var router = require('express').Router();
var publicController = require('../../controllers/v1/public.controller');
var {authSuperAdmin} = require('../../controllers/role.controller.js');
var adminController = require('../../controllers/admin.controller.js');
const Paytm = require("paytm-pg-node-sdk");
const paytmconfig = require("../../config/paytm.js");
const checksum_lib = require('../../lib/paytm/checksum.js');
const PaytmChecksum = require('../../lib/paytm/PaytmChecksum.js');
const https = require('https');
const paytm = require('../../config/paytm.js');
const { response } = require('express');
const { type } = require('../../connection/redis');
//register api for owner


/**
 * @swagger
 * /api/v1/public/portfolio/main:
 *  get:
 *      tags:
 *       - "Public"
 *      description: Get Developer Details
 *      summary: Get Developer details regarding organization name profile and all other things which he has mentioned
 *      produces:
 *       - application/json
 *      responses:
 *          200:
 *              description: OK
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: "Forbidden"
 *          404:
 *              description: "Not Found"
 */
router.get("/portfolio/main",publicController.getPortfolio)



/**
 * @swagger
 * /api/v1/public/mail:
 *  post:
 *      tags:
 *       - "Public"
 *      description: Send email to only one client
 *      produces:
 *       - application/json
 *      consumes:
 *       - application/json
 *      parameters:
 *       - in: body
 *         name: body
 *         required: false
 *         schema:
 *           type: "object"
 *           properties:
 *             to:
 *               required: true
 *               type: "string"
 *               format: email
 *             subject:
 *               required: true
 *               type: "string"
 *             text:
 *               required: true
 *               type: "string"
 *             cc:
 *               required: false
 *               type: "array"
 *               items:
 *                 type: "string"
 *                 format: "email"
 *             html:
 *               required: false
 *               type: "string"
 *      responses:
 *          200:
 *              description: OK
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: "Forbidden"
 *          404:
 *              description: "Not Found"
 */
router.post("/mail",adminController.sendEmail);
getUserInfo = () => {
    var userInfo = new Paytm.UserInfo("cid");
    userInfo.setAddress("ADDRESS");
    userInfo.setEmail("ABCD@GMAIL.COM");
    userInfo.setFirstName("FIRST_NAME");
    userInfo.setLastName("LAST_NAME");
    userInfo.setMobile("+919898989898");
    userInfo.setPincode("123456");
    return userInfo;
}

setInitialParameters = () => {
    try {
        var env = Paytm.LibraryConstants.STAGING_ENVIRONMENT;
        // Following mid and key is for create txn API
        var mid = paytmconfig.MERCHANT_ID;
        var key = paytmconfig.MERCHANT_KEY;
        var website = paytmconfig.WEBSITE_URL;

        /** Initialize mandatory Parameters */
        Paytm.MerchantProperties.initialize(env, mid, key, website);
        /** Setting timeout for connection i.e. Connection Timeout */
        Paytm.MerchantProperties.setConnectionTimeout(5000);
    }
    catch (e) {
        console.log("Exception caught: ", e);
        Paytm.LoggingUtil.addLog(Paytm.LoggingUtil.LogLevel.INFO, "DemoApp", "Exception caught: ", e);
    }
}

payToPaytm = async() => {
    setInitialParameters();
    
    const orderId = "ORD001";
    const txnAmount = Paytm.Money.constructWithCurrencyAndValue(Paytm.EnumCurrency.INR, "1.00");

    var paymentDetailBuilder = new Paytm.PaymentDetailBuilder(paytmconfig.CHANNEL_ID, orderId, txnAmount, getUserInfo());
    var paymentDetail = paymentDetailBuilder.build();
    const response = await Paytm.Payment.createTxnToken(paymentDetail);
    if (response instanceof Paytm.SDKResponse) {
        console.log("\nRaw Response:\n", response.getJsonResponse());
    }
    // DEBUGGING INFO
    console.log("\nRESPONSE RECEIVED IN DEMOAPP: ", JSON.stringify(response.getResponseObject()));


    /** ..... Merchants code here .... */
            /** 5. Merchants who want to get TransactionStatus */
            /** Unique order for each order request */
            // orderId = "ORD001";
            var readTimeout = 80000;
            /**
             * Paytm\merchant\models\PaymentStatusDetail object will have all the information required to make
             * getPaymentStatus call
             */
            var paymentStatusDetailBuilder = new Paytm.PaymentStatusDetailBuilder(orderId);
            var paymentStatusDetail = paymentStatusDetailBuilder.
                setReadTimeout(readTimeout)
                .build();
            /**
             * Making call to SDK method which will return a
             * NativeMerchantStatusResponseBody object that will contain the Transaction
             * Status Paytm\pg\response\interfaces\Response regarding the Order Id
             */
            const statusResponse =  await Paytm.Payment.getPaymentStatus(paymentStatusDetail).then(function (response) {
                if (response instanceof Paytm.SDKResponse) {
                    console.log("\nRaw Response:\n", response.getJsonResponse());
                }
                // DEBUGGING INFO
                console.log("\nRESPONSE RECEIVED IN DEMOAPP: ", response.getResponseObject());
                // DEBUGGING INFO ENDS
            });
            console.log(statusResponse);
}


router.get("/payment", (req,res) => {
    
    var paytmParams = {
            "MID" : paytmconfig.MERCHANT_ID,
            "WEBSITE" : paytmconfig.WEBSITE,
            "INDUSTRY_TYPE_ID" : paytmconfig.INDUSTRY_TYPE,
            "CHANNEL_ID" : paytmconfig.CHANNEL_ID,
            "ORDER_ID" : req.query.orderId,
            "CUST_ID" : "CS011P002",
            "MOBILE_NO" : req.query.phone_number,
            "EMAIL" : req.query.email,
            "TXN_AMOUNT" : req.query.amount,
            "CALLBACK_URL" : paytmconfig.CALLBACK_URL,
    };
    
    checksum_lib.genchecksum(paytmParams, paytmconfig.MERCHANT_KEY, function(err, checksum){

        console.log("checksum", checksum);
        var params = {
            ...paytmParams,
            CHECKSUMHASH: checksum
        }
        console.log(paytmParams);
        res.json(params)

    });
})

router.post("/callback", (req,res)=>{
    
    var paytmChecksum = "";
    var received_data = req.body;
    
    var paytmParams = {};
    for(var key in received_data){
        if(key == "CHECKSUMHASH") {
            paytmChecksum = received_data[key];
        } else {
            paytmParams[key] = received_data[key];
        }
    }

    var isValidChecksum = checksum_lib.verifychecksum(paytmParams, paytmconfig.MERCHANT_KEY, paytmChecksum);
    //MITM ATTACK HAS BEEN DONE OR NOT
    if(isValidChecksum) {
        console.log("Checksum Matched");
        /*
        * import checksum generation utility
        * You can get this utility from https://developer.paytm.com/docs/checksum/
        */

        var paytmParams = {};
        paytmParams["MID"]     = received_data['MID'];
        paytmParams["ORDERID"] = received_data['ORDERID'];

        /*
        * Generate checksum by parameters we have
        * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
        */
        PaytmChecksum.generateSignature(paytmParams,paytmconfig.MERCHANT_KEY).then(function(checksum){

            paytmParams["CHECKSUMHASH"] = checksum;

            var post_data = JSON.stringify(paytmParams);

            var options = {

                /* for Staging */
                hostname: 'securegw-stage.paytm.in',

                /* for Production */
                // hostname: 'securegw.paytm.in',

                port: 443,
                path: '/order/status',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': post_data.length
                }
            };

            var response = "";
            var post_req = https.request(options, function(post_res) {
                post_res.on('data', function (chunk) {
                    response += chunk;
                });

                post_res.on('end', function(){
                    console.log('Response: ', response);
                    res.json(JSON.parse(response))
                });
            });

            post_req.write(post_data);
            post_req.end();
        });        
        
        
    } else {
        console.log("Checksum Mismatched");
        res.json({
            "MESSAGE":"STOP MESSING AROUND WITH GATEWAY"
        })
    }
});

// router.post('/owner/register', authSuperAdmin, usersController.createUser);
module.exports = router;