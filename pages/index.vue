<script setup lang="ts">
if (import.meta.server) {
  console.log('[DEBUG] Environment variables:', {
    NUXT_PUBLIC_SITE_URL: process.env.NUXT_PUBLIC_SITE_URL,
    GITHUB_PAGES: process.env.GITHUB_PAGES,
    NODE_ENV: process.env.NODE_ENV,
  })
}

const { currentEpic, currentSteam, upcoming } = useGames()
const config = useRuntimeConfig()

const epicTitles = (currentEpic || []).map(g => g?.title || '').filter(Boolean).join('、')
const steamTitles = (currentSteam || []).map(g => g?.title || '').filter(Boolean).join('、')
const allTitles = [epicTitles, steamTitles].filter(Boolean).join('、')

const siteUrl = (config.public?.siteUrl) || 'https://example.com'
const ogImage = (currentEpic?.[0]?.image) || (currentSteam?.[0]?.image) || ''

useSeoMeta({
  title: '免费游戏汇总',
  description: allTitles
    ? `限时免费游戏汇总：${allTitles}`
    : '聚合各平台限时免费游戏，包含 Epic、Steam 等。',
  ogTitle: `免费游戏汇总 - ${allTitles || '加载中'}`,
  ogDescription: allTitles ? `限免汇总：${allTitles}` : '追踪各平台免费游戏',
  ogImage,
  ogUrl: siteUrl,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <main class="max-w-6xl mx-auto px-4 py-8">
    <section class="mb-12">
      <div class="flex items-baseline justify-between mb-2">
        <h1 class="text-2xl md:text-3xl font-bold">免费游戏汇总</h1>
      </div>
      <p class="text-slate-500 mb-6">
        聚合各平台限时免费游戏，过期需原价购买，趁早领取入库。
      </p>
    </section>

    <section class="mb-12">
      <div class="flex items-baseline justify-between mb-4">
        <h2 class="text-xl font-bold flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-slate-800 dark:bg-slate-200"></span>
          Epic Games Store
        </h2>
        <span class="text-sm text-slate-500">每周四晚 23:00 更新</span>
      </div>
      <div v-if="currentEpic && currentEpic.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <GameCard v-for="g in currentEpic" :key="g.id" :game="{ ...g, platform: 'Epic' }" />
      </div>
      <div v-else class="rounded-lg bg-white border p-6 text-center text-slate-500">
        本周 Epic 暂无免费游戏
      </div>
    </section>

    <section class="mb-12">
      <div class="flex items-baseline justify-between mb-4">
        <h2 class="text-xl font-bold flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-blue-600"></span>
          Steam
        </h2>
        <NuxtLink to="/steam" class="text-sm text-brand hover:underline">查看全部 →</NuxtLink>
      </div>
      <div v-if="currentSteam && currentSteam.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <GameCard v-for="g in currentSteam.slice(0, 3)" :key="g.id" :game="g" />
      </div>
      <div v-else class="rounded-lg bg-white border p-6 text-center text-slate-500">
        暂无 Steam 免费游戏
      </div>
    </section>

    <section v-if="upcoming && upcoming.length">
      <div class="flex items-baseline justify-between mb-4">
        <h2 class="text-xl font-bold">即将免费</h2>
        <NuxtLink to="/upcoming" class="text-sm text-brand hover:underline">查看全部 →</NuxtLink>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <GameCard v-for="g in upcoming.slice(0, 3)" :key="g.id" :game="g" upcoming />
      </div>
    </section>
  </main>
</template>
