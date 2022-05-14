'use strict'

class Contact {
   get rules () {
    return {
      'name': 'required',
      'email': 'required|email',
      'title': 'required',
      'content': 'required'
    }
  }
  get messages() {
    return {
      'email.required': 'این فیلد اجباری است',
      'email.email': 'ایمیل معتبر نمیباشد',
      'name.required': 'این فیلد اجباری است',
      'title.required': 'این فیلد اجباری است',
      'content.required': 'این فیلد اجباری است'
    }
  }

  async fails(error) {
    this.ctx.session.withErrors(error)
      .flashAll();
    
    return this.ctx.response.redirect('back');
  }
  
}

module.exports = Contact
