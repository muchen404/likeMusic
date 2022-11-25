<script setup lang="ts">
  import storage from 'good-storage'
  import { getSingerList } from '@/service/singer'
  import type { SingerFullList } from '../types/index'
  import type { Singer } from '@/types/index'
  import { SINGER_KEY } from '@/assets/js/constant'

  const singerList = ref<SingerFullList>([])
  const selectedSinger = ref<Singer | null>(null)

  const router = useRouter()

  function cacheSinger (singer: Singer) {
    storage.session.set(SINGER_KEY, singer)
  }

  getSingerList().then(result => {
    singerList.value = result.singers
  })

  function selectSinger(item: Singer) {
    selectedSinger.value = item
    cacheSinger(selectedSinger.value)
    router.push({ path: `/singer/${selectedSinger.value.mid}` })
    // router.push({ path: '/recommend' })
  }
</script>

<template>
  <div v-loading="!singerList.length" class="singer">
    <IndexList :data="singerList" @select="selectSinger" />
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger" />
      </transition>
    </router-view>>
  </div>
</template>

<style lang="scss" scoped>
  .singer {
    position: fixed;
    width: 100%;
    top: 87px;
    bottom: 0;
  }
</style>
