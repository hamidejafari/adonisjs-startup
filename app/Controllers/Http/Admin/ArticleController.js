'use strict'
const Article = use('App/Models/Article')
const ArticleCategory = use('App/Models/ArticleCategory')
const Helpers = use('Helpers')
const sharp = require('sharp')
const Drive = use('Drive')
class ArticleController {
    async list({ request,view }){
        const page = request.get().page || 1;
        const articles = await Article.query().where(function () {
            if(request.all()){
                if(request.all().status && request.all().status != 'all'){
                    this.where('status',request.all().status)
                }
                if(request.all().title){
                    this.where('title', 'LIKE', '%'+request.all().title+'%')
                }
                if(request.all().category_id && request.all().category_id != 'all'){
                    this.where('category_id', request.all().category_id)
                }
            }
        }).with('category').orderBy('id', 'desc').paginate(page,15);
        // const articles = await Article.query().with('category').orderBy('id', 'desc').fetch();
        const articleCategory = await ArticleCategory.query().with('parent').orderBy('id', 'desc').fetch();
        return view.render('admin.article.list',{
            articles  : articles.toJSON(),
            articleCategory  : articleCategory.toJSON()
        });
    }
    async create({ view }){
        const articleCategory = await ArticleCategory.query().with('parent').orderBy('id', 'desc').fetch();
        return view.render('admin.article.create',{
            articleCategory  : articleCategory.toJSON()
        });
    }
    async store({response , request}){
        if(request.file('image') != null){
            
            const myPic = request.file('image')
            const timeNow = new Date().getTime()
            await myPic.move(Helpers.publicPath('asset/admin/uploads/article/big/'), {
                name: `${timeNow}${'.jpg'}`
            })
            sharp(Helpers.publicPath('asset/admin/uploads/article/big/'+timeNow+'.jpg'))
            .resize(1000, 1000)
            .toFile(Helpers.publicPath('asset/admin/uploads/article/medium/'+timeNow+'.jpg'), (err, info) => {
                return err;
            });
            request.all().image = timeNow+'.jpg'
        }

        const article = await Article.create(request.only([
            'title',
            'status',
            'category_id',
            'image',
            'description',
            'content',
            'title_seo',
            'keyword'
        ]));
        return response.redirect('/admin/article/list');
    }
    async delete({params,response}){
        const article = await Article.find(params.id);
        await article.delete();
        return response.redirect('back');
    }
    async update({ view , params}){
        const articleCategory = await ArticleCategory.query().with('parent').orderBy('id', 'desc').fetch();
        const article = await Article.find(params.id);
        return view.render('admin.article.update',{
            articleCategory  : articleCategory.toJSON(),
            article  : article
        });
    }
    async edit({ response , request , params }){
    
        const article = await Article.find(params.id);
        if(request.file('image') != null){
            Drive.delete(Helpers.publicPath('asset/admin/uploads/article/medium/'+article.image))
            Drive.delete(Helpers.publicPath('asset/admin/uploads/article/big/'+article.image))
            const myPic = request.file('image')
            const timeNow = new Date().getTime()
            await myPic.move(Helpers.publicPath('asset/admin/uploads/article/big/'), {
                name: `${timeNow}${'.jpg'}`            
            })
            sharp(Helpers.publicPath('asset/admin/uploads/article/big/'+timeNow+'.jpg'))
            .resize(1000, 1000)
            .toFile(Helpers.publicPath('asset/admin/uploads/article/medium/'+timeNow+'.jpg'), (err, info) => {
                return err;
            });
            request.all().image = timeNow+'.jpg'
        }
        article.title = request.all().title;
        article.status = request.all().status;
        article.category_id = request.all().category_id;
        article.image = request.all().image;
        article.description = request.all().description;
        article.content = request.all().content;
        article.title_seo = request.all().title_seo;
        article.keyword = request.all().keyword;
        await article.save();
        return response.redirect('/admin/article/list');

    }
    async destroy({request,response}){
        const article = await  Article.query().whereIn('id',request.all().deletedId).delete()
        return response.redirect('back');
    }
}

module.exports = ArticleController
