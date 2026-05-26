<script setup lang="ts">
const links = [
  { to: '/', label: '本周免费' },
  { to: '/upcoming', label: '即将免费' },
  { to: '/history', label: '历史归档' },
  { to: '/tutorial', label: '领取教程' },
]

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <header class="sticky top-0 z-30 bg-white/85 dark:bg-slate-900/85 backdrop-blur border-b border-slate-200 dark:border-slate-700">
    <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-2 font-bold text-lg">
        <Icon name="mdi:gift-outline" class="text-brand text-2xl" />
        <span>喜加一</span>
      </NuxtLink>
      <div class="flex items-center gap-2">
        <nav class="flex items-center gap-1 text-sm">
          <NuxtLink
            v-for="l in links"
            :key="l.to"
            :to="l.to"
            class="px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            active-class="text-brand font-medium"
          >
            {{ l.label }}
          </NuxtLink>
        </nav>
        <button
          @click="toggleTheme"
          class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          :title="isDark ? '切换到亮色模式' : '切换到暗色模式'"
        >
          <Icon v-if="isDark" name="mdi:weather-sunny" class="text-xl" />
          <Icon v-else name="mdi:weather-night" class="text-xl" />
        </button>
      </div>
    </div>
  </header>
</template>
