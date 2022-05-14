'use strict'
const Expertise = use('App/Models/Expertise')
const Helpers = use('Helpers')
const sharp = require('sharp')
const Drive = use('Drive')
class ExpertiseController {
    async list({ view , params , request}) {
        const page = request.get().page || 1;
        const expertise = await Expertise.query().where('type',params.type).orderBy('id', 'desc').paginate(page,15);
        return view.render('admin.expertise.list',{
            expertise: expertise.toJSON(),
            type : params.type
        });
    }
    async create({ view,params }) {
        const categories = await Expertise.query().where('type',params.type).where('type',1).fetch();
        return view.render('admin.expertise.create',{
            categories: categories.toJSON(),
            type : params.type
        });
    }
    async saveCreate({ request, response}){
        console.log(request.all())
        if(request.file('image') != null){
            const myPic = request.file('image')
            const timeNow = new Date().getTime()
            await myPic.move(Helpers.publicPath('asset/admin/uploads/expertise/big/'), {
                name: `${timeNow}${'.png'}`            
            })
            sharp(Helpers.publicPath('asset/admin/uploads/expertise/big/'+timeNow+'.png'))
            .resize(1000, 1000)
            .toFile(Helpers.publicPath('asset/admin/uploads/expertise/medium/'+timeNow+'.png'), (err, info) => {
                return err;
            });
            request.all().image = timeNow+'.png'
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
        const expertise = await Expertise.create(request.only([
            'title',
            'parent_id',
            'status',
            'show_first',
            'show_menu',
            'image',
            'type'
        ]));
        return response.redirect('/admin/expertise/list/'+ request.all().type );
    }
    async update({ params, view }) {
        const expertise = await Expertise.find(params.id);
        const categories = await Expertise.query().where('type',params.type).fetch();
        console.log(categories)
        return view.render('admin.expertise.update', { expertise: expertise,categories: categories.toJSON(),type:params.type });
    }
    async saveUpdate({ response , request , session , params }){
        const expertise = await Expertise.find(params.id);
        if(request.file('image') != null){
            Drive.delete(Helpers.publicPath('asset/admin/uploads/expertise/medium/'+expertise.image))
            Drive.delete(Helpers.publicPath('asset/admin/uploads/expertise/big/'+expertise.image))
            const myPic = request.file('image')
            const timeNow = new Date().getTime()
            await myPic.move(Helpers.publicPath('asset/admin/uploads/expertise/big/'), {
                name: `${timeNow}${'.png'}`            
            })
            sharp(Helpers.publicPath('asset/admin/uploads/expertise/big/'+timeNow+'.png'))
            .resize(1000, 1000)
            .toFile(Helpers.publicPath('asset/admin/uploads/expertise/medium/'+timeNow+'.png'), (err, info) => {
                return err;
            });
            request.all().image = timeNow+'.png'
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
        expertise.title = request.all().title;
        expertise.parent_id = request.all().parent_id;
        expertise.status = request.all().status;
        expertise.show_first = request.all().show_first;
        expertise.show_menu = request.all().show_menu;
        expertise.image = request.all().image;
        expertise.type = request.all().type;

        await expertise.save();
        session.flash({ message: 'Your user has been updated. '});
        return response.redirect('/admin/expertise/list/'+request.all().type);
    }
    async delete({ response, session, params}) {
        const expertise = await Expertise.find(params.id);
        Drive.delete(Helpers.publicPath('asset/admin/uploads/expertise/medium/'+expertise.image))
        Drive.delete(Helpers.publicPath('asset/admin/uploads/expertise/big/'+expertise.image))
        await expertise.delete();
        session.flash({ message: 'Your job has been removed'});
        return response.redirect('back');
    }
    async destroy({request,response}){
        const expertise = await  Expertise.query().whereIn('id',request.all().deletedId).delete()
        return response.redirect('back');
    }
}

module.exports = ExpertiseController
