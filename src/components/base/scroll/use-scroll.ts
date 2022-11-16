import BScroll from '@better-scroll/core'
import { onMounted, onUnmounted, ref } from 'vue'
import type { Ref } from 'vue'
import ObserveDOM from '@better-scroll/observe-dom'

interface UseScrollOptions {
  click: boolean
}

BScroll.use(ObserveDOM)

export default function useScroll(
  wrapperRef: Ref<HTMLElement | null>, 
  options: UseScrollOptions
) {
  const scroll = ref<InstanceType<typeof BScroll> | null>(null)

  onMounted(() => {
    if(wrapperRef.value) {
      scroll.value = new BScroll(wrapperRef.value, {
        observeDOM: true,
        ...options
      })

      setTimeout(() => {
        scroll.value?.refresh()
      }, 1000)
    }
  })

  onUnmounted(() => {
    scroll.value?.destroy()
  })
}