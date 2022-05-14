'use strict'
const Plan = use('App/Models/Plan')
const moment = require('jalali-moment')

class PlanController {
    async list({ request,view }){
        const plans = await Plan.query().orderBy('id', 'desc').fetch()
        return view.render('admin.plan.list',{
            plans  : plans.toJSON()
        });
    }
    async create({ view }){
        return view.render('admin.plan.create');
    }
    async store({response , request}){
        request.all().start_date = moment(request.all().start_date, 'jYYYY/jM/jD').format('YYYY-M-D')
        request.all().end_date = moment(request.all().end_date, 'jYYYY/jM/jD').format('YYYY-M-D')
        const plan = await Plan.create(request.only([
            'title',
            'status',
            'start_date',
            'end_date',
            'day',
            'price',
            'content'
        ]));
        return response.redirect('/admin/plan/list');
    }
    async delete({params,response}){
        const plan = await Plan.find(params.id);
        await plan.delete();
        return response.redirect('back');
    }
    async update({ view , params}){
        const plan = await Plan.find(params.id);
        return view.render('admin.plan.update',{
            plan  : plan
        });
    }
    async edit({ response , request , params }){
        const plan = await Plan.find(params.id);
        plan.title = request.all().title;
        plan.status = request.all().status;
        plan.day = request.all().day;
        plan.price = request.all().price;
        plan.content = request.all().content;
        plan.start_date = moment(request.all().start_date, 'jYYYY/jM/jD').format('YYYY-M-D')
        plan.end_date = moment(request.all().end_date, 'jYYYY/jM/jD').format('YYYY-M-D')
        await plan.save();
        return response.redirect('/admin/plan/list');
    }
}

module.exports = PlanController
