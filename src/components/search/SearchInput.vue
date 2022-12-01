<script lang="ts" setup name="SearchInput">
import { debounce } from 'throttle-debounce'

// eslint-disable-next-line vue/require-prop-types
const props = withDefaults(defineProps<{
  modelValue?: string,
  placeholder?: string
}>(), {
  placeholder: '搜索歌曲、歌手',
  modelValue: ''
})
const emit = defineEmits(['update:modelValue'])

let query = computed({
  get() {
    return props.modelValue
  },
  set(value: string) {
    emitInputDebounce(value)
  }
})

function emitInput (value: string) {
  emit('update:modelValue', value.trim())
}
const emitInputDebounce = debounce(300, emitInput)

function clear() {
  query.value = ''
}

</script>

<template>
  <div class="search-input">
    <i class="icon-search" />
    <input
      v-model="query"
      :placeholder="placeholder"
      class="input-inner"
    >
    <i v-show="query" class="icon-dismiss" @click="clear" />
  </div>
</template>

<style lang="scss" scoped>
  .search-input {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 32px;
    background: $color-highlight-background;
    border-radius: 6px;
    .icon-search {
      font-size: 24px;
      color: $color-text-d;
    }
    .input-inner {
      flex: 1;
      margin: 0 5px;
      line-height: 18px;
      background: $color-highlight-background;
      color: $color-text;
      font-size: $font-size-medium;
      outline: 0;
      &::placeholder {
        color: $color-text-d;
      }
    }
    .icon-dismiss {
      font-size: 16px;
      color: $color-text-d;
    }
  }
</style>
