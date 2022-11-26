import BScroll from '@better-scroll/core'
import PullUp from '@better-scroll/pull-up'
import ObserveDOM from '@better-scroll/observe-dom'
import type { BScrollConstructor } from '@better-scroll/core/dist/types/BScroll'
import type { ComputedRef } from 'vue'

BScroll.use(PullUp)
BScroll.use(ObserveDOM)

export default function usePullUpLoad(requestData: () => Promise<any>, preventPullUpLoad: ComputedRef<boolean>){

  const scroll = ref<any>(null) // TODO 补充类型
  const rootRef = ref<HTMLElement | null>(null)
  const isPullUpLoad = ref(false)

  onMounted(() => {
    const scrollVal = new BScroll(rootRef.value as HTMLElement, {
      pullUpLoad: true,
      observeDOM: true,
      click: true
    })

    scroll.value = scrollVal

    scrollVal.on('pullingUp', pullingUpHandler)

    async function pullingUpHandler() {
      if(preventPullUpLoad.value) {
        return
      }
      isPullUpLoad.value = true
      await requestData()
      scrollVal.finishPullUp()
      scrollVal.refresh()
      isPullUpLoad.value = false
    }
  })

  onUnmounted(() => {
    (scroll.value as BScrollConstructor<{}>).destroy()
  })


  return {
    scroll,
    rootRef,
    isPullUpLoad
  }
}