import BScroll from '@better-scroll/core'
import { onMounted, onUnmounted, ref } from 'vue'
import type { Ref } from 'vue'
import ObserveDOM from '@better-scroll/observe-dom'
import type { UseScrollOptions, UseScrollEmit, BSPosition } from './scroll.vue'

BScroll.use(ObserveDOM)

export type BScrollInstance = InstanceType<typeof BScroll> | null

export default function useScroll(
  wrapperRef: Ref<HTMLElement | null>, 
  options: UseScrollOptions,
  emit: UseScrollEmit
): Ref<BScrollInstance> {
  
  const scroll = ref<BScrollInstance>(null)

  onMounted(() => {
    let scrollVal = scroll.value
    if(wrapperRef.value) {
      scrollVal = scroll.value = new BScroll(wrapperRef.value, {
        observeDOM: true,
        ...options
      })

      if(options.probeType > 0) {
        scrollVal.on('scroll', (pos: BSPosition) => {
          emit('scroll', pos)
        })
      }
    }
  })

  onUnmounted(() => {
    scroll.value?.destroy()
  })
  return scroll as Ref<BScrollInstance>
}