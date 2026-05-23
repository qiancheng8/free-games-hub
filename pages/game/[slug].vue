<script setup lang="ts">
import gamesData from '~/data/games.json'

const route = useRoute()
const { findBySlug } = useGames()

const game = findBySlug(route.params.slug as string)

if (!game) {
  throw createError({ statusCode: 404, statusMessage: '未找到该游戏', fatal: true })
}

useSeoMeta({
  title: `${game.title} - 免费领取`,
  description: game.description || `${game.title} 现在可在 Epic Games 商店免费领取。`,
  ogTitle: `${game.title} 免费领取中`,
  ogDescription: game.description,
  ogImage: game.image,
  twitterCard: 'summary_large_image',
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        name: game.title,
        description: game.description,
        image: game.image,
        url: game.url,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'CNY',
          availability: 'https://schema.org/InStock',
          validThrough: game.endDate,
        },
      }),
    },
  ],
})

const fmt = (iso: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
</script>

<template>
  <main class="max-w-4xl mx-auto px-4 py-8" v-if="game">
    <NuxtLink to="/" class="text-sm text-slate-500 hover:text-brand mb-4 inline-flex items-center gap-1">
      <Icon name="mdi:arrow-left" /> 返回
    </NuxtLink>

    <div class="rounded-xl overflow-hidden bg-white border border-slate-100 shadow-sm">
      <div class="relative aspect-[16/9] bg-slate-100">
        <img v-if="game.image" :src="game.image" :alt="game.title" class="w-full h-full object-cover" />
        <span
          class="absolute top-3 left-3 px-3 py-1 text-sm rounded-md font-medium"
          :class="game.isCurrent ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'"
        >
          {{ game.isCurrent ? '限免中' : '即将免费' }}
        </span>
      </div>
      <div class="p-6">
        <h1 class="text-2xl md:text-3xl font-bold mb-3">{{ game.title }}</h1>
        <p v-if="game.seller" class="text-sm text-slate-500 mb-4">开发商 / 发行：{{ game.seller }}</p>
        <p class="text-slate-700 leading-relaxed mb-6 whitespace-pre-line">
          {{ game.description }}
        </p>

        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <dt class="text-slate-500">开始时间</dt>
            <dd class="font-mono">{{ fmt(game.startDate) }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">结束时间</dt>
            <dd class="font-mono">{{ fmt(game.endDate) }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">倒计时</dt>
            <dd><Countdown :end-date="game.endDate" /></dd>
          </div>
        </dl>

        <a
          :href="game.url"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-lg font-medium hover:bg-brand-dark transition"
        >
          <Icon name="mdi:gift-outline" />
          前往 Epic 领取
        </a>
      </div>
    </div>
  </main>
</template>
