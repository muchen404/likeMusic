import { get } from './base'
import type { Singer } from '@/types/index'

export function getSingerList() {
  return get('/api/getSingerList')
}

export function getSingerDetail(singer: Singer) {
  return get('/api/getSingerDetail', {
    mid: singer.mid
  })
}