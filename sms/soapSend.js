const soap = require('soap');
const url = 'http://api.payamak-panel.com/post/Send.asmx?wsdl'
const username = 'law8516'
const password = '8516'
const sender = '2188321088'

function send(args) {
    console.log(12)
    return new Promise((resolve, reject) => {
        soap.createClient(url, (err, client) => {
            console.log(err)
            client.SendSms(args, function (err, result) {
                console.log(result)
                console.log(err)
                return resolve(result)
            });
        });
    });
}

module.exports = async function sendSms(mobile, message) {
    let args = {
        username: username,
        password: password,
        from: sender,
        to: [mobile],
        text: message,
        isflash: false,
        udh: '',
        recId: [],
        status: 0x0
    }

    const result =  await send(args)
    console.log(result)
}
