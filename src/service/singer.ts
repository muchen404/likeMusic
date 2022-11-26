import { get } from './base'
import type { Singer, SingerFullList } from '@/types/index'

export function getSingerList() {
  return get<{singers: SingerFullList}>('/api/getSingerList')
}

export function getSingerDetail(singer: Singer) {
  return get('/api/getSingerDetail', {
    mid: singer.mid
  })
}