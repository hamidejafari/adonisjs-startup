'use strict'

const Tag = use('App/Models/Tag')

class TagController {
    async list({request ,session}){
        session.put('search',null)
        const tags = await Tag
        .query()
        .orderBy('id', 'desc')
        .fetch();
        return  tags;
    }
    async destroy({request,response}){
        const tags = await  Tag.query().whereIn('id',request.all().deletedId).delete()
        return response.redirect('back');
    }
    async search({ request  , session}){
        session.put('search',request.all().title)
        
        const tags = await Tag
        .query()
        
        .where('title', 'LIKE', '%'+request.all().title+'%')
        .orderBy('id', 'desc')
        .fetch();
        return  tags;
    }
    async change({ request , session}){
        const tag = await Tag.find(request.all().tag_id);
        tag.title = request.all().title;
        await tag.save();
        const tags = await Tag
        .query()
        .orderBy('id', 'desc')
        .fetch();
        if(session.get('search') == null){
            const tags = await Tag
            .query()
            .orderBy('id', 'desc')
            .fetch();
            return  tags;
        }else{
            const tags = await Tag
            .query()
            .where('title', 'LIKE', '%'+session.get('search')+'%')
            .orderBy('id', 'desc')
            .fetch();
            return  tags;
        }
    }
    async create({ request , session }){
        const tag = await Tag.create(request.only(['title']));
        if(session.get('search') == null){
            const tags = await Tag
            .query()
            .orderBy('id', 'desc')
            .fetch();
            return  tags;
        }else{
            const tags = await Tag
            .query()
            .where('title', 'LIKE', '%'+session.get('search')+'%')
            .orderBy('id', 'desc')
            .fetch();
            return  tags;
        }
    }
    async delete({ request  , session}){
        const tag = await Tag.find(request.all().tag_id);
        await tag.delete();
        if(session.get('search') == null){
            const tags = await Tag
            .query()
            .orderBy('id', 'desc')
            .fetch();
            return  tags;
        }else{
            const tags = await Tag
            .query()
            .where('title', 'LIKE', '%'+session.get('search')+'%')
            .orderBy('id', 'desc')
            .fetch();
            return  tags;
        }
    }
    async viewShow({ view }){
        return view.render('admin.tags.list');
    }
}

module.exports = TagController
