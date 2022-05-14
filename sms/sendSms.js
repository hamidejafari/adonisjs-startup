const axios = require('axios')

module.exports = async function sendSms(mobile, message, token) {
    const tokenData = {
        "UserApiKey": "93c695054f83317c2e29880",
        "SecretKey": "!Q@W#E"
    }

    try {
        const headers = {
            'Content-Type': 'application/json',
            'x-sms-ir-secure-token': token,
        }

        const sendResult = await axios.post('http://RestfulSms.com/api/MessageSend', {
            "Messages": [message],
            "MobileNumbers": [mobile],
            "LineNumber": "3000772939",
            "SendDateTime": "",
            "CanContinueInCaseOfError": "false",
        },
            { headers });
        console.log(sendResult.data)

    }
    catch (ex) {
        console.log(ex)
    }
}