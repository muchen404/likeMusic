<script lang="ts" setup name="Message">
  const visible = ref(false)
  const timer = ref<number>()

  const props = withDefaults(defineProps<{
    delay?: number
  }>(), {
    delay: 2000
  })

  function show() {
    visible.value = true
    clearTimeout(timer.value)
    timer.value = setTimeout(() => {
      hide()
    }, props.delay)
  }

  function hide() {
    clearTimeout(timer.value)
    visible.value = false
  }

  defineExpose({
    show
  })
</script>


<template>
  <teleport to="body"> 
    <transition name="slide-down">
      <div v-show="visible" class="message" @click="hide">
        <slot />
      </div>
    </transition>
  </teleport>
</template>


<style scoped lang="scss">
  .message {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 400;
    background: $color-dialog-background;

    &.slide-down-enter-active, &.slide-down-leave-active {
      transition: all 0.3s
    }

    &.slide-down-enter-from, &.slide-down-leave-to {
      transform: translate3d(0, -100%, 0)
    }
  }
</style>