import { usePlayerStore } from '@/stores/player'


export default function useCd() {
  const cdRef = ref<HTMLElement | null>(null)
  const cdImageRef = ref<HTMLElement | null>(null)

  const playerStore = usePlayerStore()
  const playing = computed(() => (playerStore.playing))
  const cdCls = computed(() => (playing.value ? 'image playing' : 'image'))

  watch(playing, newPlaying => {
    if (!newPlaying) {
      syncTransform(cdRef.value as HTMLElement, cdImageRef.value as HTMLElement)
    }
  })

  function syncTransform(wrapper: HTMLElement, inner: HTMLElement) {
    const wrapperTransform = getComputedStyle(wrapper).transform
    const innerTransform = getComputedStyle(inner).transform
    wrapper.style.transform = wrapperTransform === 'none' ? innerTransform : innerTransform.concat(' ', wrapperTransform)
  }

  return { 
    cdCls,
    cdRef,
    cdImageRef
  }
}