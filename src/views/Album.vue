<script lang="ts" name="Album">
  import createDetailComponent from '@/assets/js/create-detail-components'
  import { ALBUM_KEY } from '@/assets/js/constant'
  import { getAlbum } from '@/service/recomment'
  import type { AlbumsItem } from '../types/index'
 
  export default createDetailComponent<AlbumsItem>('Album', ALBUM_KEY, getAlbum)
</script>

<template>
  <div class="album">
    <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
    />
  </div>
</template>

<style lang="scss" scoped>
  .album {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background
  }
</style>