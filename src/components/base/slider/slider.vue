<script setup lang="ts">
import { ref } from 'vue'
import useSlider from './use-slider'
import type { SliderItem } from '@/types/index'

const rootRef = ref(null)
const { currentPageIndex } = useSlider(rootRef)
defineProps<{
  sliders: SliderItem[]
}>()
</script>

<template>
  <div
    ref="rootRef"
    class="slider"
  >
    <div class="slider-group">
      <div
        v-for="item in sliders"
        :key="item.id"
        class="slider-page"
      >
        <a :href="item.link">
          <img :src="item.pic">
        </a>
      </div>
    </div>
    <div class="dots-wrapper">
      <span
        v-for="(item, index) in sliders"
        :key="item.id"
        class="dot"
        :class="{'active': currentPageIndex === index}"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.slider {
  min-height: 1px;
  font-size: 0;
  touch-action: pan-y;

  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    .slider-page {
      display: inline-block;
      transform: translate3d(0, 0, 0);
      backface-visibility: hidden;

      a {
        display: block;
        width: 100%;
      }

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .dots-wrapper {
    position: absolute;
    left: 50%;
    bottom: 12px;
    line-height: 12px;
    transform: translateX(-50%);

    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $color-text-l;

      &.active {
        width: 20px;
        border-radius: 5px;
        background: $color-text-ll;
      }
    }
  }
}
</style>