
<script lang="ts" setup name="ProgressBar">
  const progressBtnWidth = 16

  const props = withDefaults(defineProps<{
    progress?: number
  }>(), {
    progress: 0
  })

  const emit = defineEmits(['progress-changing', 'progress-changed'])

  interface ProgressTouch {
    x1: number
    beginWidth: number
  }

  const touch: ProgressTouch = {x1: 0, beginWidth: 0}
  const offset = ref(0)
  const progressRef = ref<HTMLElement | null>(null)
  const progressInnerRef = ref<HTMLElement | null>(null)
  const progress = computed(() => (props.progress))
  const progressStyle = computed(() => (`width: ${offset.value}px`))
  const btnStyle = computed(() => (`transform:translate3d(${offset.value}px, 0, 0)`))

  watch(progress, newProgress => {
    setOffset(newProgress)
  })

  function onTouchStart(e: TouchEvent) {
    touch.x1 = e.touches[0].pageX
    touch.beginWidth = (progressInnerRef.value as HTMLElement).clientWidth
  }
  function onTouchMove(e: TouchEvent) {
    const delta = e.touches[0].pageX - touch.x1
    const tempWidth = touch.beginWidth + delta
    const barWidth = (progressRef.value as HTMLElement).clientWidth - progressBtnWidth
    const progress = Math.min(1, Math.max(tempWidth / barWidth, 0))
    offset.value = barWidth * progress
    emit('progress-changing', progress)
  }
  function onTouchEnd() {
    const barWidth = (progressRef.value as HTMLElement).clientWidth - progressBtnWidth
    const progress = (progressInnerRef.value as HTMLElement).clientWidth / barWidth
    emit('progress-changed', progress)
  }
  function onClick(e: MouseEvent) {
    const rect = (progressRef.value as HTMLElement).getBoundingClientRect()
    const offsetWidth = e.pageX - rect.left
    const barWidth = (progressRef.value as HTMLElement).clientWidth - progressBtnWidth
    const progress = offsetWidth / barWidth
    emit('progress-changed', progress)
  }
  function setOffset(progress: number) {
    // 这里是progress属性状态变化才会执行，所以肯定可以拿到progressRef
    const barWidth = (progressRef.value as HTMLElement).clientWidth - progressBtnWidth
    offset.value = barWidth * progress
  }

  defineExpose({
    setOffset
  })
</script>

<template>
  <div ref="progressRef" class="progress-bar" @click="onClick">
    <div class="bar-inner">
      <div ref="progressInnerRef" class="progress" :style="progressStyle" />
      <div 
        class="progress-btn-wrapper" 
        :style="btnStyle" 
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .progress-bar {
    height: 30px;
    .bar-inner {
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);
      .progress {
        position: absolute;
        height: 100%;
        background: $color-theme;
      }
      .progress-btn-wrapper {
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn {
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid $color-text;
          border-radius: 50%;
          background: $color-theme;
        }
      }
    }
  }
</style>