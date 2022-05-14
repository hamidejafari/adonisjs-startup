'use strict'
const ContactUs = use('App/Models/ContactUs')

class ContactUsController {
    async list({ request,view }){
        const cotnactUs = await ContactUs.query().where(function () {
            if(request.all()){
                if(request.all().status && request.all().status != 'all'){
                    this.where('status',request.all().status)
                }
                if(request.all().title){
                    this.where('title', 'LIKE', '%'+request.all().title+'%')
                }
                if(request.all().name){
                    this.where('name', 'LIKE', '%'+request.all().name+'%')
                }
                if(request.all().email){
                    this.where('email', 'LIKE', '%'+request.all().email+'%')
                }
            }
        }).orderBy('id', 'desc').fetch()
        return view.render('admin.contact-us.list',{
            contact  : cotnactUs.toJSON()
        });
    }
    async read({ response,params }){
        const cotnactUs = await ContactUs.find(params.id)
        cotnactUs.status = !cotnactUs.status 
        await cotnactUs.save()
        return response.redirect('back') 
    }
}

module.exports = ContactUsController
