<script lang="ts" setup name="TopList">
import { TOP_KEY } from '@/assets/js/constant'
import { getTopList } from '@/service/top-list'
import type { TopListItem } from '@/types'
import storage from 'good-storage'

const topList = ref<TopListItem[]>([])
const loading = ref(true)
const selectedRank = ref<TopListItem | null>(null)
const router = useRouter()

onMounted(async () => {
  const result = await getTopList()
  topList.value = (result as any).topList
  loading.value = false
})

function cacheRank (rank: TopListItem) {
  storage.session.set(TOP_KEY, rank)
}

function selectItem(item: TopListItem) {
  selectedRank.value = item
  cacheRank(item)
  router.push({ path: `/top-list/${item.id}` })
}

</script>

<template>
  <div v-loading="loading" class="top-list">
    <scroll class="top-list-content">
      <ul>
        <li
          v-for="item in topList"
          :key="item.id"
          class="item"
          @click="selectItem(item)"
        >
          <div class="icon">
            <img
              v-lazy="item.pic"
              width="100"
              height="100"
            >
          </div>
          <ul class="song-list">
            <li
              v-for="(song, index) in item.songList"
              :key="song.id"
              class="song"
            >
              <span>{{ index + 1 }}. </span>
              <span>{{ song.songName }}-{{ song.singerName }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedRank" />
      </transition>
    </router-view>
  </div>
</template>

<style lang="scss" scoped>
  .top-list {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    .top-list-content {
      height: 100%;
      overflow: hidden;
      .item {
        display: flex;
        margin: 0 20px;
        padding-top: 20px;
        height: 100px;
        &:last-child {
          padding-bottom: 20px;
        }
        .icon {
          flex: 0 0 100px;
          width: 100px;
          height: 100px;
        }
        .song-list {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 20px;
          height: 100px;
          overflow: hidden;
          background: $color-highlight-background;
          color: $color-text-d;
          font-size: $font-size-small;
          .song {
            @include no-wrap();
            line-height: 26px;
          }
        }
      }
    }
  }
</style>