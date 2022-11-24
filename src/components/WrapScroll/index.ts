import { 
  h, 
  mergeProps, 
  type ComponentPublicInstance, 
  type VNodeChild, 
  withCtx, 
  renderSlot 
} from 'vue'
import Scroll from '@/components/base/scroll/scroll.vue'
import { usePlayerStore } from '../../stores/player'

export default {
  name: 'WrapScroll',
  props: Scroll.props,
  emits: Scroll.emits,
  render(ctx: ComponentPublicInstance): VNodeChild {
    return h(
      Scroll,
      mergeProps({ref: 'scrollRef'}, ctx.$props, {
        onScroll: (e: any) => {
          ctx.$emit('scroll', e)
        }
      }),
      {
        default: withCtx(() => {
          return [ renderSlot(ctx.$slots, 'default') ]
        })
      }
    )
  },
  setup() {
    type ScrollInstance = InstanceType<typeof Scroll>

    const scroll = computed(() => {
      return (scrollRef.value as ScrollInstance).scroll
    })

    const scrollRef = ref<ScrollInstance | null>(null)
    const playerStore = usePlayerStore()
    const playList = computed(() => (playerStore.playList))

    watch(playList, async () => {
      await nextTick()
      scroll.value?.refresh()
    })

    return {
      scrollRef,
      scroll
    }
  }
} as any