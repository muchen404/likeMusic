import type { SingerFullList } from '@/types/index'
import type { BSPosition } from '../base/scroll/scroll.vue'

export default function useFixed(props: { data: SingerFullList }) {
  const groupRef = ref<HTMLElement | null>(null)
  const listHeights = ref<number[]>([])
  const scrollY = ref<number>(0)
  const currentIndex = ref<number>(0)

  const fixedTitle = computed(() => {
    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })

  watch(() => props.data, async () => {
    // 为了正确获取dom高度，需在dom变化之后再进行计算
    await nextTick()
    calculate()
  })

  watch(scrollY, (newY: number) => {
    const listHeightsVal = listHeights.value
    for (let i = 0; i < listHeightsVal.length - 1; i++) {
      // const element = listHeightsVal[i];
      const heightTop = listHeightsVal[i]
      const heightBottom = listHeightsVal[i + 1]
      if(newY > heightTop && newY <= heightBottom) {
        currentIndex.value = i
      }
    }
  })

  function calculate() {
    const list = groupRef.value?.children ?? []
    const listHeightsVal = listHeights.value
    let height = 0

    listHeightsVal.length = 0
    listHeightsVal.push(height)

    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight
      listHeightsVal.push(height)
    }
  }

  function onScroll(pos: BSPosition) {
    scrollY.value = -pos.y
  }

  return { groupRef, onScroll, fixedTitle }
}