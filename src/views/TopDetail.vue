
<script lang="ts">
import createDetailComponent from '@/assets/js/create-detail-components'
import { getTopDetail } from '@/service/top-list'
import { TOP_KEY } from '@/assets/js/constant'
import type { TopListItem } from '@/types'

export default createDetailComponent<TopListItem>('TopDetail', TOP_KEY, getTopDetail)
</script>

<template>
  <div class="top-detail">
    <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
      rank
    />
  </div>
</template>

<style lang="scss" scoped>
  .top-detail {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
  }
</style>
