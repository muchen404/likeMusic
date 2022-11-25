<script lang="ts">
  import createDetailComponent from '@/assets/js/create-detail-components'
  import { SINGER_KEY } from '@/assets/js/constant'
  import { getSingerDetail } from '@/service/singer'
  import type { Singer } from '../types/index'

  export default createDetailComponent<Singer>('SingerDetail', SINGER_KEY, getSingerDetail)

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

<style lang="scss" scoped>
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