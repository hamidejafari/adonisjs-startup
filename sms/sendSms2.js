const axios = require('axios')

module.exports = async function sendSms(mobile, message) {

    try {

        const sendResult = await axios.post('https://rest.payamak-panel.com/api/SendSMS/SendSMS', {
            username:'law8516',
            password:'8516',
            to:mobile,
            from:'2188321088',
            text:message,
            
        });
        // console.log(sendResult)

    }
    catch (ex) {
        console.log(ex)
    }
}