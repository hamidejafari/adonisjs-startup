'use strict'
const Record = use('App/Models/Record')
const RecordType = use('App/Models/RecordType')
const File = use('App/Models/File')

class RecordController {
    async list({ request,view }){
        const page = request.get().page || 1;
        const recordType = await RecordType.query().orderBy('id', 'ASC').fetch()
        const files = await File.query().where(function () {
            if(request.all()){
                if(request.all().type && request.all().type != 'all'){
                    this.where('record_type_id',request.all().type)
                }
            }
        }).with('recordType').where('title','doc').with('user').orderBy('id', 'DESC').paginate(page,15);
        return view.render('admin.record.list',{
            records  : files.toJSON(),
            recordType  : recordType.toJSON(),
        });
    }
    async status({ response,params }){
        const record = await Record.find(params.id)
        record.status = !record.status
        await record.save()
        return response.redirect('back')
    }
    async destroy({request,response}){
        const record = await Record.query().whereIn('id',request.all().deletedId).delete()
        return response.redirect('back');
    }
}

module.exports = RecordController
