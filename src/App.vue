<script setup lang="ts">
import MyHeader from "@/components/header/MyHeader.vue";
import MyTab from "@/components/tab/MyTab.vue";
</script>

<template>
  <my-header></my-header>
  <my-tab></my-tab>
  <router-view></router-view>
</template>

<style scoped></style>
