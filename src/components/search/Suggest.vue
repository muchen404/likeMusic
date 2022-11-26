<script lang="ts" setup name="Suggest">
import type { Singer, Song } from '../../types/index'
import { search } from '@/service/search'
import { processSongs } from '@/service/song'
import usePullUpLoad from './use-pull-up-load'

const props = withDefaults(defineProps<{
  showSinger?: boolean,
  query: string
}>(), {
  showSinger: true
})

const singer = ref<Singer | null>(null)
const songs = ref<Song[]>([])
const hasMore = ref(true)
const page = ref(1)
const loadingText = ref('')
const noResultText = ref('抱歉，暂无搜索结果')
const manualLoading = ref(false)




watch(() => props.query, async newQuery => {
  if (!newQuery) {
    return
  }
  await searchFirst()
})

const pullUpLoading = computed(() => (isPullUpLoad.value && hasMore.value))
const noResult = computed(() => {
  return !singer.value && !songs.value.length && !hasMore.value
})
const loading = computed(() => {
  return !singer.value && !songs.value.length
})
const preventPullUpLoad = computed(() => (loading.value || manualLoading.value))

const { isPullUpLoad, rootRef, scroll } = usePullUpLoad(searchMore, preventPullUpLoad)

async function searchFirst() {
  if(!props.query) {
    return
  }
  page.value = 1
  songs.value = []
  singer.value = null
  hasMore.value = true

  const result = await search(props.query, page.value, props.showSinger)
  songs.value = await processSongs(result.songs)
  singer.value = result.singer
  hasMore.value = result.hasMore
  await makeItScrollable()
}
async function searchMore() {
  if(!hasMore.value || !props.query) {
    return
  }
  page.value++
  const result = await search(props.query, page.value, props.showSinger)
  songs.value = songs.value.concat(await processSongs(result.songs))
  hasMore.value = result.hasMore
  await makeItScrollable()
}
async function makeItScrollable() {
  await nextTick()
  if (scroll.value.maxScrollY >= -1) {
    manualLoading.value = true
    await searchMore()
    manualLoading.value = false
  }
}

function selectSinger(singer: Singer) {}
function selectSong(song: Song) {}
</script>

<template>
  <div
    ref="rootRef"
    v-loading:[loadingText]="loading"
    v-no-result:[noResultText]="noResult"
    class="suggest"
  >
    <ul class="suggest-list">
      <li
        v-if="singer"
        class="suggest-item"
        @click="selectSinger(singer as Singer)"
      >
        <div class="icon">
          <i class="icon-mine" />
        </div>
        <div class="name">
          <p class="text">
            {{ singer.name }}
          </p>
        </div>
      </li>
      <li
        v-for="song in songs"
        :key="song.id"
        class="suggest-item"
        @click="selectSong(song)"
      >
        <div class="icon">
          <i class="icon-music" />
        </div>
        <div class="name">
          <p class="text">
            {{ song.singer }}-{{ song.name }}
          </p>
        </div>
      </li>
      <div
        v-loading:[loadingText]="pullUpLoading"
        class="suggest-item"
      />
    </ul>
  </div>
</template>

<style lang="scss" scoped>
  .suggest {
    height: 100%;
    overflow: hidden;
    .suggest-list {
      padding: 0 30px;
      .suggest-item {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        .icon {
          flex: 0 0 30px;
          width: 30px;
          [class^="icon-"] {
            font-size: 14px;
            color: $color-text-d;
          }
        }
        .name {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-d;
          overflow: hidden;
          .text {
            @include no-wrap();
          }
        }
      }
    }
  }
</style>
