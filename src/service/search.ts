import { get } from './base'
import type { HotKey, Song, Singer } from '@/types'

interface SearchReturns {
  songs: Song[],
  singer: Singer,
  hasMore: boolean
}

export function getHotKeys() {
  return get<{hotKeys: HotKey[]}>('/api/getHotKeys')
}

export function search(query: string, page: number, showSinger: boolean) {
  return get<SearchReturns>('/api/search', {
    query,
    page,
    showSinger
  })
}