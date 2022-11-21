import { shuffle } from '@/assets/js/util'
import type { Song } from '@/types'

enum PlayMode {
  sequence = 0,
  loop,
  random
} 

export const usePlayerStore = defineStore('player', () => {
  // 顺序播放列表
  const sequenceList = ref<Song[]>([])

  // 真实播放列表
  const playList = ref<Song[]>([])

  // 是否正在播放
  const playing = ref(false)

  // 播放模式
  const playMode = ref(PlayMode.sequence)

  // 当前播放索引
  const currentIndex = ref(0)

  // 是否全屏播放
  const fullScreen = ref(false)

  // 当前播放的歌曲
  const currentSong = computed(() => {
    return playList.value[currentIndex.value]
  })

  // 设置播放
  function selectPlay({ list, index }: {list: Song[], index: number}) {
    playMode.value = PlayMode.sequence
    sequenceList.value = list
    playList.value = list
    playing.value = true
    fullScreen.value = true
    currentIndex.value = index
  }

  // 随机播放
  function randomPlay(list: Song[]) {
    playMode.value = PlayMode.random
    sequenceList.value = list
    playList.value = shuffle<Song>(list)
    playing.value = true
    fullScreen.value = true
    currentIndex.value = 0
  }

  return {
    sequenceList,
    playList,
    playing,
    playMode,
    currentIndex,
    currentSong,
    fullScreen,
    selectPlay,
    randomPlay
  }
})