import { shuffle } from '@/assets/js/util'
import type { Song } from '@/types'
import { load } from '@/assets/js/array-store'
import { FAVORITE_KEY } from '../assets/js/constant'

export enum PlayMode {
  sequence = 0,
  loop,
  random
} 

export const usePlayerStore = defineStore('player', () => {

  // 是否正在播放
  const playing = ref(false)

  // 播放模式
  const playMode = ref(PlayMode.sequence)

  // 当前播放索引
  const currentIndex = ref(0)

  // 是否全屏播放
  const fullScreen = ref(false)

  // 顺序播放列表
  const sequenceList = ref<Song[]>([])

  // 真实播放列表
  const playList = ref<Song[]>([])

  // 收藏列表
  const favoriteList = ref<Song[]>([])

  // 当前播放的歌曲
  const currentSong = computed(() => {
    return playList.value[currentIndex.value] ?? {}
  })

  function setPlaying(state: boolean) {
    // console.log('set playing', state)
    // console.trace()
    playing.value = state
  }

  function setPlayMode(mode: PlayMode) {
    playMode.value = mode
  }

  function setCurrentIndex(index: number) {
    currentIndex.value = index
  }

  function setFullscreen (flag: boolean) {
    fullScreen.value = flag
  }

  function setSequenceList(list: Song[]) {
    sequenceList.value = list
  }

  function setPlayList(list: Song[]) {
    playList.value = list
  }

  function setFavoriteList(list: Song[]) {
    favoriteList.value = list
  }

  function addSongLyric(song: Song, lyric: string) {
    sequenceList.value.map((item) => {
      if (item.mid === song.mid) {
        item.lyric = lyric
      }
      return lyric
    })
  }

  // 设置播放
  function selectPlay({ list, index }: {list: Song[], index: number}) {
    setPlayMode(PlayMode.sequence)
    setSequenceList(list)
    setPlayList(list)
    setPlaying(true)
    setFullscreen(true)
    setCurrentIndex(index)
  }

  // 随机播放
  function randomPlay(list: Song[]) {
    setPlayMode(PlayMode.random)
    setSequenceList(list)
    setPlayList(shuffle<Song>(list))
    setPlaying(true)
    setFullscreen(true)
    setCurrentIndex(0)
  }

  function changeMode(mode: PlayMode) {
    const currentId = currentSong.value.id
    if (mode === PlayMode.random) {
      setPlayList(shuffle(sequenceList.value))
    } else {
      setPlayList(sequenceList.value)
    }
    const index = playList.value.findIndex(song => {
      return song.id === currentId
    })
    setCurrentIndex(index)
    setPlayMode(mode)
  }

  setFavoriteList(load(FAVORITE_KEY))

  return {
    sequenceList,
    playList,
    playing,
    playMode,
    currentIndex,
    currentSong,
    fullScreen,
    selectPlay,
    randomPlay,
    setFullscreen,
    changeMode,
    setPlaying,
    setCurrentIndex,
    setPlayMode,
    setSequenceList,
    setFavoriteList,
    favoriteList,
    addSongLyric
  }
})