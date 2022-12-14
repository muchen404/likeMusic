<script setup lang="ts">
import type { Song } from '@/types'

withDefaults(defineProps<{
  songs: Song[],
  rank?: boolean
}>(), {
  songs: () => ([])
})

function getDesc(song: Song) {
  return `${song.singer}·${song.album}`
}

const emit = defineEmits(['select'])
function selectItem(song: Song, index: number) {
  emit('select', { song, index })
}
function getRankText(index: number) {
  if (index > 2) {
    return index + 1
  }
}

function getRankCls(index: number) {
  if (index <= 2) {
    return `icon icon${index}`
  } else {
    return 'text'
  }
}

</script>

<template>
  <ul class="song-list">
    <li
      v-for="(song, index) in songs"
      :key="song.id"
      class="item"
      @click="selectItem(song, index)"
    >
      <div v-if="rank" class="rank">
        <span :class="getRankCls(index)">{{ getRankText(index) }}</span>
      </div>
      <div class="content">
        <h2 class="name">
          {{ song.name }}
        </h2>
        <p class="desc">
          {{ getDesc(song) }}
        </p>
      </div>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
  .song-list {
    .item {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 64px;
      font-size: $font-size-medium;
      .rank {
        flex: 0 0 25px;
        width: 25px;
        margin-right: 20px;
        text-align: center;
        .icon {
          display: inline-block;
          width: 25px;
          height: 24px;
          background-size: 25px 24px;
          &.icon0 {
            @include bg-image('first');
          }
          &.icon1 {
            @include bg-image('second');
          }
          &.icon2 {
            @include bg-image('third');
          }
        }
        .text {
          color: $color-theme;
          font-size: $font-size-large;
        }
      }
      .content {
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name {
          @include no-wrap();
          color: $color-text
        }
        .desc {
          @include no-wrap();
          margin-top: 4px;
          color: $color-text-d;
        }
      }
    }
  }
</style>