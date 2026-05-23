<script setup lang="ts">
const { upcoming } = useGames()

useSeoMeta({
  title: '即将免费的 Epic 游戏',
  description: '查看下周即将免费的 Epic Games 游戏列表，提前关注，到期开领。',
})
</script>

<template>
  <main class="max-w-6xl mx-auto px-4 py-8">
    <h1 class="text-2xl md:text-3xl font-bold mb-2">即将免费</h1>
    <p class="text-slate-500 mb-6">下一批将在 Epic Games 商店免费的游戏。</p>

    <div v-if="upcoming.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <GameCard v-for="g in upcoming" :key="g.id" :game="g" upcoming />
    </div>
    <div v-else class="rounded-lg bg-white border p-8 text-center text-slate-500">
      暂无预告，Epic 一般在每周三公布下周免费游戏。
    </div>
  </main>
</template>
