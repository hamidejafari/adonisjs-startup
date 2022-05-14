'use strict'
const ArticleCategory = use('App/Models/ArticleCategory')
const Helpers = use('Helpers')
const sharp = require('sharp')
const Drive = use('Drive')
class ArticleCategoryController {
    async list({ request,view }){
        const page = request.get().page || 1;
        const articleCategory = await ArticleCategory.query().with('parent').orderBy('id', 'desc').paginate(page,15);
        const categories = await ArticleCategory.query().where('parent_id',null).orderBy('id', 'desc').fetch();
        return view.render('admin.article-category.list',{
            articleCategory  : articleCategory.toJSON(),
            categories  : categories.toJSON()
        });
    }
    async store({response , request}){
        if(request.file('image') != null){
            const myPic = request.file('image')
            const timeNow = new Date().getTime()
            await myPic.move(Helpers.publicPath('asset/admin/uploads/article-category/big/'), {
                name: `${timeNow}${'.jpg'}`
            })
            sharp(Helpers.publicPath('asset/admin/uploads/article-category/big/'+timeNow+'.jpg'))
            .resize(1000, 1000)
            .toFile(Helpers.publicPath('asset/admin/uploads/article-category/medium/'+timeNow+'.jpg'), (err, info) => {
                return err;
            });
            request.all().image = timeNow+'.jpg'
        }
        const articleCategory = await ArticleCategory.create(request.only([
            'title',
            'parent_id',
            'image'
        ]));
        return response.redirect('back');
    }
    async edit({ response , request , params }){
        const articleCategory = await ArticleCategory.find(request.all().category_id);
        if(request.file('image') != null){
            Drive.delete(Helpers.publicPath('asset/admin/uploads/article-category/medium/'+articleCategory.image))
            Drive.delete(Helpers.publicPath('asset/admin/uploads/article-category/big/'+articleCategory.image))
            const myPic = request.file('image')
            const timeNow = new Date().getTime()
            await myPic.move(Helpers.publicPath('asset/admin/uploads/article-category/big/'), {
                name: `${timeNow}${'.jpg'}`            
            })
            sharp(Helpers.publicPath('asset/admin/uploads/article-category/big/'+timeNow+'.jpg'))
            .resize(1000, 1000)
            .toFile(Helpers.publicPath('asset/admin/uploads/article-category/medium/'+timeNow+'.jpg'), (err, info) => {
                return err;
            });
            request.all().image = timeNow+'.jpg'
        }
        articleCategory.title = request.all().title;
        articleCategory.image = request.all().image;
        articleCategory.parent_id = request.all().parent_id;
        await articleCategory.save();
        return response.redirect('back');
    }
    async delete({params,response}){
        const articleCategory = await ArticleCategory.find(params.id);
        await articleCategory.delete();
        return response.redirect('back');
    }
    async destroy({request,response}){
        const articleCategory = await  ArticleCategory.query().whereIn('id',request.all().deletedId).delete()
        return response.redirect('back');
    }
}

module.exports = ArticleCategoryController
