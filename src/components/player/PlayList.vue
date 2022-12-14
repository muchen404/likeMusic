<script lang="ts" setup name="PlayList">
import { usePlayerStore } from '@/stores/player'
import useMode from './useMode'
import useFavorite from './use-favorite'
import type { Song } from '@/types/index'
import Scroll from '@/components/base/scroll/scroll.vue'
import { TransitionGroup, type ComponentPublicInstance } from 'vue'
import Confirm from '../base/confirm/Confirm.vue'
import type AddSongVue from '../AddSong/AddSong.vue'

const playerStore = usePlayerStore()
const { modeIcon, modeText, changeMode } = useMode()
const { getFavoriteIcon, toggleFavorite } = useFavorite()

const visible = ref(false)
const playList = computed(() => (playerStore.playList))
const sequenceList = computed(() => (playerStore.sequenceList))
const currentSong = computed(() => (playerStore.currentSong))
const scrollRef = ref<InstanceType<typeof Scroll> | null>(null)
const listRef = ref<ComponentPublicInstance | null>(null)
const confirmRef = ref<InstanceType<typeof Confirm> | null>(null)
const addSongRef = ref<InstanceType<typeof AddSongVue> | null>(null)
const removing = ref(false)

function getCurrentIcon(song: Song) {
  if(song.id === currentSong.value.id) {
    return 'icon-play'
  }
}

watch(currentSong, async (newSong) => {
  if (!visible.value || !newSong.id) {
    return
  }
  await nextTick()
  scrollToCurrent()
})

function hide() {
  visible.value = false
}

async function show() {
  visible.value = true
  await nextTick()
  refreshScroll()
  scrollToCurrent()
}

function refreshScroll() {
  scrollRef.value?.scroll?.refresh()
}

function scrollToCurrent() {
  const index = sequenceList.value.findIndex(song => {
    return currentSong.value.id === song.id
  })
  if (index === -1) {
    return
  }
  const target = (listRef.value as ComponentPublicInstance).$el.children[index]
  scrollRef.value?.scroll?.scrollToElement(target as HTMLElement, 300, 0, 0)
}

function selectItem(song: Song) {
  const index = playList.value.findIndex(item => (song.id === item.id))
  playerStore.setCurrentIndex(index)
  playerStore.setPlaying(true)
}

function removeSong(song: Song) {
  if (removing.value) {
    return
  }
  removing.value = true
  // ???????????? sequenceList???playList?????????
  playerStore.removeSong(song)
  if (!playList.value.length) {
    hide()
  }
  setTimeout(() => {
    removing.value = false
  }, 300)
}

function showConfirm() {
  (confirmRef.value as InstanceType<typeof Confirm>).show()
}

function confirmClear() {
  playerStore.clearSongList()
  hide()
}

function showAddSong() {
  addSongRef.value?.show()
}

defineExpose({
  show
})

</script>

<template>
  <teleport to="body">
    <transition name="list-fade">
      <div 
        v-show="visible && playList.length" 
        class="playlist" 
        @click="hide"
      >
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <h1 class="title">
              <i class="icon" :class="modeIcon" @click="changeMode" />
              <span class="text">{{ modeText }}</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear" />
              </span>
            </h1>
          </div>
          <Scroll ref="scrollRef" class="list-content">
            <transition-group ref="listRef" name="list" tag="ul">
              <li 
                v-for="song in sequenceList"
                :key="song.id"
                class="item"
                @click="selectItem(song)"
              >
                <i class="current" :class="getCurrentIcon(song)" />
                <span class="text">{{ song.name }}</span>
                <span class="favorite" @click.stop="toggleFavorite(song)">
                  <i :class="getFavoriteIcon(song)" />
                </span>
                <span
                  class="delete"
                  :class="{'disable': removing}"
                  @click.stop="removeSong(song)"
                >
                  <i class="icon-delete" />
                </span>
              </li>
            </transition-group>
          </Scroll>
          <div class="list-add">
            <div class="add" @click="showAddSong">
              <i class="icon-add" />
              <span class="text">?????????????????????</span>
            </div>
          </div>
          <div class="list-footer" @click="hide">
            <span>??????</span>
          </div>
        </div>
        <Confirm
          ref="confirmRef"
          text="???????????????????????????"
          confirm-btn-text="??????"
          @confirm="confirmClear"
        />
        <AddSong 
          ref="addSongRef"
        />
      </div>
    </transition>
  </teleport>
</template>


<style lang="scss" scoped>
  .playlist {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: $color-background-d;
    &.list-fade-enter-active, &.list-fade-leave-active {
      transition: opacity .3s;
      .list-wrapper {
        transition: all .3s;
      }
    }
    &.list-fade-enter-from, &.list-fade-leave-to {
      opacity: 0;
      .list-wrapper {
        transform: translate3d(0, 100%, 0);
      }
    }
    .list-wrapper {
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 210;
      width: 100%;
      background-color: $color-highlight-background;
      .list-header {
        position: relative;
        padding: 20px 30px 10px 20px;
        .title {
          display: flex;
          align-items: center;
          .icon {
            margin-right: 10px;
            font-size: 24px;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
          .clear {
            @include extend-click();
            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
      .list-content {
        max-height: 240px;
        overflow: hidden;
        .item {
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 30px 0 20px;
          overflow: hidden;
          .current {
            flex: 0 0 20px;
            width: 20px;
            font-size: $font-size-small;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            @include no-wrap();
            font-size: $font-size-medium;
            color: $color-text-d;
          }
          .favorite {
            @include extend-click();
            margin-right: 15px;
            font-size: $font-size-small;
            color: $color-theme;
            .icon-favorite {
              color: $color-sub-theme;
            }
          }
          .delete {
            @include extend-click();
            font-size: $font-size-small;
            color: $color-theme;
            &.disable {
              color: $color-theme-d;
            }
          }
        }
      }
      .list-add {
        width: 140px;
        margin: 20px auto 30px auto;
        .add {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border: 1px solid $color-text-l;
          border-radius: 100px;
          color: $color-text-l;
          .icon-add {
            margin-right: 5px;
            font-size: $font-size-small-s;
          }
          .text {
            font-size: $font-size-small;
          }
        }
      }
      .list-footer {
        text-align: center;
        line-height: 50px;
        background: $color-background;
        font-size: $font-size-medium-x;
        color: $color-text-l;
      }
    }
  }
</style>