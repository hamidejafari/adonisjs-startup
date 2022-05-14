'use strict'

const Order = use('App/Models/Order')
const User = use('App/Models/User')
const Env = use('Env')
const soap = require('soap');
const url = 'https://bpm.shaparak.ir/pgwchannel/services/pgw?wsdl';
const terminalId = Env.get('MELLAT_TERMINAL_ID');
const userName = Env.get('MELLAT_USERNAME');
const password = Env.get('MELLAT_PASSWORD');
const callbackUrl = Env.get('MELLAT_CALLBACK');

class MellatController {

    sendPayRequest(args) {
        return new Promise((resolve, reject) => {
            soap.createClient(url, (err, client) => {
                client.bpPayRequest(args, function (err, result) {
                    return resolve(result)
                });
            });
        });
    }

    sendVerifyRequest(args) {
        return new Promise((resolve, reject) => {
            soap.createClient(url, (err, client) => {
                client.bpVerifyRequest(args, function (err, result) {
                    return resolve(result)
                });
            });
        });
    }

    sendSettleRequest(args) {
        return new Promise((resolve, reject) => {
            soap.createClient(url, (err, client) => {
                client.bpSettleRequest(args, function (err, result) {
                    return resolve(result)
                });
            });
        });
    }

    sendReversalRequest(args) {
        return new Promise((resolve, reject) => {
            soap.createClient(url, (err, client) => {
                client.bpReversalRequest(args, function (err, result) {
                    return resolve(result)
                });
            });
        });
    }


    async startPayment({ response, session, params }) {
        const order = await Order.find(params.orderId);
        if (order !== null) {
            const user = order.user().fetch()
            let args = {
                terminalId: terminalId,
                userName: userName,
                userPassword: password,
                orderId: order.id,
                amount: order.payments,
                localDate: '20190612',
                localTime: '14:30',
                additionalData: '',
                callBackUrl: callbackUrl,
                payerId: '0'
            };

            try {
                const res = await this.sendPayRequest(args);
                let payRequestResult = res.return.split(',');
                if (payRequestResult[0] === '0') {
                    order.authority = payRequestResult[1];
                    await order.save();
                    response.send(`<form name="myform" action="https://bpm.shaparak.ir/pgwchannel/startpay.mellat" method="POST">
                               <input type="hidden" id="RefId" name="RefId" value="${payRequestResult[1]}">
                               </form><script type="text/javascript">window.onload = formSubmit; function formSubmit() { document.forms[0].submit(); }</script>`);
                }
            } catch (error) {
                response.notFound('order not found 1')
            }
        } else {
            response.notFound('order not found 2')
        }
    }

    async finishPayment({ response, session, params, request , view}) {
        
        let orderId = request.input('SaleOrderId');
        let verifySaleOrderId = request.input('SaleOrderId');
        let verifySaleReferenceId = request.input('SaleReferenceId');

        let args = {
            terminalId: terminalId,
            userName: userName,
            userPassword: password,
            orderId: orderId,
            saleOrderId: verifySaleOrderId,
            saleReferenceId: verifySaleReferenceId
        };

        let finalResult = '';
        let reversalResult = '';
        let success = false;
        const verifyResult = await this.sendVerifyRequest(args);
        if (verifyResult.return === '0') {
            const settleResult = await this.sendSettleRequest(args);
            if (settleResult.return === '0') {
                const order = await Order.find(orderId);
          
                order.ref_id = verifySaleReferenceId;
                order.status = 1;
                await order.save();

                const user = await User.find(order.user_id);
                user.wallet = user.wallet + order.payments;
                await user.save();
                success = true;
                finalResult = verifySaleReferenceId;
            } else {
                reversalResult = await this.sendReversalRequest(args);
                finalResult = reversalResult.return;
            }
        } else {
            reversalResult = await this.sendReversalRequest(args);
            finalResult = reversalResult.return;
        }
        return view.render('site.payment-final', {
            success: success,
            finalResult: finalResult
        });
    }

}

module.exports = MellatController
