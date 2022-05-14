const url = require('url')
const { BasePresenter } = require('edge.js')
class PaginationPresenter extends BasePresenter {

  isFirst(pagination) {
    return pagination.page == 1
  }

  isCurrent(pagination, page) {
    return pagination.page == page
  }

  isLast(pagination) {
    return pagination.page == pagination.lastPage
  }

  append(current_url, key, value) {
    const current = url.parse(current_url)
    const params = new URLSearchParams(current.search)

    params.set(key, value)

    return params.toString()
  }
}

module.exports = PaginationPresenter
