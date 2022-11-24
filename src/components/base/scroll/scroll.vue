<script setup lang="ts">
  import useScroll from './use-scroll'
  import type { BSPosition } from '@/types'
  import { ref } from 'vue'

  export interface UseScrollOptions {
    click?: boolean
    probeType?: number
  }

 
  export interface UseScrollEmit {
    (e: 'scroll', pos: BSPosition): void
  }

  const props = withDefaults(defineProps<UseScrollOptions>(), {
    click: true,
    probeType: 0
  })

  const emit = defineEmits<UseScrollEmit>()

  const rootRef= ref<HTMLElement | null>(null)
  const scroll = useScroll(rootRef, props, emit)

  function refresh() {
    
  }

  defineExpose({
    scroll
  })
</script>

<template>
  <div ref="rootRef">
    <slot />
  </div>
</template>