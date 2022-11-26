import { get } from './base'
import type { AlbumsItem, SliderItem, Song } from '../types/index'

interface RecommendReturns {
  albums: AlbumsItem[],
  sliders: SliderItem[]
}

export function getRecommend() {
  return get<RecommendReturns>('/api/getRecommend')
}

export function getAlbum(album: AlbumsItem) {
  return get<{songs: Song[]}>('/api/getAlbum', {
    id: album.id
  })
}