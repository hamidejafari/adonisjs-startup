'use strict'
const OffCode = use('App/Models/OffCode')
const moment = require('jalali-moment')

class OffCodeController {
    async list({ view  , request}) {
        const offCodes = await OffCode.query().where(function () {
            if(request.all()){
                if(request.all().title){
                    this.where('title', 'LIKE', '%'+request.all().title+'%')
                }
            }
        }).orderBy('id', 'desc').fetch()
        return view.render('admin.off-code.list',{
            offCodes: offCodes.toJSON()
        });
    }
    async create({ view }){
        return view.render('admin.off-code.create');
    }
    async store({ request , response }){
        request.all().start = moment(request.all().start, 'jYYYY/jM/jD').format('YYYY-M-D')
        request.all().end = moment(request.all().end, 'jYYYY/jM/jD').format('YYYY-M-D')
        request.all().code = Math.floor(Math.random() * Math.floor(1000000000000))
        const offCode = await OffCode.create(request.only([
            'start',
            'end',
            'code',
            'status',
            'title',
            'percent',
            'price'
        ]));
        return response.redirect('/admin/off-code/list');
    }
    async update({ params,view }){
        const offCode = await OffCode.find(params.id);
    
        return view.render('admin.off-code.update',{
            offCode: offCode
        });
    }
    async edit({ request , response }){
        const offCode = await OffCode.find(request.all().off_id);
        if(request.all().title){
            offCode.title = request.all().title
        }
        if(request.all().start){
            offCode.start = moment(request.all().start, 'jYYYY/jM/jD').format('YYYY-M-D')
        }
        if(request.all().end){
            offCode.end = moment(request.all().end, 'jYYYY/jM/jD').format('YYYY-M-D')
        }
        if(request.all().status){
            offCode.status = request.all().status
        }
        if(request.all().percent){
            offCode.percent = request.all().percent
        }
        if(request.all().price){
            offCode.price = request.all().price
        }
        await offCode.save();
        return response.redirect('/admin/off-code/list');
    }
    async delete({ response,  params}) {
        const offCode = await OffCode.find(params.id);
        await offCode.delete();
        return response.redirect('back');
    }
}

module.exports = OffCodeController
