'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class DepartmentUser extends Model {
    static get table () {
        return 'department_user'
    }
    static get createdAtColumn () {
        return null
    }
    static get updatedAtColumn () {
        return null
    }
  
}

module.exports = DepartmentUser
