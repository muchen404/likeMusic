<script setup lang="ts">
import MyHeader from '@/components/header/MyHeader.vue'
import MyTab from '@/components/tab/MyTab.vue'
import Player from '@/components/player/Player.vue'
import { usePlayerStore } from './stores/player'
const playerStore = usePlayerStore()
const viewStyle = computed(() => {
  const bottom = playerStore.playList.length ? '60px' : '0'
  return {
    bottom
  }
})
</script>

<template>
  <my-header />
  <my-tab />
  <router-view v-slot="{Component}" :style="viewStyle">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <router-view 
    v-slot="{ Component }" 
    name="user" 
    :style="viewStyle"
  >
    <transition appear name="slide">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
  <Player />
</template>