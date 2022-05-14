'use strict'
const Uploader = use('App/Models/Uploader')
const Helpers = use('Helpers')
const sharp = require('sharp')
const Drive = use('Drive')
class UploaderController {
    async list({ request,view }){
        const page = request.get().page || 1;
        const uploader = await Uploader.query().orderBy('id', 'desc').paginate(page,15);
        return view.render('admin.uploader.list',{
            uploader  : uploader.toJSON()
        });
    }
    async delete({ response, session, params}) {
        const uploader = await Uploader.find(params.id);
        Drive.delete(Helpers.publicPath('asset/admin/uploads/uploader/medium/'+uploader.file))
        Drive.delete(Helpers.publicPath('asset/admin/uploads/uploader/big/'+uploader.file))
        await uploader.delete();
        return response.redirect('back');
    }
    async saveCreate({ request, response, session}){
        const myPic = request.file('image')
        const timeNow = new Date().getTime()
        await myPic.move(Helpers.publicPath('asset/admin/uploads/uploader/big/'), {
            name: `${timeNow}${'.jpg'}`            
        })
        
        sharp(Helpers.publicPath('asset/admin/uploads/uploader/big/'+timeNow+'.jpg'))
        .resize(1000, 1000)
        .toFile(Helpers.publicPath('asset/admin/uploads/uploader/medium/'+timeNow+'.jpg'), (err, info) => {
            return err;
        });
        const uploader = new Uploader()
        uploader.title = request.all().title
        uploader.file = timeNow+'.jpg'
        uploader.save()
        return response.redirect('/admin/uploader/list');
    }
    async destroy({request,response}){
        const uploader = await  Uploader.query().whereIn('id',request.all().deletedId).delete()
        return response.redirect('back');
    }
}

module.exports = UploaderController
