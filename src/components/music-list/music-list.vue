
<script setup lang="ts">
import type { Song, BSPosition } from '@/types'
import { usePlayerStore } from '@/stores/player'
import WrapScroll from '../WrapScroll'

const props = withDefaults(defineProps<{
  songs: Song[],
  title: string,
  pic: string,
  loading?: boolean,
  noResultText?: string,
  rank?: boolean
}>(), {
  songs: () => ([]),
  pic: '',
  loading: false,
  noResultText: '抱歉，没有找到可播放的歌曲'
})

const playerStore = usePlayerStore()

const router = useRouter()
const bgImgRef = ref<HTMLElement | null>(null)
const imageHeight = ref<number>(0)

const scrollStyle = computed(() => {
  const bottom = playerStore.playList.length ? '60px' : '0'
  return {
    top: `${imageHeight.value}px`,
    bottom
  }
})

function goBack() {
  router.back()
}

const RESERVED_HEIGHT = 40
const maxTranslateY = ref<number>(0)
const scrollY = ref<number>(0)
function onScroll (pos: BSPosition) {
  scrollY.value = -pos.y
  // console.log(-pos.y)
}

const bgImageStyle = computed(() => {
  let zIndex = 0
  let paddingTop = 70
  let height = 0
  let translateZ = 0
  const scrollYVal = scrollY.value

  if (scrollYVal > maxTranslateY.value) {
    zIndex = 10
    paddingTop = 0
    height = RESERVED_HEIGHT
    translateZ = 1
  }

  let scale = 1
  if (scrollYVal < 0) {
    scale = 1 + Math.abs(scrollYVal / imageHeight.value)
  }

  return {
    backgroundImage: `url(${props.pic})`,
    zIndex,
    paddingTop: `${paddingTop}%`,
    height: `${height}px`,
    transform: `scale(${scale})translateZ(${translateZ}px)`
  }
})

const filterStyle = computed(() => {
  let blur = 0

  const imageHeightVal = imageHeight.value
  
  if (scrollY.value >= 0) {
    blur = Math.min(maxTranslateY.value / imageHeightVal, scrollY.value / imageHeightVal) * 20
  }
  return {
    backdropFilter: `blur(${blur}px)`
  }
})

const playBtnStyle = computed(() => {
  let display = ''
  if (scrollY.value >= maxTranslateY.value) {
    display = 'none'
  }
  return { display }
})

const noResult = computed(() => {
  return !props.loading && !props.songs.length
})


function selectItem({ songs, index }: {songs: Song[], index: number}) {
  // console.log('selectItem', songs, props.songs[index])
  playerStore.selectPlay({list: props.songs, index})
}

function random() {
  playerStore.randomPlay(props.songs)
}

onMounted(() => {
  imageHeight.value = bgImgRef.value?.clientHeight ?? 0
  maxTranslateY.value = imageHeight.value - RESERVED_HEIGHT
})

</script>

<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back" />
    </div>
    <h1 class="title">
      {{ title }}
    </h1>
    <div ref="bgImgRef" class="bg-image" :style="bgImageStyle">
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div v-show="songs.length > 0" class="play-btn" @click="random">
          <i class="icon-play" />
          <div class="text">
            随机播放全部
          </div>
        </div>
      </div>
      <div class="filter" :style="filterStyle" />
    </div>
    <WrapScroll
      v-loading="loading"
      v-no-result:[noResultText]="noResult"
      class="list" 
      :style="scrollStyle"
      :click="true"
      :probe-type="3"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <song-list :rank="rank" :songs="songs" @select="selectItem" />
      </div>
    </WrapScroll>
  </div>
</template>

<style lang="scss" scoped>
  .music-list {
    position: relative;
    height: 100%;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 20;
      transform: translateZ(2px);
      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .title {
      position: absolute;
      top: 0;
      left: 10%;
      width: 80%;
      z-index: 20;
      transform: translateZ(2px);
      @include no-wrap();
      text-align: center;
      line-height: 40px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .bg-image {
      position: relative;
      width: 100%;
      transform-origin: top;
      background-size: cover;
      padding-top: 80%;
      height: 0;
      .play-btn-wrapper {
        position: absolute;
        bottom: 20px;
        z-index: 10;
        width: 100%;
        .play-btn {
          box-sizing: border-box;
          width: 135px;
          padding: 7px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid $color-theme;
          color: $color-theme;
          border-radius: 100px;
          font-size: 0;
        }
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
      .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4);
      }
    }
    .list {
      position: absolute;
      bottom: 0;
      width: 100%;
      z-index: 0;
      border-radius: 10px;
      .song-list-wrapper {
        padding: 20px 30px;
        background: $color-background;
      }
    }
  }
</style>