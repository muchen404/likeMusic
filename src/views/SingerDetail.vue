<script setup lang="ts">
import storage from 'good-storage'
import type { Singer, Song } from '@/types/index'
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'
import { ref } from 'vue'
import { SINGER_KEY } from '@/assets/js/constant'

const props = defineProps<{
  singer: Singer,
}>()

const route = useRoute()
const router = useRouter()

const computedSinger = computed<Singer>(() => {
  let ret = null
  const singerVal = props.singer
  if (singerVal) {
    ret = singerVal
  } else {
    const cachedSinger = storage.session.get(SINGER_KEY)
    if (cachedSinger && cachedSinger.mid === route.params.id) {
      ret = cachedSinger
    }
  }
  return ret
})

const songs = ref<Song[]>([])
const loading = ref<boolean>(true)

const pic = computed(() => {
  const singerVal = computedSinger.value
  return singerVal && singerVal.pic
})
const title = computed(() => {
  const singerVal = computedSinger.value
  return singerVal && singerVal.name
})

onMounted(() => {
  if (!computedSinger.value) {
    router.push({path: '/singer'})
    return 
  }
  getSingerDetail(computedSinger.value).then(async (result) => {
    loading.value = false
    songs.value = await processSongs(result.songs)
  })
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