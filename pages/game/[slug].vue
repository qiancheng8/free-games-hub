<script setup lang="ts">
import gamesData from '~/data/games.json'

const route = useRoute()
const { findBySlug } = useGames()

const game = findBySlug(route.params.slug as string)

if (!game) {
  throw createError({ statusCode: 404, statusMessage: '未找到该游戏', fatal: true })
}

const gameUrl = computed(() => {
  return game.url.replace(
    'https://store.epicgames.com/site/zh-CN/p/',
    'https://store.epicgames.com/p/'
  ).replace(
    'https://store.epicgames.com/zh-CN/p/',
    'https://store.epicgames.com/p/'
  )
})

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
        url: gameUrl,
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

const activeScreenshot = ref(0)
</script>

<template>
  <main class="max-w-6xl mx-auto px-4 py-8" v-if="game">
    <NuxtLink to="/" class="text-sm text-slate-500 hover:text-brand mb-4 inline-flex items-center gap-1">
      <Icon name="mdi:arrow-left" /> 返回
    </NuxtLink>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div class="rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
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
            <p v-if="game.seller" class="text-sm text-slate-500 mb-4 flex items-center gap-2">
              <Icon name="mdi:domain" class="w-4 h-4" />
              {{ game.seller }}
            </p>
            <p class="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 whitespace-pre-line">
              {{ game.description }}
            </p>
          </div>
        </div>

        <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm p-6">
          <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
            <Icon name="mdi:image-multiple" class="w-5 h-5" />
            游戏截图
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div
              v-for="i in 4"
              :key="i"
              class="aspect-video bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition border-2"
              :class="activeScreenshot === i - 1 ? 'border-brand' : 'border-transparent'"
              @click="activeScreenshot = i - 1"
            >
              <div class="w-full h-full flex items-center justify-center text-slate-400">
                <Icon name="mdi:image" class="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm p-6">
          <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
            <Icon name="mdi:information" class="w-5 h-5" />
            系统需求
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-medium text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-2">
                <Icon name="mdi:checkbox-blank-circle" class="w-3 h-3 text-amber-500" />
                最低配置
              </h3>
              <dl class="space-y-2 text-sm">
                <div class="flex">
                  <dt class="w-24 text-slate-500 shrink-0">操作系统</dt>
                  <dd class="text-slate-700 dark:text-slate-300">Windows 7</dd>
                </div>
                <div class="flex">
                  <dt class="w-24 text-slate-500 shrink-0">处理器</dt>
                  <dd class="text-slate-700 dark:text-slate-300">Intel i5 Sandy Bridge 2.5 Ghz</dd>
                </div>
                <div class="flex">
                  <dt class="w-24 text-slate-500 shrink-0">内存</dt>
                  <dd class="text-slate-700 dark:text-slate-300">4 GB RAM</dd>
                </div>
                <div class="flex">
                  <dt class="w-24 text-slate-500 shrink-0">显卡</dt>
                  <dd class="text-slate-700 dark:text-slate-300">DX10 兼容显卡</dd>
                </div>
                <div class="flex">
                  <dt class="w-24 text-slate-500 shrink-0">存储空间</dt>
                  <dd class="text-slate-700 dark:text-slate-300">1 GB</dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 class="font-medium text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-2">
                <Icon name="mdi:check-circle" class="w-3 h-3 text-emerald-500" />
                推荐配置
              </h3>
              <dl class="space-y-2 text-sm">
                <div class="flex">
                  <dt class="w-24 text-slate-500 shrink-0">操作系统</dt>
                  <dd class="text-slate-700 dark:text-slate-300">Windows 10</dd>
                </div>
                <div class="flex">
                  <dt class="w-24 text-slate-500 shrink-0">处理器</dt>
                  <dd class="text-slate-700 dark:text-slate-300">Intel i5 Kaby Lake 3.0 Ghz</dd>
                </div>
                <div class="flex">
                  <dt class="w-24 text-slate-500 shrink-0">内存</dt>
                  <dd class="text-slate-700 dark:text-slate-300">8 GB RAM</dd>
                </div>
                <div class="flex">
                  <dt class="w-24 text-slate-500 shrink-0">显卡</dt>
                  <dd class="text-slate-700 dark:text-slate-300">DX11 兼容显卡 1GB</dd>
                </div>
                <div class="flex">
                  <dt class="w-24 text-slate-500 shrink-0">存储空间</dt>
                  <dd class="text-slate-700 dark:text-slate-300">1 GB</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1 space-y-6">
        <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm p-6 sticky top-6">
          <div class="mb-4">
            <div class="flex items-baseline gap-2 mb-1">
              <span class="text-3xl font-bold text-emerald-500">免费</span>
              <span v-if="game.originalPrice" class="text-lg text-slate-400 line-through">
                {{ game.originalPrice }}
              </span>
            </div>
            <p class="text-sm text-slate-500">限时免费领取</p>
          </div>

          <a
            :href="gameUrl"
            target="_blank"
            rel="noopener"
            class="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand text-white rounded-lg font-medium hover:bg-brand-dark transition mb-6"
          >
            <Icon name="mdi:gift-outline" />
            前往 Epic 领取
          </a>

          <div class="space-y-4">
            <div>
              <h3 class="text-sm font-medium text-slate-500 mb-2">免费时间</h3>
              <dl class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <dt class="text-slate-500">开始</dt>
                  <dd class="font-mono text-slate-700 dark:text-slate-300">{{ fmt(game.startDate) }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-slate-500">结束</dt>
                  <dd class="font-mono text-slate-700 dark:text-slate-300">{{ fmt(game.endDate) }}</dd>
                </div>
              </dl>
            </div>

            <div class="pt-2 border-t border-slate-100 dark:border-slate-700">
              <div class="text-sm text-slate-500 mb-2">倒计时</div>
              <Countdown :end-date="game.endDate" />
            </div>

            <div class="pt-2 border-t border-slate-100 dark:border-slate-700">
              <h3 class="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
                <Icon name="mdi:tag" class="w-4 h-4" />
                类型
              </h3>
              <div class="flex flex-wrap gap-2">
                <span class="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 rounded">解谜</span>
                <span class="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 rounded">冒险</span>
                <span class="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 rounded">独立</span>
              </div>
            </div>

            <div class="pt-2 border-t border-slate-100 dark:border-slate-700">
              <h3 class="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
                <Icon name="mdi:star" class="w-4 h-4" />
                特性
              </h3>
              <div class="flex flex-wrap gap-2">
                <span class="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 rounded flex items-center gap-1">
                  <Icon name="mdi:account" class="w-3 h-3" /> 单人
                </span>
                <span class="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 rounded flex items-center gap-1">
                  <Icon name="mdi:cloud" class="w-3 h-3" /> 云存储
                </span>
                <span class="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 rounded flex items-center gap-1">
                  <Icon name="mdi:trophy" class="w-3 h-3" /> 成就
                </span>
              </div>
            </div>

            <div class="pt-2 border-t border-slate-100 dark:border-slate-700">
              <h3 class="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
                <Icon name="mdi:desktop-mac" class="w-4 h-4" />
                平台
              </h3>
              <div class="flex flex-wrap gap-2">
                <span class="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">Windows</span>
                <span class="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 rounded">macOS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
