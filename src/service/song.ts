import { get } from './base'
import type { Song } from '@/types'

export function processSongs(songs: Song[]) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }

  return get<{map: Record<string, string>}>('/api/getSongsUrl', {
    mid: songs.map((song) => {
      return song.mid
    })
  }).then((result: any) => {
    const map = result.map
    return songs.map((song) => {
      song.url = map[song.mid]
      return song
    }).filter((song) => {
      return song.url && song.url.indexOf('vkey') > -1
    })
  })
}

const lyricMap: Record<string, string> = {}
export function getLyric(song: Song) {
  if (song.lyric) {
    return Promise.resolve(song.lyric)
  }
  const mid = song.mid
  const lyric = lyricMap[mid]
  if(lyric) {
    return Promise.resolve(lyric)
  }

  return get<{lyric: string}>('/api/getLyric', { mid })
  .then(result => {
    const lyric: string = result.lyric ?? '[00:00:00]该歌曲暂时无法获取歌词'
    lyricMap[mid] = lyric
    return lyric
  })
}