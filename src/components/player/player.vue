<script setup lang="ts" name="Player">
import { PlayMode, usePlayerStore } from '@/stores/player'
import { formatTime } from '@/assets/js/util'
import useFavorite from './use-favorite'
import useMode from './useMode'
import useCd from './use-cd'
import useLyric from './use-lyric'
import useMiddleInteractive from './use-middle-interactive'
import type { StyleValue } from 'vue'

// data
const songReady = ref(false)
const audioRef = ref<HTMLAudioElement | null>(null)
const currentTime = ref(0)
let progressChanging = false

const { modeIcon, changeMode } = useMode()
const { getFavoriteIcon, toggleFavorite } = useFavorite()
const { cdCls, cdRef, cdImageRef } = useCd()
const {
  currentLyric,
  currentLineNum,
  playLyric,
  stopLyric,
  lyricScrollRef,
  lyricListRef,
  pureMusicLyric,
  playingLyric
} = useLyric({ songReady, currentTime })

const { 
  middleRStyle, 
  middleLStyle, 
  currentShow,
  onMiddleTouchStart,
  onMiddleTouchMove,
  onMiddleTouchEnd
} = useMiddleInteractive()

// store
const playerStore = usePlayerStore()
const fullScreen = computed(() => playerStore.fullScreen)
const currentSong = computed(() => playerStore.currentSong)
const playing = computed(() => playerStore.playing) // 播放状态
const currentIndex = computed(() => playerStore.currentIndex)
const playList = computed(() => playerStore.playList)

const playIcon = computed(() => {
  return playing.value ? 'icon-pause' : 'icon-play'
})
const disabledCls = computed(() => {
  return songReady.value ? '' : 'disable'
})
const progress = computed(() => currentTime.value / currentSong.value.duration)

// watch
watch(currentSong, (newSong) => {
  if (!newSong.id || !newSong.url) {
    return
  }
  currentTime.value = 0
  songReady.value = false
  const audioEl = audioRef.value as HTMLAudioElement
  audioEl.src = newSong.url
  audioEl.play()
})
watch(playing, (newPlaying) => {
  if (!songReady.value) {
    return
  }
  const audioEl = audioRef.value
  if (newPlaying) {
    audioEl
      ?.play()
      .then((res) => {
        console.log('play success', res)
      })
      .catch((err) => {
        console.log('Dont worry! play error', err)
      })
    playLyric()
  } else {
    audioEl?.pause()
    stopLyric()
  }
})

// 转换播放状态
function togglePlay() {
  console.log('toggle play')
  if (!songReady.value) {
    return
  }
  playerStore.setPlaying(!playing.value)
}
function pause() {
  console.log('trigger pause')
  playerStore.setPlaying(false)
}
function prev() {
  const list = playList.value
  if (!songReady.value || !list.length) {
    return
  }
  if (list.length === 1) {
    loop()
  } else {
    let index = currentIndex.value - 1
    if (index === -1) {
      index = list.length - 1
    }
    playerStore.setCurrentIndex(index)
    if (!playing.value) {
      playerStore.setPlaying(true)
    }
  }
}
function next() {
  const list = playList.value
  if (!songReady.value || !list.length) {
    return
  }
  if (list.length === 1) {
    loop()
  } else {
    let index = currentIndex.value + 1
    if (index === list.length) {
      index = 0
    }
    playerStore.setCurrentIndex(index)
    if (!playing.value) {
      playerStore.setPlaying(true)
    }
  }
}
function loop() {
  console.log('trigger loop')
  const audioEl = audioRef.value as HTMLAudioElement
  audioEl.currentTime = 0
  audioEl.play()
  playerStore.setPlaying(true)
}
function end() {
  currentTime.value = 0
  if (playerStore.playMode === PlayMode.loop) {
    loop()
  } else {
    next()
  }
}
function ready() {
  if (songReady.value) {
    return
  }
  songReady.value = true
  playLyric()
}
function error() {
  songReady.value = true
}
function goBack() {
  playerStore.setFullscreen(false)
}
// 播放器时间更新事件
function updateTime(e: Event) {
  if (!progressChanging) {
    currentTime.value = (e.target as HTMLAudioElement).currentTime
  }
}
// 进度条拖动中事件
function onProgressChanging(progress: number) {
  progressChanging = true
  currentTime.value = currentSong.value.duration * progress

  playLyric()
  stopLyric()
}
// 进度条拖动结束事件
function onProgressChanged(progress: number) {
  progressChanging = false
  ;(audioRef.value as HTMLAudioElement).currentTime = currentTime.value =
    currentSong.value.duration * progress
  if (!playing.value) {
    playerStore.setPlaying(true)
  }
  playLyric()
}
</script>

<template>
  <div class="player">
    <div v-show="fullScreen" class="normal-player">
      <div class="background">
        <img :src="currentSong.pic" alt="">
      </div>
      <div class="top">
        <div class="back" @click="goBack">
          <i class="icon-back" />
        </div>
        <h1 class="title">
          {{ currentSong.name }}
        </h1>
        <h2 class="subtitle">
          {{ currentSong.singer }}
        </h2>
      </div>
      <div 
        class="middle"
        @touchstart="onMiddleTouchStart"
        @touchmove="onMiddleTouchMove"
        @touchend="onMiddleTouchEnd"
      >
        <div 
          class="middle-l" 
          :style="(middleLStyle as StyleValue)"
        >
          <div class="cd-wrapper">
            <div ref="cdRef" class="cd">
              <img ref="cdImageRef" :src="currentSong.pic" :class="cdCls">
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">
              {{ playingLyric }}
            </div>
          </div>
        </div>
        <Scroll
          ref="lyricScrollRef" 
          class="middle-r" 
          :style="middleRStyle"
        >
          <div class="lyric-wrapper">
            <div v-if="currentLyric" ref="lyricListRef">
              <p
                v-for="(line, index) in currentLyric.lines"
                :key="line.txt"
                :class="{ current: currentLineNum === index }"
                class="text"
              >
                {{ line.txt }}
              </p>
            </div>
            <div v-show="pureMusicLyric" class="pure-music">
              <p>{{ pureMusicLyric }}</p>
            </div>
          </div>
        </Scroll>
      </div>
      <div class="bottom">
        <div class="dot-wrapper">
          <span class="dot" :class="{'active':currentShow==='cd'}" />
          <span class="dot" :class="{'active':currentShow==='lyric'}" />
        </div>
        <div class="progress-wrapper">
          <span class="time time-l">{{ formatTime(currentTime) }}</span>
          <div class="progress-bar-wrapper">
            <progress-bar
              ref="barRef"
              :progress="progress"
              @progress-changing="onProgressChanging"
              @progress-changed="onProgressChanged"
            />
          </div>
          <span class="time time-r">
            {{ formatTime(currentSong.duration) }}
          </span>
        </div>
        <div class="operators">
          <div class="icon i-left">
            <i :class="modeIcon" @click="changeMode" />
          </div>
          <div class="icon i-left" :class="disabledCls">
            <i class="icon-prev" @click="prev" />
          </div>
          <div class="icon i-center" :class="disabledCls">
            <i :class="playIcon" @click="togglePlay" />
          </div>
          <div class="icon i-right" :class="disabledCls">
            <i class="icon-next" @click="next" />
          </div>
          <div class="icon i-right">
            <i
              :class="getFavoriteIcon(currentSong)"
              @click="toggleFavorite(currentSong)"
            />
          </div>
        </div>
      </div>
      <audio
        ref="audioRef"
        @pause="pause"
        @canplay="ready"
        @error="error"
        @timeupdate="updateTime"
        @ended="end"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1500;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        // display: none;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;
      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
