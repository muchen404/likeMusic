import { usePlayerStore } from '../../stores/player'
import { getLyric } from '../../service/song'
import Lyric from 'lyric-parser'
import type { Ref } from 'vue'
import type BScroll from '@better-scroll/core'
import type ScrollType from '@/components/base/scroll/scroll.vue'


type MyScrollType = InstanceType<typeof ScrollType>
export default function useLyric({ songReady, currentTime }: { songReady: Ref<boolean>, currentTime: Ref<number> }) {
  const currentLyric = ref<InstanceType<typeof Lyric> | null>(null)
  const currentLineNum = ref(0)
  const pureMusicLyric = ref('')
  const playingLyric = ref('')
  const lyricScrollRef = ref<MyScrollType | null>(null)
  const lyricListRef = ref<HTMLElement | null>(null)
  
  const store = usePlayerStore()
  const currentSong = computed(() => (store.currentSong))

  watch(currentSong, async (newSong) => {
    if(!newSong.url || !newSong.id) {
      return
    }
    stopLyric()
    currentLyric.value = null
    currentLineNum.value = 0
    pureMusicLyric.value = ''
    playingLyric.value = ''

    const lyric = await getLyric(newSong)
    store.addSongLyric(newSong, lyric)
    if(currentSong.value.lyric !== lyric) {
      return
    }

    currentLyric.value = new Lyric(lyric, handleLyric)
    const hasLyric = currentLyric.value.lines.length
    if (hasLyric) {
      if (songReady.value) {
        playLyric()
      }
    } else {
      playingLyric.value = pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})]/g, '')
    }
    
  })

  function playLyric() {
    const currentLyricVal = currentLyric.value
    if(currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }

  function stopLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }

  function handleLyric({lineNum, txt} : { lineNum: number, txt: string }) {
    currentLineNum.value = lineNum
    playingLyric.value = txt
    const scrollComp = lyricScrollRef.value
    const listEL = lyricListRef.value
    if (!listEL) {
      return
    }
    if (lineNum > 5 ) {
      const lineEl = listEL.children[lineNum - 5]
      scrollComp?.scroll?.scrollToElement(lineEl as HTMLElement, 1000, 0, 0)
    } else {
      scrollComp?.scroll?.scrollTo(0, 0, 1000)
    }
  }

  return { 
    currentLyric, 
    currentLineNum, 
    pureMusicLyric,
    playingLyric,
    lyricScrollRef: (lyricScrollRef as Ref<MyScrollType | null>),
    lyricListRef,
    playLyric,
    stopLyric
  }
}