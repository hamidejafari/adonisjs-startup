'use strict'
const Content = use('App/Models/Content')
const Helpers = use('Helpers')
const sharp = require('sharp')
const Drive = use('Drive')
class SliderController {
    async list({ request,view }){
        const page = request.get().page || 1;
        const slider = await Content.query().slider().paginate(page,15);
        return view.render('admin.slider.list',{
            slider  : slider.toJSON()
        });
    }
    async delete({ response, session, params}) {
        const slider = await Content.find(params.id);
        Drive.delete(Helpers.publicPath('asset/admin/uploads/slider/medium/'+slider.image))
        Drive.delete(Helpers.publicPath('asset/admin/uploads/slider/big/'+slider.image))
        await slider.delete();
        session.flash({ message: 'Your job has been removed'});
        return response.redirect('back');
    }
    async update({ params, view }) {
        const slider = await Content.find(params.id);
        return view.render('admin.slider.update', { slider: slider });
    }
    async saveUpdate({ response , request , session , params }){
        const slider = await Content.find(params.id);

        if(request.file('image') != null){
         
            Drive.delete(Helpers.publicPath('asset/admin/uploads/slider/medium/'+slider.image))
            Drive.delete(Helpers.publicPath('asset/admin/uploads/slider/big/'+slider.image))
            const myPic = request.file('image')
            const timeNow = new Date().getTime()
            await myPic.move(Helpers.publicPath('asset/admin/uploads/slider/big/'), {
                name: `${timeNow}${'.jpg'}`            
            })
            sharp(Helpers.publicPath('asset/admin/uploads/slider/big/'+timeNow+'.jpg'))
            .resize(1000, 1000)
            .toFile(Helpers.publicPath('asset/admin/uploads/slider/medium/'+timeNow+'.jpg'), (err, info) => {
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
        slider.title = request.all().title;
        slider.image = request.all().image;
        slider.lead = request.all().lead;
        slider.content = request.all().content;
        slider.description = request.all().description;
        slider.show_first = request.all().show_first;
        slider.show_side = request.all().show_side;
        slider.show_menu = request.all().show_menu;
        slider.status = request.all().status;
        slider.keyword = request.all().keyword;
    

        await slider.save();
        session.flash({ message: 'Your user has been updated. '});
        return response.redirect('/admin/slider/list');
    }
    async create({ view }){
        return view.render('admin.slider.create');
    }
    async saveCreate({ request, response}){
        if(request.file('image') != null){
            const myPic = request.file('image')
            const timeNow = new Date().getTime()
            await myPic.move(Helpers.publicPath('asset/admin/uploads/slider/big/'), {
                name: `${timeNow}${'.jpg'}`            
            })
            sharp(Helpers.publicPath('asset/admin/uploads/slider/big/'+timeNow+'.jpg'))
            .resize(1000, 1000)
            .toFile(Helpers.publicPath('asset/admin/uploads/slider/medium/'+timeNow+'.jpg'), (err, info) => {
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

        

        const slider = await Content.create(request.only([
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
    
        return response.redirect('/admin/slider/list');
    }
    async destroy({request,response}){
        const sliders = await  Content.query().whereIn('id',request.all().deletedId).delete()
        return response.redirect('back');
    }
}

module.exports = SliderController
