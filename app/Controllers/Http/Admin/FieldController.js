'use strict'
const Field = use('App/Models/Field')

class FieldController {
     async list({request ,session}){
        session.put('searchTitle',null)
        const fields = await Field
        .query()
        .orderBy('id', 'desc')
        .fetch();
        return  fields;
    }
    async destroy({request,response}){
        const fields = await  Field.query().whereIn('id',request.all().deletedId).delete()
        return response.redirect('back');
    }
    async search({ request  , session}){
        session.put('searchTitle',request.all().title)
        session.put('searchName',request.all().name)

        const fields = await Field
        .query()
        .where('title', 'LIKE', '%'+request.all().title+'%')
        .where('name', 'LIKE', '%'+request.all().name+'%')
        .orderBy('id', 'desc')
        .fetch();
        return  fields;
    }
    async change({ request , session}){
        const field = await Field.find(request.all().field_id);
        field.title = request.all().title;
        field.name = request.all().name;

        await field.save();
        if(session.get('searchTitle') == null){
            const fields = await Field
            .query()
            .orderBy('id', 'desc')
            .fetch();
            return  fields;
        }else{
            const fields = await Field
            .query()
            .where('title', 'LIKE', '%'+session.get('searchTitle')+'%')
            .where('name', 'LIKE', '%'+session.get('searchName')+'%')
            .orderBy('id', 'desc')
            .fetch();
            return  fields;
        }
    }
    async create({ request , session }){
        const field = await Field.create(request.only(['title','name']));
        if(session.get('searchTitle') == null){
            const fields = await Field
            .query()
            .orderBy('id', 'desc')
            .fetch();
            return  fields;
        }else{
            const fields = await Field
            .query()
            .where('title', 'LIKE', '%'+session.get('searchTitle')+'%')
            .where('name', 'LIKE', '%'+session.get('searchName')+'%')
            .orderBy('id', 'desc')
            .fetch();
            return  fields;
        }
    }
    async delete({ request  , session}){
        const field = await Field.find(request.all().field_id);
        await field.delete();
        if(session.get('searchTitle') == null){
            const fields = await Field
            .query()
            .orderBy('id', 'desc')
            .fetch();
            return  fields;
        }else{
            const fields = await Field
            .query()
            .where('title', 'LIKE', '%'+session.get('searchTitle')+'%')
            .where('name', 'LIKE', '%'+session.get('searchName')+'%')
            .orderBy('id', 'desc')
            .fetch();
            return  fields;
        }
    }
    async viewShow({ view }){
        return view.render('admin.fields.list');
    }
}

module.exports = FieldController
