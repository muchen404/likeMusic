import { get } from './base'
import type { TopListItem, Song } from '@/types/index'

export function getTopList() {
  return get('api/getTopList')
}

export function getTopDetail(top: TopListItem) {
  return get<{songs: Song[]}>('/api/getTopDetail', {
    id: top.id,
    period: top.period
  })
}