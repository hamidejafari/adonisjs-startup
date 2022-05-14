'use strict'

const RecordType = use('App/Models/RecordType')
const moment = require('jalali-moment')

class RecordTypeController {
    async list({ request,view }){
        const recordTypes = await RecordType.query().orderBy('id', 'desc').fetch();
        return view.render('admin.record-type.list',{
            recordTypes  : recordTypes.toJSON()
        });
    }
    async create({ view }){
        return view.render('admin.record-type.create');
    }
    async store({response , request}){
        if(request.all().force == 'on'){
            request.all().force = 1;
        }else{
            request.all().force = 0;
        }

   
        await RecordType.create(request.only([
            'title',
            'force'
        ]));
        return response.redirect('/admin/record-type/list');
    }
    async update({ view , params}){
        const recordType = await RecordType.find(params.id);
        return view.render('admin.record-type.update',{
            recordType  : recordType
        });
    }
    async edit({ response , request , params }){
        const recordType = await RecordType.find(params.id);
        if(request.all().force == 'on'){
            request.all().force = 1;
        }else{
            request.all().force = 0;
        }
        recordType.title = request.all().title;
        recordType.force = request.all().force;
        await recordType.save();
        return response.redirect('/admin/record-type/list');
    }
    async destroy({request,response}){
        await  RecordType.query().whereIn('id',request.all().deletedId).delete()
        return response.redirect('back');
    }
}

module.exports = RecordTypeController
