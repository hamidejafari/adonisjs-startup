'use strict'

const Content = use('App/Models/Content')

class SocialController {
    async list({ request,view }){
        const page = request.get().page || 1;
        const social = await Content.query().social().paginate(page,15);
        return view.render('admin.social.list',{
            social  : social.toJSON()
        });
    }
    async delete({ response, session, params}) {
        const social = await Content.find(params.id);
        await social.delete();
        session.flash({ message: 'Your job has been removed'});
        return response.redirect('back');
    }
    async update({ params, view }) {
        const social = await Content.find(params.id);
        return view.render('admin.social.update', { social: social });
    }
    async saveUpdate({ response , request , session , params }){
        const social = await Content.find(params.id);
        social.title = request.all().title;
        social.lead = request.all().lead;
        social.status = request.all().status;
    

        await social.save();
        session.flash({ message: 'Your user has been updated. '});
        return response.redirect('/admin/social/list');
    }
    async create({ view }){
        return view.render('admin.social.create');
    }
    async saveCreate({ request, response}){
       


        const social = await Content.create(request.only(['title','title_seo','lead','status']));
    
        return response.redirect('/admin/social/list');
    }
    async destroy({request,response}){
        const social = await  Content.query().whereIn('id',request.all().deletedId).delete()
        return response.redirect('back');
    }
}

module.exports = SocialController
