import { usePlayerStore } from '../../stores/player'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import type { Options } from '@better-scroll/core'
import type { Ref } from 'vue'

BScroll.use(Slide)
type MyBScrollType = InstanceType<typeof BScroll<Options>>

export default function useMiniSlider() {
  const sliderWrapperRef = ref<HTMLElement | null>(null)
  const slider = ref<any>(null)
  const playerStore = usePlayerStore()
  const fullScreen = computed(() => (playerStore.fullScreen))
  const playList = computed(() => (playerStore.playList))
  const currentIndex = computed(() => (playerStore.currentIndex))
  const sliderShow = computed(() => (!fullScreen.value && !!playList.value))

  onMounted(() => {
    let sliderVal: MyBScrollType | undefined
    watch(sliderShow, async (newSliderShow) => {
      if (newSliderShow) {
        await nextTick()
        if (!sliderVal) {
          sliderVal = slider.value = new BScroll((sliderWrapperRef.value) as HTMLElement, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true
            }
          })
          sliderVal.on('slidePageChanged', ({ pageX }: { pageX: number }) => {
            playerStore.setCurrentIndex(pageX)
          })
        } else {
          sliderVal.refresh()
        }
        sliderVal.goToPage(currentIndex.value, 0, 0)
      }
    })
    watch(currentIndex, (newIndex) => {
      if(sliderVal && sliderShow.value) {
        sliderVal.goToPage(newIndex, 0, 0)
      }
    })
    watch(playList, (newList) => {
      if (sliderVal && sliderShow.value && newList.length) {
        sliderVal.refresh()
      }
    })
  })

  onUnmounted(() => {
    if(slider.value) {
      slider.value.destroy()
    }
  })

  return {
    slider, // TODO 推导slider类型
    sliderWrapperRef
  }
}