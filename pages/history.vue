<script setup lang="ts">
const { history } = useGames()

useSeoMeta({
  title: '历史免费游戏归档',
  description: `往期 Epic Games 免费游戏归档，已收录 ${history.length} 款。`,
})

const query = ref('')
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return history
  return history.filter(g => g.title.toLowerCase().includes(q))
})

const formatGameUrl = (url: string) => {
  return url.replace(
    'https://store.epicgames.com/site/zh-CN/p/',
    'https://store.epicgames.com/p/'
  ).replace(
    'https://store.epicgames.com/zh-CN/p/',
    'https://store.epicgames.com/p/'
  )
}

const fmt = (iso: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
</script>

<template>
  <main class="max-w-6xl mx-auto px-4 py-8">
    <div class="flex items-baseline justify-between mb-2">
      <h1 class="text-2xl md:text-3xl font-bold">历史免费游戏</h1>
      <span class="text-sm text-slate-500">共 {{ history.length }} 款</span>
    </div>
    <p class="text-slate-500 mb-6">Epic Games 商店过往的免费赠送记录。</p>

    <input
      v-model="query"
      type="search"
      placeholder="搜索游戏名..."
      class="w-full md:w-80 px-4 py-2 mb-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-brand focus:outline-none"
    />

    <div v-if="filtered.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <a
        v-for="g in filtered"
        :key="g.id"
        :href="formatGameUrl(g.url)"
        target="_blank"
        rel="noopener"
        class="group block rounded-lg overflow-hidden bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-md transition"
      >
        <div class="aspect-[16/9] bg-slate-100 dark:bg-slate-700 overflow-hidden">
          <img v-if="g.image" :src="g.image" :alt="g.title" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition" />
        </div>
        <div class="p-3">
          <div class="text-sm font-medium line-clamp-1">{{ g.title }}</div>
          <div class="text-xs text-slate-400 dark:text-slate-500 mt-1">{{ fmt(g.endDate) }} 截止</div>
        </div>
      </a>
    </div>
    <div v-else class="rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400">
      没有匹配的游戏
    </div>
  </main>
</template>
