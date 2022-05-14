'use strict'

const Order = use('App/Models/Order')
const Env = use('Env')
const ZarinpalCheckout = require('./../../../../payments/zarinpal/index');

const token = Env.get('ZARINPAL_TOKEN');
const useSandBox = Env.get('ZARINPAL_SANDBOX');
const callbackURL = Env.get('ZARINPAL_CALLBACK');

class ZarinpalController {

    async startPayment({ response, session, params }) {

        const order = await Order.find(params.orderId);
        if (order !== null) {
            const user = order.user().fetch()
            const zarinpal = ZarinpalCheckout.create(token, useSandBox)
            const zpResponse = await zarinpal.PaymentRequest({
                Amount: order.payments / 10,
                CallbackURL: callbackURL,
                Description: order.description,
                Email: user.email,
                Mobile: user.mobile
            })

            if (zpResponse.status === 100) {
                order.authority = zpResponse.authority;
                await order.save();
                response.redirect(zpResponse.url)
            } else {
                response.notFound(zpResponse.status)
            }
        } else {
            response.notFound('order not found')
        }

    }

    async finishPayment({ response, session, params, request }) {
        let authority = request.input('Authority')
        let statusStr = request.input('Status')

        if (statusStr === 'OK') {

            const order = await Order.findBy('zp_authortity', authority)
            if (order !== null) {
                const zarinpal = ZarinpalCheckout.create(token, useSandBox)
                const zpResponse = await zarinpal.PaymentVerification({
                    Amount: order.payments / 10,
                    Authority: authority
                })

                if (zpResponse.status === 100) {
                     order.ref_id = zpResponse.RefID;
                     order.status = 1
                    await order.save();
             
                    response.redirect(zpResponse.url)
                } else {
                    response.notFound(zpResponse.status)
                }

            } else {
                response.notFound('order not found')
            }
        } else {
            response.notFound('payment cancelled')
        }

        return view.render('site.payment-final',{
            refId  : zpResponse.RefID
        });
    }

}

module.exports = ZarinpalController
