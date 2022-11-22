import BScroll from '@better-scroll/core'
import { onMounted, onUnmounted, ref } from 'vue'
import type { Ref } from 'vue'
import ObserveDOM from '@better-scroll/observe-dom'
import type { UseScrollOptions, UseScrollEmit } from './scroll.vue'
import type { BSPosition } from '@/types'

BScroll.use(ObserveDOM)

export type BScrollInstance = InstanceType<typeof BScroll> | null

export default function useScroll(
  wrapperRef: Ref<HTMLElement | null>, 
  options: UseScrollOptions,
  emit: UseScrollEmit
): Ref<BScrollInstance> {
  
  const scroll = ref<BScrollInstance>(null)

  onMounted(() => {
    const scrollVal: InstanceType<typeof BScroll> = scroll.value = new BScroll(wrapperRef.value as HTMLElement, {
      observeDOM: true,
      ...options
    })

    if((options.probeType as number) > 0) {
      scrollVal.on('scroll', (pos: BSPosition) => {
        emit('scroll', pos)
      })
    }
    // }
  })

  onUnmounted(() => {
    scroll.value?.destroy()
  })
  return scroll as Ref<BScrollInstance>
}