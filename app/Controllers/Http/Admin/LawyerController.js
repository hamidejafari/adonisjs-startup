'use strict'
const User = use('App/Models/User')
const Logger = use('Logger')
class LawyerController {
    async list({ view  , request}){
        const page = request.get().page || 1;
        const users = await User.query().lawyer().paginate(page,15);
        return view.render('admin.lawyer.list',{
            users  : users.toJSON()
        });
    }
    async vip({ response, session, params}) {
        const user = await User.find(params.id);
        user.vip = !user.vip;
        await user.save();
        return response.redirect('back');
    }
    async status({ response, session, params}) {
        const user = await User.find(params.id);
        user.status = !user.status;
        user.allow_work = !user.allow_work;
        await user.save();
        return response.redirect('back');
    }
    async confirmImage({ response, session, params}) {
        const user = await User.find(params.id);
        user.confirm_image = !user.confirm_image;
        await user.save();
        return response.redirect('back');
    }
    async delete({ response, session, params}) {
        const user = await User.find(params.id);
        await user.delete();
        return response.redirect('back');
    }
    async delete({ response, session, params}) {
        const user = await User.find(params.id);
        await user.delete();
        return response.redirect('back');
    }
    async update({ params, view }) {
        const user = await User.find(params.id);
        return view.render('admin.lawyer.update', { user: user });
    }
    async postUpdate({ response , request , session , params }){
        const user = await User.find(params.id);
        // return request.all();
        if(request.all().password != null){
            user.password = request.all().password;
        }
        user.name = request.all().name;
        user.family = request.all().family;
        user.status = request.all().status;
        user.email = request.all().email;
        user.mobile = request.all().mobile;
        await user.save();
        return response.redirect('/lawyer/list');
    }
    async create({ view }){
        return view.render('admin.lawyer.create');
    }
    async postCreate({ request, response}){
        request.all().user_type_id = 3;
        const user = await User.create(request.only(['name','family','mobile','status','password','user_type_id']));
        return response.redirect('/lawyer/list');
    }
}

module.exports = LawyerController
