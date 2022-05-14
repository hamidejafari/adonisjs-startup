'use strict'

const firebaseAdmin = use('Perafan/FirebaseAdmin');

class FcmController {
    async fcmSend({ request, response }) {
        const input = request.all();
        let result = false;
        firebaseAdmin.messaging().send({
            android: {
                data: {
                    type: '123456'
                },
                notification: {
                    sound: 'default',
                    tag: 'msg',
                    title: input.title,
                    body: input.body
                }
            },
            token: input.token
            //token: 'eeNSfNypK7o:APA91bGrtx4ThR0ZjO2klCpkrDWacXu6rt_0Rj8_b6eOZM2DzaiUqMoFVikj7YDEphUTIrnxR-Xeo-HfYItLSK3THQjz6KNSMjK0qT2aW7JFV4j2HYJjxbrhxfejdYj1kRrfmvsGJDyG'
        })
            .then((response) => {
                result = response;
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                result = error
                console.log('Error sending message:', error);
            });

        response.send(result);
    }
}

module.exports = FcmController