'use strict'

class AuthController {

    async login({ view }){
        return view.render('admin.auth.login');
    }

    async postLogin({ request, auth, response, session }) {
        const { email, password } = request.all();
        try {
            await auth.attempt(email, password);
            return response.redirect('/admin');
        } catch (error) {
            session.flash({loginError: 'اطلاعات کاربری اشتباه است'})
            return response.redirect('/admin/login');
        }
    }
}

module.exports = AuthController
