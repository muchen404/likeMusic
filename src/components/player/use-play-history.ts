import { usePlayerStore } from '@/stores/player'
import type { Song } from '../../types/index'
import { save } from '../../assets/js/array-store'
import { PLAY_KEY } from '../../assets/js/constant'


export default function usePlayHistory() {
  const maxLen = 200
  const playerStore = usePlayerStore()

  function savePlay(song: Song) {
    const songs = save(song, PLAY_KEY, (item: Song) => {
      return item.id === song.id
    }, maxLen)
    playerStore.setPlayHistory(songs)
  }

  return {
    savePlay
  }
}