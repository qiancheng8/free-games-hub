<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-slate-200 bg-white">
    <div class="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-500 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <div>© {{ year }} 喜加一 · 数据来自 Epic Games Store</div>
      <div class="flex gap-4">
        <a href="https://store.epicgames.com/zh-CN/free-games" target="_blank" rel="noopener" class="hover:text-brand">Epic 官方</a>
        <NuxtLink to="/history" class="hover:text-brand">历史归档</NuxtLink>
      </div>
    </div>
  </footer>
</template>
