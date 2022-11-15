<script setup lang="ts">
  import { reactive } from 'vue'
  import { getRecommend } from '@/service/recomment'

  let recommendData = reactive({})
  recommendData = await getRecommend()
  console.log(recommendData)
</script>

<template>
  <div class="recommend">
    Recommend
  </div>
</template>

