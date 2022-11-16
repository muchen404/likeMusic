
<!-- <script setup lang="ts">
  import { ref } from 'vue'
  const title = ref('正在载入...')

  const setTitle = (value: string) => {
    title.value = value
  }
</script> -->


<script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({
    name: 'Loading',
    data() {
      return {
        title: '正在载入...'
      }
    },
    methods: {
      setTitle(title: string) {
        this.title = title
      }
    }
  })
</script>

<template>
  <div class="loading">
    <div class="loading-content">
      <img
        width="24"
        height="24"
        src="./loading.gif"
      >
      <p class="desc">
        {{ title }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    .loading-content {
      text-align: center;
      .desc {
        line-height: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
      }
    }
  }
</style>
