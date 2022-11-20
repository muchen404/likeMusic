import { get } from './base'
import type { Song } from '@/types'

export function processSongs(songs: Song[]) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }

  return get('/api/getSongsUrl', {
    mid: songs.map((song) => {
      return song.mid
    })
  }).then((result: any) => {
    const map = result.map
    return songs.map((song) => {
      song.url = map[song.mid]
      return song
    }).filter((song) => {
      return song.url.indexOf('vkey') > -1
    })
  })
}