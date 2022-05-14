'use strict'
const Accept = use('App/Models/Accept')

class AcceptController {
    async list({ request,view }){
        const page = request.get().page || 1;
        const accept = await Accept.query().where(function () {
            if(request.all()){
                if(request.all().status && request.all().status != 'all'){
                    this.where('status',request.all().status)
                }
                if(request.all().accept_type_id && request.all().accept_type_id != 'all'){
                    this.where('accept_type_id',request.all().accept_type_id)
                }
                if(request.all().title){
                    this.where('title', 'LIKE', '%'+request.all().title+'%')
                }
                if(request.all().phone){
                    this.where('phone', 'LIKE', '%'+request.all().phone+'%')
                }
                if(request.all().mobile){
                    this.where('mobile', 'LIKE', '%'+request.all().mobile+'%')
                }
                if(request.all().name){
                    this.where('name', 'LIKE', '%'+request.all().name+'%')
                }
                if(request.all().email){
                    this.where('email', 'LIKE', '%'+request.all().email+'%')
                }
            }
        }).orderBy('id', 'desc').paginate(page,15)
        return view.render('admin.accept.list',{
            accept  : accept.toJSON()
        });
    }
    async read({ response,params }){
        const accept = await Accept.find(params.id)
        accept.status = !accept.status 
        await accept.save()
        return response.redirect('back') 
    }
}

module.exports = AcceptController
