const axios = require('axios')
module.exports = async function getToken() {
    const tokenData = {
        "UserApiKey": "93c695054f83317c2e29880",
        "SecretKey": "!Q@W#E"
    }
    try {
        const tokenResult = await axios.post(
            'http://RestfulSms.com/api/Token',
            tokenData
        )
        return tokenResult.data.TokenKey
    }
    catch (ex) {
        return false
    }
}