<script setup lang="ts">
import type { Singer, Song } from '../types/index'
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'
import { ref } from 'vue'
  const props = defineProps<{
    singer: Singer
  }>()

  const songs = ref<Song[]>([])
  const loading = ref<boolean>(true)

  const pic = computed(() => {
    return props.singer.pic
  })
  const title = computed(() => {
    return props.singer.name
  })

  getSingerDetail(props.singer).then(async (result) => {
    loading.value = false
    songs.value = await processSongs(result.songs)
  })
</script>

<template>
  <div class="singer-detail">
    <music-list
      :songs="songs"
      :pic="pic"
      :title="title"
      :loading="loading"
    />
  </div>
</template>

<style lang="scss">
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>