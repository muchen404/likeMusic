import { get } from './base'
import type { TopListItem } from '@/types/index'

export function getTopList() {
  return get('api/getTopList')
}

export function getTopDetail(top: TopListItem) {
  return get('/api/getTopDetail', {
    id: top.id,
    period: top.period
  })
}