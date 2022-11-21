<script setup lang="ts">
import MyHeader from '@/components/header/MyHeader.vue'
import MyTab from '@/components/tab/MyTab.vue'
import Player from '@/components/player/player.vue'
</script>

<template>
  <my-header />
  <my-tab />
  <router-view />
  <Player />
</template>