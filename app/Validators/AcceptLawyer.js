'use strict'

class AcceptLawyer {
   get rules () {
    return {
      'name': 'required',
      'mobile': 'required',
      'email': 'required|email',
      'phone': 'required',
      'title': 'required',
      'value': 'required',
      'state_id': 'required',
      'city_id': 'required',
      'description': 'required'
    }
  }
  get messages() {
    return {
      'email.required': 'این فیلد اجباری است',
      'email.email': 'ایمیل معتبر نمیباشد',
      'name.required': 'این فیلد اجباری است',
      'mobile.required': 'این فیلد اجباری است',
      'phone.required': 'این فیلد اجباری است',
      'title.required':  'این فیلد اجباری است',
      'state_id.required':  'این فیلد اجباری است',
      'city_id.required':  'این فیلد اجباری است',
      'value.required':  'این فیلد اجباری است',
      'description.required':  'این فیلد اجباری است',
    }
  }

  async fails(error) {
    this.ctx.session.withErrors(error)
      .flashAll();
    
    return this.ctx.response.redirect('back');
  }
  
}

module.exports = AcceptLawyer
