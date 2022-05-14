'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Ticket = use('App/Models/Ticket')
const ContactUs = use('App/Models/ContactUs')
const Accept = use('App/Models/Accept')

class Share {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request,view ,auth }, next) {
    const ticket = await Ticket.query().where('status',0).count()
    const contactUs = await ContactUs.query().where('status',0).count()
    const accept = await Accept.query().where('status',0).count()
    const authUser = await auth.getUser()
    view.share({
      ticketCount: ticket[0]['count(*)'],
      contactUsCount: contactUs[0]['count(*)'],
      acceptCount: accept[0]['count(*)'],
      authUser: authUser,
    })
    await next()
  }
}

module.exports = Share
