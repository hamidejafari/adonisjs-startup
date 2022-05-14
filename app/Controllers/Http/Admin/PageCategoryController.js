'use strict'
const PageCategory = use('App/Models/PageCategory')
const Helpers = use('Helpers')
const sharp = require('sharp')
const Drive = use('Drive')
class PageCategoryController {
    async list({ request,view }){
        const page = request.get().page || 1;
        const pageCategory = await PageCategory.query().with('parent').orderBy('id', 'desc').paginate(page,15);
        const categories = await PageCategory.query().where('parent_id',null).orderBy('id', 'desc').fetch();
        return view.render('admin.page-category.list',{
            pageCategory  : pageCategory.toJSON(),
            categories  : categories.toJSON()
        });
    }


    async store({response , request}){
        if(request.file('image') != null){
            
            const myPic = request.file('image')
            const timeNow = new Date().getTime()
            await myPic.move(Helpers.publicPath('asset/admin/uploads/page-category/big/'), {
                name: `${timeNow}${'.jpg'}`
            })
            sharp(Helpers.publicPath('asset/admin/uploads/page-category/big/'+timeNow+'.jpg'))
            .resize(1000, 1000)
            .toFile(Helpers.publicPath('asset/admin/uploads/page-category/medium/'+timeNow+'.jpg'), (err, info) => {
                return err;
            });
            request.all().image = timeNow+'.jpg'
        }
        const pageCategory = await PageCategory.create(request.only([
            'title',
            'parent_id',
            'image'
        ]));
        return response.redirect('back');
    }
    async edit({ response , request , params }){
        const pageCategory = await PageCategory.find(request.all().category_id);
        if(request.file('image') != null){
            Drive.delete(Helpers.publicPath('asset/admin/uploads/page-category/medium/'+pageCategory.image))
            Drive.delete(Helpers.publicPath('asset/admin/uploads/page-category/big/'+pageCategory.image))
            const myPic = request.file('image')
            const timeNow = new Date().getTime()
            await myPic.move(Helpers.publicPath('asset/admin/uploads/page-category/big/'), {
                name: `${timeNow}${'.jpg'}`            
            })
            sharp(Helpers.publicPath('asset/admin/uploads/page-category/big/'+timeNow+'.jpg'))
            .resize(1000, 1000)
            .toFile(Helpers.publicPath('asset/admin/uploads/page-category/medium/'+timeNow+'.jpg'), (err, info) => {
                return err;
            });
            request.all().image = timeNow+'.jpg'
        }
        pageCategory.title = request.all().title;
        pageCategory.image = request.all().image;
        pageCategory.parent_id = request.all().parent_id;
        await pageCategory.save();
        return response.redirect('back');
    }
    async delete({params,response}){
        const pageCategory = await PageCategory.find(params.id);
        await pageCategory.delete();
        return response.redirect('back');
    }
    async destroy({request,response}){
        const pageCategory = await  PageCategory.query().whereIn('id',request.all().deletedId).delete()
        return response.redirect('back');
    }
}

module.exports = PageCategoryController
