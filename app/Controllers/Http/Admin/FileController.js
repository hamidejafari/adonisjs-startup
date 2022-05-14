'use strict'
const File = use('App/Models/File')
const Helpers = use('Helpers')

class FileController {
    async list({ view , request }){       
        const page = request.get().page || 1;
        const files = await File.query().with('user').with('admin').orderBy('id', 'desc').paginate(page,15);
        return view.render('admin.file.list',{
            files  : files.toJSON()
        });
    }
    async destroy({request,response}){
        const files = await  File.query().whereIn('id',request.all().deletedId).delete()
        return response.redirect('back');
    }
    async saveCreate({ request, response ,auth}){
        const admin = await auth.getUser()
        if(request.file('file') != null){
            const myFile = request.file('file')
            const timeNow = new Date().getTime()
            await myFile.move(Helpers.publicPath('asset/admin/uploads/file/'), {
                name: `${timeNow}.${myFile.extname}`
            })
            request.all().file = timeNow+'.'+myFile.extname
        }
        request.all().admin_id = admin.id
        const file = await File.create(request.only([
            'title',
            'user_id',
            'admin_id',
            'file'
        ]));
        return response.redirect('/admin/file/list');
    }
}

module.exports = FileController
