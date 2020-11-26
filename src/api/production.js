import request from '@/utils/request'

// 歌列表
export function songList(query) {
  return request({
    url: '/vue-element-admin/production/song',
    method: 'get',
    params: query
  })
}
// 新增歌
export function createSong(data) {
  return request({
    url: '/vue-element-admin/production/createSong',
    method: 'post',
    data
  })
}
// 修改歌
export function updateSong(data) {
  return request({
    url: '/vue-element-admin/production/updateSong',
    method: 'post',
    data
  })
}
// 删除歌
export function deleteSong(data) {
  return request({
    url: '/vue-element-admin/production/deleteSong',
    method: 'post',
    data
  })
}
// 词列表
export function lyricList(query) {
  return request({
    url: '/vue-element-admin/production/lyric',
    method: 'get',
    params: query
  })
}
// 新增词
export function createLyric(data) {
  return request({
    url: '/vue-element-admin/production/createLyric',
    method: 'post',
    data
  })
}
// 修改词
export function updateLyric(data) {
  return request({
    url: '/vue-element-admin/production/updateLyric',
    method: 'post',
    data
  })
}
// 删除词
export function deleteLyric(data) {
  return request({
    url: '/vue-element-admin/production/deleteLyric',
    method: 'post',
    data
  })
}

// 曲列表
export function musicList(query) {
  return request({
    url: '/vue-element-admin/production/music',
    method: 'get',
    params: query
  })
}
// 新增曲
export function createMusic(data) {
  return request({
    url: '/vue-element-admin/production/createMusic',
    method: 'post',
    data
  })
}
// 修改曲
export function updateMusic(data) {
  return request({
    url: '/vue-element-admin/production/updateMusic',
    method: 'post',
    data
  })
}
// 删除曲
export function deleteMusic(data) {
  return request({
    url: '/vue-element-admin/production/deleteMusic',
    method: 'post',
    data
  })
}
