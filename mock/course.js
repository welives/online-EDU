const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: '@increment',
      title: '@ctitle(5, 10)',
      cover: '@image("200x100")',
      subCount: '@integer(0,100)',
      'price|1': [5, 10, 30, 50, 88, 100],
      'status|1': [0, 1],
      try: '@cparagraph',
      content: '@cparagraph',
      create_time: '@now',
      update_time: '@now'
    })
  )
}

module.exports = [
  {
    url: '/vue-element-admin/course/list',
    type: 'get',
    response: (config) => {
      const { title, page = 1, limit = 20, sort } = config.query
      let mockList = List.filter((item) => {
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/vue-element-admin/course/create',
    type: 'post',
    response: (_) => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/course/update',
    type: 'post',
    response: (_) => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/course/delete',
    type: 'post',
    response: (_) => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
