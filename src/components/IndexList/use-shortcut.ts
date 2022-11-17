import type { SingerFullList } from '@/types/index'
import type { Ref } from 'vue'
import type ScrollType from '@/components/base/scroll/scroll.vue'

export interface TouchOption { 
  y1: number
  y2: number
  anchorIndex: number
}

export default function useShortcut(
  props: { data: SingerFullList }, 
  groupRef: Ref<HTMLElement | null>
) {
  const scrollRef = ref<InstanceType<typeof ScrollType> | null>(null)
  const ANCHOR_HEIGHT = 18
  const touch: TouchOption = { y1: 0, y2: 0, anchorIndex: 0 }

  const shortcutList = computed(() => {
    return props.data.map((group) => {
      return group.title
    })
  })

  const onShortcutTouchStart = (e: TouchEvent) => {
    const anchorIndex = parseInt((e.target as HTMLDivElement).dataset.index ?? '0')
    touch.y1 = e.touches[0].pageY
    touch.anchorIndex = anchorIndex
    scrollTo(anchorIndex)
  }

  const onShortcutTouchMove = (e: TouchEvent) => {
    touch.y2 = e.touches[0].pageY
    const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0
    const anchorIndex = touch.anchorIndex + delta
    console.log(anchorIndex)
    scrollTo(anchorIndex)
  }
  const onShortcutTouchEnd = (e) => {}

  function scrollTo(index: number) {
    if (isNaN(index)) {
      return
    }
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const targetEl = groupRef.value?.children[index]
    const scroll = scrollRef.value?.scroll
    scroll?.scrollToElement(targetEl as HTMLElement, 0, 0, 0)
  }

  return { 
    shortcutList,
    scrollRef,
    onShortcutTouchStart,
    onShortcutTouchMove,
    onShortcutTouchEnd 
  }
}