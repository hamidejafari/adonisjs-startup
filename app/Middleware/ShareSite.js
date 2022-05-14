'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Setting = use('App/Models/Setting')
const Content = use('App/Models/Content')

class ShareSite {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request,view }, next) {
    const setting = await Setting.query().first()
    const socials = await Content.query().social().fetch()
    view.share({
      setting: setting,
      socials: socials.toJSON(),
    })
    await next()
  }
}

module.exports = ShareSite
