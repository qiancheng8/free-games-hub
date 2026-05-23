<script setup lang="ts">
const { current, upcoming } = useGames()
const { public: cfg } = useRuntimeConfig()

const titles = current.map(g => g.title).join('、')
useSeoMeta({
  title: '本周 Epic 免费游戏',
  description: current.length
    ? `本周 Epic Games 商店免费领取：${titles}。每周四晚 23:00 更新，限时免费，过期失效。`
    : '聚合 Epic Games 商店每周免费游戏，每周四晚 23:00 更新。',
  ogTitle: `本周 Epic 免费游戏 - ${titles || '加载中'}`,
  ogDescription: titles ? `本周限免：${titles}` : '每周追踪 Epic 免费游戏',
  ogImage: current[0]?.image || '',
  ogUrl: cfg.siteUrl,
  twitterCard: 'summary_large_image',
})

// JSON-LD 结构化数据
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: '本周 Epic 免费游戏',
        itemListElement: current.map((g, i) => ({
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
              priceCurrency: 'CNY',
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
        <h1 class="text-2xl md:text-3xl font-bold">本周 Epic 免费游戏</h1>
        <span class="text-sm text-slate-500">每周四晚 23:00 更新</span>
      </div>
      <p class="text-slate-500 mb-6">
        Epic Games 商店每周送出限时免费游戏，过期需原价购买，趁早领取入库。
      </p>

      <div v-if="current.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <GameCard v-for="g in current" :key="g.id" :game="g" />
      </div>
      <div v-else class="rounded-lg bg-white border p-8 text-center text-slate-500">
        本周暂无免费游戏，请稍后再查看。
      </div>
    </section>

    <section v-if="upcoming.length">
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
