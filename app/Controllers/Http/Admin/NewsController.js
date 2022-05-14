'use strict'
const Content = use('App/Models/Content')
const Helpers = use('Helpers')
const sharp = require('sharp')
const Drive = use('Drive')
class NewsController {
    async list({ request,view }){ 
        const page = request.get().page || 1;
        const news = await Content.query().news().orderBy('id','DESC').paginate(page,15);
        return view.render('admin.news.list',{
            news  : news.toJSON()
        });
    }
    async delete({ response, session, params}) {
        const news = await Content.find(params.id);
        Drive.delete(Helpers.publicPath('asset/admin/uploads/news/medium/'+news.image))
        Drive.delete(Helpers.publicPath('asset/admin/uploads/news/big/'+news.image))
        await news.delete();
        session.flash({ message: 'Your job has been removed'});
        return response.redirect('back');
    }
    async update({ params, view }) {
        const news = await Content.find(params.id);
        return view.render('admin.news.update', { news: news });
    }
    async saveUpdate({ response , request , session , params }){
        const news = await Content.find(params.id);
        if(request.file('image') != null){
         
            Drive.delete(Helpers.publicPath('asset/admin/uploads/news/medium/'+news.image))
            Drive.delete(Helpers.publicPath('asset/admin/uploads/news/big/'+news.image))
            const myPic = request.file('image')
            const timeNow = new Date().getTime()
            await myPic.move(Helpers.publicPath('asset/admin/uploads/news/big/'), {
                name: `${timeNow}${'.jpg'}`            
            })
            sharp(Helpers.publicPath('asset/admin/uploads/news/big/'+timeNow+'.jpg'))
            .resize(1000, 1000)
            .toFile(Helpers.publicPath('asset/admin/uploads/news/medium/'+timeNow+'.jpg'), (err, info) => {
                return err;
            });
            request.all().image = timeNow+'.jpg'
        }

        if(request.all().show_first == 'on'){
            request.all().show_first = 1;
        }else{
            request.all().show_first = 0;
        }
        if(request.all().show_menu == 'on'){
            request.all().show_menu = 1;
        }else{
            request.all().show_menu = 0;
        }
        if(request.all().show_side == 'on'){
            request.all().show_side = 1;
        }else{
            request.all().show_side = 0;
        }
        news.title = request.all().title;
        news.image = request.all().image;

        news.lead = request.all().lead;
        news.content = request.all().content;
        news.description = request.all().description;
        news.show_first = request.all().show_first;
        news.show_side = request.all().show_side;
        news.show_menu = request.all().show_menu;
        news.status = request.all().status;
        news.keyword = request.all().keyword;
    

        await news.save();
        session.flash({ message: 'Your user has been updated. '});
        return response.redirect('/admin/news/list');
    }
    async create({ view }){
        return view.render('admin.news.create');
    }
    async saveCreate({ request, response}){
        

        if(request.file('image') != null){
            const myPic = request.file('image')
            const timeNow = new Date().getTime()
            await myPic.move(Helpers.publicPath('asset/admin/uploads/news/big/'), {
                name: `${timeNow}${'.jpg'}`            
            })
            sharp(Helpers.publicPath('asset/admin/uploads/news/big/'+timeNow+'.jpg'))
            .resize(1000, 1000)
            .toFile(Helpers.publicPath('asset/admin/uploads/news/medium/'+timeNow+'.jpg'), (err, info) => {
                return err;
            });
            request.all().image = timeNow+'.jpg'

        }
        

        if(request.all().show_first == 'on'){
            request.all().show_first = 1;
        }else{
            request.all().show_first = 0;
        }
        if(request.all().show_menu == 'on'){
            request.all().show_menu = 1;
        }else{
            request.all().show_menu = 0;
        }
        if(request.all().show_side == 'on'){
            request.all().show_side = 1;
        }else{
            request.all().show_side = 0;
        }
        const news = await Content.create(request.only([
            'title',
            'title_seo',
            'description',
            'content',
            'lead',
            'status',
            'show_first',
            'show_menu',
            'show_side',
            'keyword',
            'image',
            'content_type_id'
        ]));
        return response.redirect('/admin/news/list');
    }
    async destroy({request,response}){
        const news = await  Content.query().whereIn('id',request.all().deletedId).delete()
        return response.redirect('back');
    }
}

module.exports = NewsController
