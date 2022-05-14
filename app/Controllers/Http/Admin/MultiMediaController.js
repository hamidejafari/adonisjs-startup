'use strict'
const Content = use('App/Models/Content')
const Helpers = use('Helpers')
const sharp = require('sharp')
const Drive = use('Drive')
class MultiMediaController {
    async list({ request,view }){
        const page = request.get().page || 1;
        const multi = await Content.query().multiMedia().paginate(page,15);
        return view.render('admin.multi-media.list',{
            multi  : multi.toJSON()
        });
    }
    async delete({ response, session, params}) {
        const multi = await Content.find(params.id);
        Drive.delete(Helpers.publicPath('asset/admin/uploads/multi-media/medium/'+multi.image))
        Drive.delete(Helpers.publicPath('asset/admin/uploads/multi-media/big/'+multi.image))
        Drive.delete(Helpers.publicPath('asset/admin/uploads/multi-media/video/'+multi.file))
        await multi.delete();
        session.flash({ message: 'Your job has been removed'});
        return response.redirect('back');
    }
    async update({ params, view }) {
        const multi = await Content.find(params.id);
        return view.render('admin.multi-media.update', { multi: multi });
    }
    async saveUpdate({ response , request , session , params }){
        const multi = await Content.find(params.id);

        if(request.file('image') != null){
            Drive.delete(Helpers.publicPath('asset/admin/uploads/multi-media/medium/'+multi.image))
            Drive.delete(Helpers.publicPath('asset/admin/uploads/multi-media/big/'+multi.image))
            const myPic = request.file('image')
            const timeNow = new Date().getTime()
            await myPic.move(Helpers.publicPath('asset/admin/uploads/multi-media/big/'), {
                name: `${timeNow}${'.jpg'}`            
            })
            sharp(Helpers.publicPath('asset/admin/uploads/multi-media/big/'+timeNow+'.jpg'))
            .resize(1000, 1000)
            .toFile(Helpers.publicPath('asset/admin/uploads/multi-media/medium/'+timeNow+'.jpg'), (err, info) => {
                return err;
            });
            request.all().image = timeNow+'.jpg'
        }
        if(request.file('video') != null){
            Drive.delete(Helpers.publicPath('asset/admin/uploads/multi-media/video/'+multi.file))
            const myVideo = request.file('video')
            const timeNow2 = new Date().getTime()
            await myVideo.move(Helpers.publicPath('asset/admin/uploads/multi-media/video/'), {
                name: `${timeNow2}${'.mp4'}`            
            })
            request.all().file = timeNow2+'.mp4'
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
        multi.title = request.all().title;
        multi.image = request.all().image;
        multi.file = request.all().file;
        multi.lead = request.all().lead;
        multi.content = request.all().content;
        multi.description = request.all().description;
        multi.show_first = request.all().show_first;
        multi.show_side = request.all().show_side;
        multi.show_menu = request.all().show_menu;
        multi.status = request.all().status;
        multi.keyword = request.all().keyword;
    

        await multi.save();
        session.flash({ message: 'Your user has been updated. '});
        return response.redirect('/admin/multi-media/list');
    }
    async create({ view }){
        return view.render('admin.multi-media.create');
    }
    async saveCreate({ request, response}){

        if(request.file('image') != null){
            const myPic = request.file('image')
            const timeNow = new Date().getTime()
            await myPic.move(Helpers.publicPath('asset/admin/uploads/multi-media/big/'), {
                name: `${timeNow}${'.jpg'}`            
            })
            sharp(Helpers.publicPath('asset/admin/uploads/multi-media/big/'+timeNow+'.jpg'))
            .resize(1000, 1000)
            .toFile(Helpers.publicPath('asset/admin/uploads/multi-media/medium/'+timeNow+'.jpg'), (err, info) => {
                return err;
            });
            request.all().image = timeNow+'.jpg'
        }
        if(request.file('video') != null){
            const myVideo = request.file('video')
            const timeNow2 = new Date().getTime()
            await myVideo.move(Helpers.publicPath('asset/admin/uploads/multi-media/video/'), {
                name: `${timeNow2}${'.mp4'}`            
            })
            request.all().file = timeNow2+'.mp4'
        }
        console.log(request.file('video'));

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

        const multi = await Content.create(request.only([
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
            'file',
            'content_type_id'
        ]));
    
        return response.redirect('/admin/multi-media/list');
    }
}

module.exports = MultiMediaController
