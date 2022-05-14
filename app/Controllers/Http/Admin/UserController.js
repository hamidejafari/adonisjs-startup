'use strict'
const User = use('App/Models/User')
const Logger = use('Logger')
class UserController {
    async list({ view ,request }){
        const page = request.get().page || 1;
        const users = await User.query().where(function () {
            if(request.all()){
                if(request.all().user_id){
                    this.where('user_id',request.all().user_id)
                }     
                if(request.all().name){
                    this.where('name', 'LIKE', '%'+request.all().name+'%')
                }     
                if(request.all().family){
                    this.where('family', 'LIKE', '%'+request.all().family+'%')
                }  
                if(request.all().mobile){
                    this.where('mobile', 'LIKE', '%'+request.all().mobile+'%')
                }
                if(request.all().email){
                    this.where('email', 'LIKE', '%'+request.all().email+'%')
                }          
                if(request.all().gender){
                    this.where('gender', request.all().gender)
                }
            }
        }).orderBy('id','DESC').where('user_type_id',1).paginate(page,15)
        return view.render('admin.users.list',{
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
        await user.save();
        return response.redirect('back');
    }
    async delete({ response, session, params}) {
        const user = await User.find(params.id);

        await user.delete();
        session.flash({ message: 'Your job has been removed'});
        return response.redirect('back');
    }
   
    async update({ params, view }) {
        const user = await User.find(params.id);
        return view.render('admin.users.update', { user: user });
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
        user.user_type_id = request.all().user_type_id;


        await user.save();
        

        session.flash({ message: 'Your user has been updated. '});
        return response.redirect('/admin/users/list');
    }
   

    async create({ view }){
        return view.render('admin.users.create');
    }
    async postCreate({ request, response}){
        const user = await User.create(request.only(['name','family','mobile','status','password']));
        return response.redirect('/admin/users/list');
    }
  
}

module.exports = UserController
