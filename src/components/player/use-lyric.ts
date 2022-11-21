import { usePlayerStore } from '../../stores/player'
import { getLyric } from '../../service/song'
import Lyric from 'lyric-parser'


export default function useLyric() {
  const store = usePlayerStore()
  const currentLyric = ref<InstanceType<typeof Lyric> | null>(null)
  const currentSong = computed(() => (store.currentSong))

  watch(currentSong, async (newSong) => {
    if(!newSong.url || !newSong.id) {
      return
    }

    const lyric = await getLyric(newSong)
    store.addSongLyric(newSong, lyric)
    if(currentSong.value.lyric !== lyric) {
      return
    }

    currentLyric.value = new Lyric(lyric, handleLyric)
  })

  function handleLyric() {

  }

  return { currentLyric }
}