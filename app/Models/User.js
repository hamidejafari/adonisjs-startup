'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require('jalali-moment')
const numeral = require('numeral')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
    this.addTrait('@provider:Lucid/SoftDeletes')
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  
  expertises () {
    return this
    .belongsToMany('App/Models/Expertise')
    .pivotTable('expertise_user')
  }
  
  
  rates () {
    return this.hasMany('App/Models/Rate','id','approved_admin_id')
  }
  tokens () {
    return this.hasMany('App/Models/Token')
  }
  files () {
    return this.hasMany('App/Models/File','id','user_id')
  }
  departments () {
    return this.hasMany('App/Models/Department')
  }
  departments () {
      return this.belongsToMany('App/Models/Department')
      .pivotModel('App/Models/DepartmentUser')
  }
  getCreatedAt(date){
    return moment.unix(date).locale('fa').format('YYYY/MM/DD HH:mm');
  }
  getRate(rate){
    return Math.floor(rate)
  }
  getWallet(price){
    return numeral(price).format('0,0');
  }
  getIncome(price){
    return numeral(price).format('0,0');
  }
  static scopeLawyer(query) {
    return query.where('user_type_id',3)
  }
  static scopeAdviser(query) {
    return query.where('user_type_id','>=',2)
  }

  setUpdatedAt() {
    return moment().unix()
  }
  setCreatedAt() {
    return moment().unix()
  }
  setDeletedAt() {
    return moment().unix()
  }

}

module.exports = User
