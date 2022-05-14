'use strict'
const User = use('App/Models/User')
const Logger = use('Logger')
const moment = require('jalali-moment')
const File = use('App/Models/File')
const RecordType = use('App/Models/RecordType')
const Expertise = use('App/Models/Expertise')
const State = use('App/Models/State')
const City = use('App/Models/City')
const Event = use('App/Models/Event')
var _ = require('lodash');
class AdviserController {
    async list({ view , request}){
        const page = request.get().page || 1;
        //User ids for record Types
        let userIds = null
        let sortBy = 'id'

        if(request.all().record_type_id){
            userIds = await File.query().where('record_type_id',request.all().record_type_id).pluck('user_id')
        }
        if(request.all().sort_by){
            sortBy = request.all().sort_by
        }
        //
        const users = await User.query().where(function (){
            if(request.all()){
                if(request.all().user_id){
                    this.where('user_id',request.all().user_id)
                }     
                if(request.all().city_id){
                    this.where('city_id',request.all().city_id)
                }     
                if(request.all().gender){
                    this.where('gender',request.all().gender)
                }
                if(request.all().expertise_id){
                    this.where('expertise_id',request.all().expertise_id)
                }
                if(request.all().allow_work){
                    this.where('allow_work',request.all().allow_work)
                }     
                if(request.all().name){
                    this.where('name', 'LIKE', '%'+request.all().name+'%')
                }     
                if(request.all().family){
                    this.where('family', 'LIKE', '%'+request.all().family+'%')
                }  
                if(request.all().mobile){
                    this.where('mobile', 'LIKE', '%'+request.all().mobile+'%')
                }
                if(request.all().email){
                    this.where('email', 'LIKE', '%'+request.all().email+'%')
                }
                if(request.all().record_type_id){
                    this.whereIn('id',userIds)
                }
            }
        }).where('user_type_id','<>',1).orderBy(sortBy,'DESC').with('expertises').paginate(page,15)
        //FilterOptions
        const recordTypes  = await RecordType.all()
        const states  = await State.all()
        const jobs  = await Expertise.query().where('type',0).fetch()
        const expertises  = await Expertise.query().where('type',1).fetch()
        return view.render('admin.adviser.list',{
            users  : users.toJSON(),
            states  : states.toJSON(),
            jobs : jobs.toJSON(),
            expertises : expertises.toJSON(),
            recordTypes : recordTypes.toJSON()
        });
    }
    async clickState({request}){
        let cities = await City.query().where('state_code',request.all().stateCode).fetch()
        return cities
    }
    async files({ view , request , params}){
        const files = await File.query().where('title','doc').where('user_id',params.id).with('recordType').orderBy('id','DESC').fetch();
        return view.render('admin.adviser.files',{
            files  : files.toJSON()
        });
    }
    async expertises({ view , request , params}){
        const user = await User.query().where('id',params.id).with('expertises').first()
        let x = user.toJSON()
        let f = x.expertises;
        const expertise = await Expertise.query().where('type',0).orderBy('id', 'desc').fetch();
        return view.render('admin.adviser.expertises',{
            expertises  : f,
            user  : x,
            expertise :  expertise.toJSON(),
        });
    }
    async deleteExpertise({ response, params}){
        const user = await User.query().where('id',params.userId).with('expertises').first()
        await user.expertises().detach([params.expertiseId])
        return response.redirect('back');
    }
    async addExpertise({ response, request}){
        const user = await User.query().where('id',request.all().userId).first()
        await user.expertises().attach([request.all().expertiseId])
        return response.redirect('back');
    }
    async changeFileAprove({ response , params , auth}){
        const file = await File.find(params.id);
        const recordType = await RecordType.find(file.record_type_id)
        // const file = await File.query().where('id',params.id).with('recordType').fetch();
        if(file.approve_date != null){
            file.approve_date = null
            file.admin_id = file.user_id
        }else{
            file.approve_date = moment().unix()
            file.admin_id = auth.user.id
        }
        await file.save();
        if(file.approve_date == null && recordType.force == 1){
            const user = await User.find(file.user_id);
            user.allow_work = 0;
            await user.save();
        }
        return response.redirect('back');
    }
    async vip({ response, session, params}) {
        const user = await User.find(params.id);
        user.vip = !user.vip;
        await user.save();
        return response.redirect('back');
    }
    async map({ response, session, params}) {
        const user = await User.find(params.id);
        user.map_show = !user.map_show;
        await user.save();
        return response.redirect('back');
    }
    async status({ response, session, params}) {
        const user = await User.find(params.id);
        user.status = !user.status;
        user.allow_work = !user.allow_work;
        await user.save();
        return response.redirect('back');
    }
    async allowWork({ response, session, params}) {
        const user = await User.find(params.id);
        user.allow_work = !user.allow_work;
        await user.save();
        return response.redirect('back');
    }
    async confirmImage({ response, session, params}) {
        const user = await User.find(params.id);
        user.confirm_image = !user.confirm_image;
        await user.save();
        return response.redirect('back');
    }
   
    async update({ params, view }) {
        const user = await User.find(params.id);
        return view.render('admin.adviser.update', { user: user });
    }
    async postUpdate({ response , request , session , params , auth }){
        const user = await User.find(params.id);
        // return request.all();
        if(request.all().password != null){
            user.password = request.all().password;
        }
       
        
        user.name = request.all().name;
        user.family = request.all().family;
        user.allow_work = request.all().allow_work;
        user.email = request.all().email;
        user.mobile = request.all().mobile;
        await user.save();

        return response.redirect('/admin/adviser/list');
    }
    async create({ view }){
        return view.render('admin.adviser.create');
    }
    async postCreate({ request, response}){
        request.all().user_type_id = 2;
        const user = await User.create(request.only(['name','family','mobile','status','password','user_type_id']));
        return response.redirect('/admin/adviser/list');
    }

    async destroy({request,response}){
        await  User.query().whereIn('id',request.all().deletedId).delete()
        return response.redirect('back');
    }

}

module.exports = AdviserController

