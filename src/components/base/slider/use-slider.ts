import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import { onMounted, onUnmounted, ref } from 'vue'
import type { Ref } from 'vue'

BScroll.use(Slide)
export default function useSlider(wrapperRef: Ref<HTMLElement | null>) {
  const slider: Ref<InstanceType<typeof BScroll> | null> = ref(null)
  const currentPageIndex = ref(0)

  onMounted(() => {
    if(wrapperRef.value) {
      const sliderVal = slider.value = new BScroll(wrapperRef.value, {
        click: true,
        scrollX: true,
        scrollY: false,
        momentum: false,
        bounce: false,
        probeType: 2,
        slide: true
      })

      sliderVal.on('slideWillChange', (page: InstanceType<typeof Slide>['exposedPage']) => {
        currentPageIndex.value = page.pageX
      })
    }
  })

  onUnmounted(() => {
    slider.value?.destroy()
  })

  return {
    slider,
    currentPageIndex
  }
}