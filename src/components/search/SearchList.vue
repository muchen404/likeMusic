<script lang="ts" setup name="SearchList">
const props = withDefaults(defineProps<{
  searches?: string[]
}>(), {
  searches: () => ([])
})
const emit = defineEmits(['select', 'delete'])

function selectItem (item: string) {
  emit('select', item)
}

function deleteItem(item: string) {
  emit('delete', item)
}
</script>

<template>
  <div class="search-list">
    <transition-group name="list" tag="ul">
      <li 
        v-for="item in searches" 
        :key="item" 
        class="search-item"
        @click="selectItem(item)"
      >
        <span class="text">{{ item }}</span>
        <span class="icon" @click.stop="deleteItem(item)">
          <i class="icon-delete" />
        </span>
      </li>
    </transition-group>
  </div>
</template>

<style lang="scss" scoped>
.search-list {
  .search-item {
    display: flex;
    align-items: center;
    height:40px;
    overflow: hidden;
    .text {
      flex: 1;
      color: $color-text-l;
    }
    .icon {
      @include extend-click();
      .icon-delete {
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
  }
}
</style>