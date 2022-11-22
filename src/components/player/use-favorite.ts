import { usePlayerStore } from '@/stores/player'
import type { Song } from '@/types/index'
import { save, remove } from '@/assets/js/array-store'
import { FAVORITE_KEY } from '@/assets/js/constant'

export default function useFavorite() {
  const playerStore = usePlayerStore()
  const favoriteList = computed(() => playerStore.favoriteList ?? [])
  const maxLen= 100

  function getFavoriteIcon (song: Song) {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  function toggleFavorite(song: Song) {
    let list: Song[]
    if (isFavorite(song)) {
      list = remove(FAVORITE_KEY, compare)
    } else {
      list = save(song, FAVORITE_KEY, compare, maxLen)
    }
    playerStore.setFavoriteList(list)

    function compare(item: Song) {
      return item.id === song.id
    }
  }

  function isFavorite(song: Song) {
    return favoriteList.value.findIndex(item => {
      return item.id === song.id
    }) > -1
  }

  return { getFavoriteIcon, toggleFavorite }
}