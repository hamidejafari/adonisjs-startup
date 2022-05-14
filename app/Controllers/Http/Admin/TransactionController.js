'use strict'
const Transaction = use('App/Models/Transaction')

class TransactionController {
    async list({ view  , request}) {
        const page = request.get().page || 1;
        const transactions = await Transaction.query().where(function () {
            if(request.all()){
                if(request.all().user_id){
                    this.where('user_id',request.all().user_id)
                }     
                if(request.all().order_id){
                    this.where('order_id',request.all().order_id)
                }     
                if(request.all().tracking_code){
                    this.where('tracking_code',request.all().tracking_code)
                }
                if(request.all().price){
                    this.where('price',request.all().price)
                }       
                if(request.all().status && request.all().status != "all"){
                    this.where('status',request.all().status)
                }               
            }
        }).with('user').with('order').orderBy('id', 'desc').paginate(page,15)
        
        return view.render('admin.transaction.list',{
            transactions: transactions.toJSON()
        });
    }
}

module.exports = TransactionController
