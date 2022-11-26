<script lang="ts" setup name="Search">
  import { getHotKeys } from '@/service/search'
  import { usePlayerStore } from '../stores/player'
  import type { Song, Singer } from '@/types'
  import storage from 'good-storage'
  import { SINGER_KEY } from '../assets/js/constant'
  const query = ref('')
  const hotKeys = ref<{id: number, key: string}[]>([])
  const playerStore = usePlayerStore()
  const selectedSinger = ref< Singer | null >(null)

  const router = useRouter()

  getHotKeys().then(result => {
    hotKeys.value = result.hotKeys
  })

  function addQuery(s: string) {
    query.value = s
  }

  function selectSong(song: Song) {
    playerStore.addSong(song)
  }

  function cachedSinger(singer: Singer) {
    storage.session.set(SINGER_KEY, singer)
  }

  function selectSinger(singer: Singer) {
    selectedSinger.value = singer
    cachedSinger(singer)
    router.push({ path: `/search/${singer.mid}` })
  }

</script>

<template>
  <div class="search">
    <div class="search-input-wrapper">
      <SearchInput v-model="query" />
    </div>
    <div v-show="!query" class="search-content">
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
    </div>
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