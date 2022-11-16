<script setup lang="ts">
  import useScroll from './use-scroll'
  import { ref } from 'vue'

  const props = withDefaults(defineProps<{
    click: boolean
  }>(), {
    click: true
  })

  const rootRef= ref<HTMLElement | null>(null)
  useScroll(rootRef, props)
</script>

<template>
  <div ref="rootRef">
    <slot />
  </div>
</template>