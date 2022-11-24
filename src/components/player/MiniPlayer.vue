<script lang="ts" setup name="MiniPlayer">
import { usePlayerStore } from '../../stores/player'
import useCd from './use-cd'
import useMiniSlider from './use-mini-slider'
import PlayList from './PlayList.vue'

const props = withDefaults(defineProps<{
  progress: number,
  togglePlay: () => {}
}>(), {
  progress: 0
})

const playListRef = ref<InstanceType<typeof PlayList> | null>(null)

const playerStore = usePlayerStore()
const currentSong = computed(() => (playerStore.currentSong))
const fullScreen = computed(() => (playerStore.fullScreen))
const playing = computed(() => (playerStore.playing))
const playList = computed(() => (playerStore.playList))

const miniPlayIcon = computed(() => (playing.value ? 'icon-pause-mini':'icon-play-mini'))

const { cdCls, cdRef, cdImageRef } = useCd()
const { sliderWrapperRef } = useMiniSlider()

function showNormalPlayer() {
  playerStore.setFullscreen(true)
}
function showPlayList() {
  (playListRef.value as InstanceType<typeof PlayList>).show()
}

</script>

<template>
  <transition name="mini">
    <div v-show="!fullScreen" class="mini-player" @click="showNormalPlayer">
      <div class="cd-wrapper">
        <div ref="cdRef" class="cd">
          <img
            ref="cdImageRef"
            :src="currentSong.pic"
            width="40"
            height="40"
            :class="cdCls"
          >
        </div>
      </div>
      <div ref="sliderWrapperRef" class="slider-wrapper">
        <div class="slider-group">
          <div 
            v-for="song in playList"
            :key="song.id"
            class="slider-page"
          >
            <h2 class="name">
              {{ song.name }}
            </h2>
            <p class="desc">
              {{ song.singer }}
            </p>
          </div>
        </div>
      </div>
      <div class="control">
        <ProgressCircle :radius="32" :progress="props.progress">
          <i class="icon-mini" :class="miniPlayIcon" @click.stop="togglePlay" />
        </ProgressCircle>
      </div>
      <div class="control" @click.stop="showPlayList">
        <i class="icon-playlist" />
      </div>
      <PlayList ref="playListRef" />
    </div>
  </transition>
</template>

<style lang="scss" scoped>
 .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;
    .cd-wrapper {
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      padding: 0 10px 0 20px;
      .cd {
        height: 100%;
        width: 100%;
        img {
          border-radius: 50%;
          &.playing {
            animation: rotate 10s linear infinite;
          }
          &.pause {
            animation-play-state: paused;
          }
        }
      }
    }
    .slider-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .slider-group {
        position: relative;
        overflow: hidden;
        white-space: nowrap;
        .slider-page {
          display: inline-block;
          width: 100%;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          .name {
            margin-bottom: 2px;
            @include no-wrap();
            font-size: $font-size-medium;
            color: $color-text;
          }
          .desc {
            @include no-wrap();
            font-size: $font-size-small;
            color: $color-text-d;
          }
        }
      }
    }
    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;
      .icon-playlist {
        position: relative;
        top: -2px;
        font-size: 28px;
        color: $color-theme-d;
      }
      .icon-mini {
        position: absolute;
        left: 0;
        top: 0;
        color: $color-theme-d;
        font-size: 32px;
      }
    }
    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
    }
    &.mini-enter-from, &.mini-leave-to {
      opacity: 0;
      transform: translate3d(0, 100%, 0)
    }
  }
</style>