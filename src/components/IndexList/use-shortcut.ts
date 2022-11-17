import type { SingerFullList } from '@/types/index'
import type { Ref } from 'vue'
import type ScrollType from '@/components/base/scroll/scroll.vue'

export default function useShortcut(
  props: { data: SingerFullList }, 
  groupRef: Ref<HTMLElement | null>
) {
  const scrollRef = ref<InstanceType<typeof ScrollType> | null>(null)

  const shortcutList = computed(() => {
    return props.data.map((group) => {
      return group.title
    })
  })

  const onShortcutTouchStart = (e: Event) => {
    const anochorIndex = parseInt((e.target as HTMLDivElement).dataset.index ?? '0')
    const targetEl = groupRef.value?.children[anochorIndex]
    const scroll = scrollRef.value?.scroll
    if (targetEl && scroll) {
      scroll?.scrollToElement(targetEl as HTMLElement, 0, 0, 0)
    } else {
      console.error('miss element targetEl or scroll')
    }
  }

  const onShortcutTouchMove = (e) => {}
  const onShortcutTouchEnd = (e) => {}

  return { 
    shortcutList,
    scrollRef,
    onShortcutTouchStart,
    onShortcutTouchMove,
    onShortcutTouchEnd 
  }
}