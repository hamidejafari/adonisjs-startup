'use strict'

class UserUpdate {
  get rules () {
    return {
      // 'email': 'unique',
      // 'mobile': 'unique'
    }
  }
  
  get messages() {
    return {
      'unique': '{{ field }} تکراری است.'
    }
  }

  async fails(error) {
    this.ctx.session.withErrors(error)
      .flashAll();
    
    return this.ctx.response.redirect('back');
  }
}

module.exports = UserUpdate
