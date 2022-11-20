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

  function setPlayingState(playState: boolean) {
    playing.value = playState
  }

  function setSequenceList(list: []) {
    sequenceList.value = list
  }

  function setPlayList(list: []) {
    playList.value = list
  }

  function setPlayMode(mode: PlayMode) {
    playMode.value = mode
  }

  function setCurrentIndex(index: number) {
    currentIndex.value = index
  }

  function setFullScreen(flag: boolean) {
    fullScreen.value = flag
  }

  // 设置播放
  function selectPlay({ list, index }: {list: Song[], index: number}) {
    setPlayMode(PlayMode.sequence)
    setSequenceList(list)
    setPlayingState(true)
    setFullScreen(true)
    setPlayList(list)
    setCurrentIndex(index)
  }

  return {
    sequenceList,
    setSequenceList,
    playList,
    setPlayList,
    playing,
    setPlayingState,
    playMode,
    setPlayMode,
    currentIndex,
    setCurrentIndex,
    currentSong,
    fullScreen,
    setFullScreen,
    selectPlay
  }
})