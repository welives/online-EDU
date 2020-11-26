const Mock = require('mockjs')

const songList = []
const lyricList = []
const musicList = []
const count = 10

for (let i = 0; i < count; i++) {
  // 歌列表模拟数据
  songList.push(
    Mock.mock({
      id: '@increment',
      title: '@ctitle(5, 10)', // 作品标题
      cover: '@image("200x100")', // 作品封面
      'type|1': ['中国风', '乡村', '古典', '嘻哈', '摇滚', '流行', '爵士', '电子', '轻音乐'], // 作品类型
      desc: '@cparagraph', // 作品简介
      'suffix|1': ['mp3', 'wav', 'flac', 'aac'], // 格式
      duration: '@natural(30,500)', // 时长/秒
      free_start: '@natural(0,10)', // 试听开始时间
      free_end: '@natural(10,30)', // 试听结束时间
      'is_free|1': [0, 1], // 是否收费
      'status|1': [0, 1], // 审核状态
      link: '@url("http","pg.imdev.net")', // 资源链接
      create_time: '@now',
      update_time: '@now'
    })
  )
  // 词列表数据
  lyricList.push(
    Mock.mock({
      id: '@increment',
      title: '@ctitle(5, 10)', // 作品标题
      // 'type|1': ['中国风', '乡村', '古典', '嘻哈', '摇滚', '流行', '爵士', '电子', '轻音乐'], // 作品类型
      content: '@cparagraph', // 作品简介
      'status|1': [0, 1], // 审核状态
      create_time: '@now',
      update_time: '@now'
    })
  )
  // 曲模拟数据
  musicList.push(
    Mock.mock({
      id: '@increment',
      title: '@ctitle(5, 10)', // 作品标题
      cover: '@image("200x100")', // 作品封面
      // 'type|1': ['中国风', '乡村', '古典', '嘻哈', '摇滚', '流行', '爵士', '电子', '轻音乐'], // 作品类型
      'status|1': [0, 1], // 审核状态
      link: '@url("http","pg.imdev.net")', // 资源链接
      create_time: '@now',
      update_time: '@now'
    })
  )
}

module.exports = [
  // 歌列表
  {
    url: '/vue-element-admin/production/song',
    type: 'get',
    response: (config) => {
      console.log(config.query)
      const { title, type, page = 1, limit = 20, sort } = config.query
      let mockList = songList.filter((item) => {
        if (type && item.type !== type) return false
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
  // 新增歌
  {
    url: '/vue-element-admin/production/createSong',
    type: 'post',
    response: (_) => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  // 修改歌
  {
    url: '/vue-element-admin/production/updateSong',
    type: 'post',
    response: (_) => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  // 删除歌
  {
    url: '/vue-element-admin/production/deleteSong',
    type: 'post',
    response: (_) => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  // 词列表
  {
    url: '/vue-element-admin/production/lyric',
    type: 'get',
    response: (config) => {
      const { title, status, page = 1, limit = 20, sort } = config.query
      let mockList = lyricList.filter((item) => {
        if (status && item.status !== Number(status)) return false
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
  // 新增词
  {
    url: '/vue-element-admin/production/createLyric',
    type: 'post',
    response: (_) => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  // 修改词
  {
    url: '/vue-element-admin/production/updateLyric',
    type: 'post',
    response: (_) => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  // 删除词
  {
    url: '/vue-element-admin/production/deleteLyric',
    type: 'post',
    response: (_) => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  // 曲列表
  {
    url: '/vue-element-admin/production/music',
    type: 'get',
    response: (config) => {
      const { title, status, page = 1, limit = 20, sort } = config.query
      let mockList = musicList.filter((item) => {
        if (status && item.status !== Number(status)) return false
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
  // 新增曲
  {
    url: '/vue-element-admin/production/createMusic',
    type: 'post',
    response: (_) => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  // 修改曲
  {
    url: '/vue-element-admin/production/updateMusic',
    type: 'post',
    response: (_) => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  // 删除曲
  {
    url: '/vue-element-admin/production/deleteMusic',
    type: 'post',
    response: (_) => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
