
<script lang="ts" setup name="UserCenter">
import { usePlayerStore } from '@/stores/player'
import type { Song } from '../types/index'

const playerStore = usePlayerStore()
const router = useRouter()

const favoriteList = computed(() => (playerStore.favoriteList))
const playHistory = computed(() => (playerStore.playHistory))
const currentIndex = ref(0)

const currentList = computed(() => {
  return currentIndex.value === 0 ? favoriteList.value : playHistory.value
})
const noResult = computed(() => {
  return currentIndex.value === 0 
  ? !favoriteList.value.length 
  : !playHistory.value.length
})
const noResultText = computed(() => {
  return currentIndex.value === 0 ? '暂无收藏歌曲' : '你还没有听过歌曲' 
})

function addSong(song: Song) {
  playerStore.addSong(song, false)
}

function selectSong({song}: {song: Song}) {
  addSong(song)
}

function random() {
  playerStore.randomPlay(currentList.value)
}

function back() {
  router.back()
}

</script>

<template>
  <div v-no-result:[noResultText]="noResult" class="user-center">
    <div class="back" @click="back">
      <i class="icon-back" />
    </div>
    <div class="switches-wrapper">
      <Switches
        v-model="currentIndex"
        :items="['我喜欢的', '最近播放']"
      />
    </div>
    <div class="play-btn" @click="random">
      <i class="icon-play" />
      <span class="text">随机播放全部</span>
    </div>
    <div class="list-wrapper">
      <Scroll v-if="currentIndex ===0" class="list-scroll">
        <div class="list-inner">
          <SongList
            :songs="favoriteList"
            @select="selectSong"
          />
        </div>
      </Scroll>
      <scroll v-if="currentIndex===1" class="list-scroll">
        <div class="list-inner">
          <SongList
            :songs="playHistory"
            @select="selectSong"
          />
        </div>
      </scroll>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .user-center {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 100;
    width: 100%;
    background: $color-background;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 50;
      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .switches-wrapper {
      margin: 10px 0 30px 0;
    }
    .play-btn {
      box-sizing: border-box;
      width: 135px;
      padding: 7px 0;
      margin: 0 auto;
      text-align: center;
      border: 1px solid $color-text-l;
      color: $color-text-l;
      border-radius: 100px;
      font-size: 0;
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
    .list-wrapper {
      position: absolute;
      top: 110px;
      bottom: 0;
      width: 100%;
      .list-scroll {
        height: 100%;
        overflow: hidden;
        .list-inner {
          padding: 20px 30px;
        }
      }
    }
  }
</style>