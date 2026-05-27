<script setup lang="ts">
const { currentSteam } = useGames()
const { public: cfg } = useRuntimeConfig()

const titles = currentSteam.map(g => g.title).join('、')
useSeoMeta({
  title: 'Steam 免费游戏',
  description: currentSteam.length
    ? `Steam 免费游戏限时领取：${titles}。数据来源：GamerPower API。`
    : '聚合 Steam 商店限时免费游戏，实时更新。',
  ogTitle: `Steam 免费游戏 - ${titles || '加载中'}`,
  ogDescription: titles ? `Steam 限免：${titles}` : '追踪 Steam 免费游戏',
  ogImage: currentSteam[0]?.image || '',
  ogUrl: `${cfg.siteUrl}/steam`,
  twitterCard: 'summary_large_image',
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Steam 免费游戏',
        itemListElement: currentSteam.map((g, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'VideoGame',
            name: g.title,
            description: g.description,
            image: g.image,
            url: g.url,
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
              validThrough: g.endDate,
            },
          },
        })),
      }),
    },
  ],
})
</script>

<template>
  <main class="max-w-6xl mx-auto px-4 py-8">
    <section class="mb-10">
      <div class="flex items-baseline justify-between mb-2">
        <h1 class="text-2xl md:text-3xl font-bold">Steam 免费游戏</h1>
        <span class="text-sm text-slate-500">数据来源: GamerPower</span>
      </div>
      <p class="text-slate-500 mb-6">
        Steam 商店限时免费游戏，过期需原价购买，趁早领取入库。
      </p>

      <div v-if="currentSteam.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <GameCard v-for="g in currentSteam" :key="g.id" :game="g" />
      </div>
      <div v-else class="rounded-lg bg-white border p-8 text-center text-slate-500">
        暂无 Steam 免费游戏，请稍后再查看。
      </div>
    </section>

    <section class="rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6">
      <h2 class="text-lg font-semibold mb-3 flex items-center gap-2">
        <Icon name="mdi:information" class="w-5 h-5 text-slate-500" />
        关于数据
      </h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        本页面数据来自 <a href="https://www.gamerpower.com/" target="_blank" rel="noopener" class="text-brand hover:underline">GamerPower</a> 公开 API。
        数据包含免费游戏信息及截止时间，实际可用性请以 Steam 商店为准。
      </p>
    </section>
  </main>
</template>
