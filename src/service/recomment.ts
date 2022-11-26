import { get } from './base'
import type { AlbumsItem } from '../types/index'

export function getRecommend() {
  return get('/api/getRecommend')
}

export function getAlbum(album: AlbumsItem) {
  return get('/api/getAlbum', {
    id: album.id
  })
}