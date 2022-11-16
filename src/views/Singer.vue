<script setup lang="ts">
  import { getSingerList } from '@/service/singer'
  import type { SingerFullList } from '../types/index'

  const singerList = ref<SingerFullList>([])
  getSingerList().then(result => {
    console.log(result)
    singerList.value = result.singers
  })
</script>

<template>
  <div v-loading="!singerList.length" class="singer">
    <IndexList :data="singerList" />
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
