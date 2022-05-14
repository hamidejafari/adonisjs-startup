'use strict'
const Page = use('App/Models/Page')
const PageCategory = use('App/Models/PageCategory')
const Helpers = use('Helpers')
const sharp = require('sharp')
const Drive = use('Drive')
class PageController {
    async list({ request,view }){
        const page = request.get().page || 1;
        const pages = await Page.query().where(function () {
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
        // const pageCategory = await PageCategory.query().with('category').orderBy('id', 'desc').fetch();
        const pageCategory = await PageCategory.query().with('parent').orderBy('id', 'desc').fetch();
        return view.render('admin.page.list',{
            pages  : pages.toJSON(),
            pageCategory  : pageCategory.toJSON()

        });
    }
    async create({ view }){
        const pageCategory = await PageCategory.query().with('parent').orderBy('id', 'desc').fetch();
        return view.render('admin.page.create',{
            pageCategory  : pageCategory.toJSON()
        });
    }
    async store({response , request}){
        if(request.file('image') != null){
            
            const myPic = request.file('image')
            const timeNow = new Date().getTime()
            await myPic.move(Helpers.publicPath('asset/admin/uploads/page/big/'), {
                name: `${timeNow}${'.jpg'}`
            })
            sharp(Helpers.publicPath('asset/admin/uploads/page/big/'+timeNow+'.jpg'))
            .resize(1000, 1000)
            .toFile(Helpers.publicPath('asset/admin/uploads/page/medium/'+timeNow+'.jpg'), (err, info) => {
                return err;
            });
            request.all().image = timeNow+'.jpg'
        }
        const page = await Page.create(request.only([
            'title',
            'status',
            'category_id',
            'image',
            'description',
            'content',
            'title_seo',
            'keyword'
        ]));
        return response.redirect('/admin/page/list');
    }
    async delete({params,response}){
        const page = await Page.find(params.id);
        await page.delete();
        return response.redirect('back');
    }
    async update({ view , params}){
        const pageCategory = await PageCategory.query().with('parent').orderBy('id', 'desc').fetch();
        const page = await Page.find(params.id);
        return view.render('admin.page.update',{
            pageCategory  : pageCategory.toJSON(),
            page  : page
        });
    }
    async edit({ response , request , params }){
        const page = await Page.find(params.id);
        if(request.file('image') != null){
            Drive.delete(Helpers.publicPath('asset/admin/uploads/page/medium/'+page.image))
            Drive.delete(Helpers.publicPath('asset/admin/uploads/page/big/'+page.image))
            const myPic = request.file('image')
            const timeNow = new Date().getTime()
            await myPic.move(Helpers.publicPath('asset/admin/uploads/page/big/'), {
                name: `${timeNow}${'.jpg'}`            
            })
            sharp(Helpers.publicPath('asset/admin/uploads/page/big/'+timeNow+'.jpg'))
            .resize(1000, 1000)
            .toFile(Helpers.publicPath('asset/admin/uploads/page/medium/'+timeNow+'.jpg'), (err, info) => {
                return err;
            });
            request.all().image = timeNow+'.jpg'
        }
        page.title = request.all().title;
        page.status = request.all().status;
        page.category_id = request.all().category_id;
        page.image = request.all().image;
        page.description = request.all().description;
        page.content = request.all().content;
        page.title_seo = request.all().title_seo;
        page.keyword = request.all().keyword;
        await page.save();
        return response.redirect('/admin/page/list');
    }
    async destroy({request,response}){
        const page = await  Page.query().whereIn('id',request.all().deletedId).delete()
        return response.redirect('back');
    }
}

module.exports = PageController
