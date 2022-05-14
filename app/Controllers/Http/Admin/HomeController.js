'use strict'
const User = use('App/Models/User')
const xlsx = require('node-xlsx')
const Helpers = use('Helpers')
const QuestionCategory = use('App/Models/QuestionCategory')
const Question = use('App/Models/Question')
const Transaction = use('App/Models/Transaction')
const Order = use('App/Models/Order')
const ContactUs = use('App/Models/ContactUs')
const Ticket = use('App/Models/Ticket')
const Record = use('App/Models/Record')
const moment = require('jalali-moment')

class HomeController {
    async analytics({ view }) {
        return view.render('admin.analytics');
    }
    async resualtAnalytics({ view , request }) {
        let fromDateJalali = request.all().year + '/' + request.all().month +  '/' + request.all().day 
        let untilDateJalali = request.all().year2 + '/' + request.all().month2 +  '/' + request.all().day2
        let fromDate = moment(fromDateJalali, 'jYYYY/jM/jD/').format('MM/DD/YYYY HH:mm')
        let untilDate = moment(untilDateJalali, 'jYYYY/jM/jD/').format('MM/DD/YYYY HH:mm')
		let fromDateAdd1 = moment(fromDate).add('days', 1);
		let untilDateAdd1 = moment(untilDate).add('days', 1);
        let finalFromDate =  moment(fromDateAdd1).unix()
		let finalUntilDate =  moment(untilDateAdd1).unix()
        const users = await User.query().where('user_type_id',1).whereBetween('created_at',[finalFromDate,finalUntilDate]).count()
        const advisers = await User.query().whereNot('user_type_id',1).whereBetween('created_at',[finalFromDate,finalUntilDate]).count()
        const installs = await User.query().whereNotNull('firebase_token').whereBetween('created_at',[finalFromDate,finalUntilDate]).count()
        return view.render('admin.analytics-resualt',{
            users  : users[0]['count(*)'],
            advisers  : advisers[0]['count(*)'],
            installs  : installs[0]['count(*)']
        });
    }



    async dashboard({ view }){
        const bestAdviser = await User.query().whereNot('rate',0).with('expertises').orderBy('rate', 'desc').limit(10).fetch()
        const users = await User.query().count()
        const questionCategory = await QuestionCategory.query().count()
        const question = await Question.query().count()
        const transaction = await Transaction.query().count()
        const orders = await Order.query().count()
        const contactus = await ContactUs.query().count()
        const ticket = await Ticket.query().count()
        const record = await Record.query().count()
        const tickets = await Ticket.query().where('status',0).with('user').fetch()
        return view.render('admin.dashboard',{
            users  : users[0]['count(*)'],
            questionCategory  : questionCategory[0]['count(*)'],
            question  : question[0]['count(*)'],
            transaction  : transaction[0]['count(*)'],
            orders  : orders[0]['count(*)'],
            contactus  : contactus[0]['count(*)'],
            ticket  : ticket[0]['count(*)'],
            record  : record[0]['count(*)'],
            tickets : tickets.toJSON(),
            bestAdviser : bestAdviser.toJSON()
        });
    }

}

module.exports = HomeController
