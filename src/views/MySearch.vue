<script lang="ts" setup name="Search">
  import { getHotKeys } from '@/service/search'
  import { usePlayerStore } from '../stores/player'
  import type { Song, Singer } from '@/types'
  import storage from 'good-storage'
  import { SINGER_KEY } from '../assets/js/constant'
  import { useSearchStore } from '../stores/search'
  import useSearchHistory from '../components/search/use-search-history'
  import WrapScroll from '@/components/WrapScroll/index'
  const query = ref('')
  const hotKeys = ref<{id: number, key: string}[]>([])
  const playerStore = usePlayerStore()
  const searchStore = useSearchStore()
  const selectedSinger = ref< Singer | null >(null)
  const scrollRef = ref<any>(null)
  const confirmRef = ref<any>(null)

  const router = useRouter()

  const { saveSearch, deleteSearch, clearSearch } = useSearchHistory()

  const searchHistory = computed(() => (searchStore.searchHistory))

  getHotKeys().then(result => {
    hotKeys.value = result.hotKeys
  })

  watch(query, async newQuery => {
    if (!newQuery) {
      await nextTick()
      refreshScroll()
    }
  })

  function refreshScroll() {
    scrollRef.value.scroll.refresh()
  }

  function addQuery(s: string) {
    query.value = s
  }

  function selectSong(song: Song) {
    saveSearch(query.value)
    playerStore.addSong(song)
  }

  function cachedSinger(singer: Singer) {
    storage.session.set(SINGER_KEY, singer)
  }

  function selectSinger(singer: Singer) {
    saveSearch(query.value)
    selectedSinger.value = singer
    cachedSinger(singer)

    router.push({ path: `/search/${singer.mid}` })
  }

  function showConfirm() {
    confirmRef.value.show()
  }

</script>

<template>
  <div class="search">
    <div class="search-input-wrapper">
      <SearchInput v-model="query" />
    </div>
    <WrapScroll 
      v-show="!query"
      ref="scrollRef" 
      class="search-content"
    >
      <div>
        <div class="hot-keys">
          <h1 class="title">
            热门搜索
          </h1>
          <ul>
            <li
              v-for="item in hotKeys"
              :key="item.id"
              class="item"
              @click="addQuery(item.key)"
            >
              <span>{{ item.key }}</span>
            </li>
          </ul>
        </div>
        <div v-show="searchHistory.length" class="search-history">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="icon" @click.stop="showConfirm">
              <i class="icon-clear" />
            </span>
          </h1>
          <Confirm 
            ref="confirmRef" 
            text="是否清空所有搜索历史" 
            confirm-btn-text="清空"
            @confirm="clearSearch"
          />
          <SearchList 
            :searches="searchHistory"
            @select="addQuery"
            @delete="deleteSearch"
          />
        </div>
      </div>
    </WrapScroll>
    
    <div v-show="query" class="search-result">
      <Suggest 
        :query="query" 
        @select-song="selectSong"
        @select-singer="selectSinger"
      />
    </div>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger" />
      </transition>
    </router-view>
  </div>
</template>

<style lang="scss" scoped>
  .search {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    display: flex;
    flex-direction: column;
    .search-input-wrapper {
      margin: 20px;
    }
    .search-content {
      flex: 1;
      overflow: hidden;
      .hot-keys {
        margin: 0 20px 20px 20px;
        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }
      .search-history {
        position: relative;
        margin: 0 20px;
        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;
          .text {
            flex: 1;
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
    }
    .search-result {
      flex: 1;
      overflow: hidden;
    }
  }
</style>