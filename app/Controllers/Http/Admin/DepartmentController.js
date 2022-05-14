'use strict'

const Department = use('App/Models/Department')

class DepartmentController {
    async list({ request,view }){
        const departments = await Department.query().orderBy('id', 'desc').fetch();
        return view.render('admin.department.list',{
            departments  : departments.toJSON()
        });
    }
    async create({ view }){
        return view.render('admin.department.create');
    }
    async store({response , request}){
        await Department.create(request.only([
            'title'
        ]));
        return response.redirect('/admin/department/list');
    }
    async update({ view , params}){
        const department = await Department.find(params.id);
        return view.render('admin.department.update',{
            department  : department
        });
    }
    async edit({ response , request , params }){
        const department = await Department.find(params.id);
        department.title = request.all().title;
        await department.save();
        return response.redirect('/admin/department/list');
    }
    async destroy({request,response}){
        await  Department.query().whereIn('id',request.all().deletedId).delete()
        return response.redirect('back');
    }
}

module.exports = DepartmentController
