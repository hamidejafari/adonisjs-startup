'use strict'

const Task = use('Task')
const getToken = require("./../../sms/getToken")
const sendSms = require("./../../sms/sendSms")
const sendSms2 = require("./../../sms/sendSms2")
const sendSmsSoup = require("./../../sms/soapSend")
class SmsEvent extends Task {
  static get schedule() {
    return '* * * * *'
  }

  async handle() {
   // const token = getToken()

    //if(token){
    //  sendSms('09029249146','salam',token)
    // }
    // await sendSmsSoup('9029249146','salam')
    sendSms2('09125948691,09029249146','سلام - تست پیامک آنی مشاور')
  }
}

module.exports = SmsEvent
