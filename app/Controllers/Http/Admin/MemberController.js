'use strict'
const User = use('App/Models/User')
const Department = use('App/Models/Department')
const DepartmentUser = use('App/Models/DepartmentUser')

class MemberController {
    async list({ view }){
        const users = await User.query().where('admin',1).fetch();
        return view.render('admin.member.list',{
            users  : users.toJSON()
        });
    }
    async delete({ response, session, params}) {
        const user = await User.find(params.id);
        await user.departments().detach()
        await user.delete();
        return response.redirect('back');
    }
    async update({ params, view }) {
        const user = await User.find(params.id);
        const department = await Department
            .query()
            .orderBy('id', 'desc')
            .fetch();
        const departmentUser = await DepartmentUser.query().where('user_id',user.id).pluck('department_id');
        return view.render('admin.member.update', { user: user,department: department.toJSON(),departmentUser:departmentUser });
    }
    async postUpdate({ response , request , session , params }){
        const user = await User.find(params.id);
        if(request.all().department != null){
            await user.departments().detach()
            await user.departments().attach(request.all().department)
        }
        if(request.all().password != null){
            user.password = request.all().password;
        }
        user.name = request.all().name;
        user.family = request.all().family;
        user.status = request.all().status;
        user.email = request.all().email;
        user.mobile = request.all().mobile;
        await user.save();
        return response.redirect('/admin/member/list');
    }

    async create({ view }){
        const department = await Department
            .query()
            .orderBy('id', 'desc')
            .fetch();
        return view.render('admin.member.create',{
            department: department.toJSON()
        });
    }

    async postCreate({ request, response}){
        request.all().admin = 1
        const user = await User.create(request.only(['name','family','mobile','email','status','password','admin']));
        if(request.all().department != null){
            await user.departments().attach(request.all().department)
        }
        return response.redirect('/admin/member/list');
    }
}

module.exports = MemberController
