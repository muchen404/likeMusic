import { usePlayerStore, PlayMode } from '../../stores/player'
export default function useMode() {
  const playerStore = usePlayerStore()
  const playMode = computed(() => (playerStore.playMode))
  const modeIcon = computed(() => {
    const playModeVal = playMode.value
    return playModeVal === PlayMode.sequence 
      ? 'icon-sequence' 
      : playModeVal === PlayMode.random 
        ? 'icon-random' : 'icon-loop'
  })

  const modeText = computed(() => {
    const playModeVal = playMode.value
    return playModeVal === PlayMode.sequence 
      ? '顺序播放' 
      : playModeVal === PlayMode.random 
        ? '随机播放' : '循环播放' 
  })

  function changeMode() {
    const mode = (playMode.value + 1) % 3
    playerStore.changeMode(mode)
  }

  return { modeIcon, modeText, changeMode }
}