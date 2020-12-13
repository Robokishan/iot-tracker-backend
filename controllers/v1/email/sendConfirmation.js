var {sendEmail} = require('./emailController.js')
module.exports = {
    sendConfirmation(data) {
        //TODO: CREATE HTML FOR PASSWORD
        data.html = `${data.password}`
        sendEmail(data).then().catch();
    }
}