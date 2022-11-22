

export default function useMiddleInteractive() {
  const middleRStyle = ref<Record<string, string> | null>(null)


  middleRStyle.value = {
    // transform: 'translate3d(-350px, 0, 0)'
  }

  return {
    middleRStyle
  }
}