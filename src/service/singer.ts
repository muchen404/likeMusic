import { get } from './base'
import type { Singer, SingerFullList, Song } from '@/types/index'

export function getSingerList() {
  return get<{singers: SingerFullList}>('/api/getSingerList')
}

export function getSingerDetail(singer: Singer) {
  return get<{songs: Song[]}>('/api/getSingerDetail', {
    mid: singer.mid
  })
}