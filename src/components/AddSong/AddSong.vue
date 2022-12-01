<script lang="ts" setup name="AddSong">
import { useSearchStore } from '@/stores/search'
import { usePlayerStore } from '@/stores/player'
import useSearchHistory from '../search/use-search-history'
import type { Song } from '../../types/index'
import Message from '@/components/base/message/Message.vue'

const playerStore = usePlayerStore()
const searchStore = useSearchStore()
const visible = ref(false)
const query = ref('')
const currentIndex = ref(0)
const scrollRef = ref<any>(null)
const messageRef = ref<InstanceType<typeof Message> | null>(null)
const searchHistory = computed(() => (searchStore.searchHistory))
const playHistory = computed(() => (playerStore.playHistory))
const { saveSearch } = useSearchHistory()

watch(query, async () => {
  await nextTick()
  refreshScroll()
})

function addQuery(s: string) {
  query.value = s
}

function refreshScroll() {
  scrollRef.value.scroll.refresh()
}

function selectSongBySuggest(song: Song) {
  addSong(song)
  saveSearch(query.value)
}

function selectSongBySongList({ song }: { song: Song }) {
  addSong(song)
}

function addSong(song:Song) {
  playerStore.addSong(song, false)
  showMessage()
}

async function show() {
  visible.value = true
  await nextTick()
  refreshScroll()
}

function hide() {
  visible.value = false
}

function showMessage() {
  (messageRef.value as InstanceType<typeof Message>).show()
}



defineExpose({
  show
})

</script>


<template>
  <teleport to="body">
    <transition name="slide">
      <div v-show="visible" class="add-song">
        <div class="header">
          <h1 class="title">
            添加歌曲到列表
          </h1>
          <div class="close" @click="hide">
            <i class="icon-close" />
          </div>
        </div>
        <div class="search-input-wrapper">
          <SearchInput
            v-model="query"
            placeholder="搜索歌曲"
          />
        </div>
        <div v-show="!query">
          <Switches
            v-model="currentIndex"
            :items="['最近播放', '搜索历史']"
          />
          <div class="list-wrapper">
            <Scroll
              v-if="currentIndex===0"
              ref="scrollRef"
              class="list-scroll"
            >
              <div class="list-inner">
                <SongList
                  :songs="playHistory"
                  @select="selectSongBySongList"
                />
              </div>
            </Scroll>
            <Scroll
              v-if="currentIndex===1"
              ref="scrollRef"
              class="list-scroll"
            >
              <div class="list-inner">
                <SearchList
                  :searches="searchHistory"
                  :show-delete="false"
                  @select="addQuery"
                />
              </div>
            </Scroll>
          </div>
        </div>
        <div v-show="query" class="search-result">
          <Suggest
            :query="query"
            :show-singer="false"
            @select-song="selectSongBySuggest"
          />
        </div>
        <Message ref="messageRef">
          <div class="message-title">
            <i class="icon-ok" />
            <span class="text">1首歌曲已经添加到播放列表</span>
          </div>
        </Message>
      </div>
    </transition>
  </teleport>
</template>

<style lang="scss" scoped>
  .add-song {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 300;
    background: $color-background;
    .header {
      position: relative;
      height: 44px;
      text-align: center;
      .title {
        line-height: 44px;
        font-size: $font-size-large;
        color: $color-text;
      }
      .close {
        position: absolute;
        top: 0;
        right: 8px;
        .icon-close {
          display: block;
          padding: 12px;
          font-size: 20px;
          color: $color-theme;
        }
      }
    }
    .search-input-wrapper {
      margin: 20px
    }
    .list-wrapper {
      position: absolute;
      top: 165px;
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
    .search-result {
      position: fixed;
      top: 124px;
      bottom: 0;
      width: 100%;
    }
  }

  .message-title {
    text-align: center;
    padding: 18px 0;
    font-size: 0;
    .icon-ok {
      font-size: $font-size-medium;
      color: $color-theme;
      margin-right: 4px;
    }
    .text {
      font-size: $font-size-medium;
      color: $color-text;
    }
  }
</style>