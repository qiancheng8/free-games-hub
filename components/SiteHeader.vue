<script setup lang="ts">
const links = [
  { to: '/', label: '本周免费' },
  { to: '/upcoming', label: '即将免费' },
  { to: '/history', label: '历史归档' },
]
</script>

<template>
  <header class="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-slate-200">
    <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-2 font-bold text-lg">
        <Icon name="mdi:gift-outline" class="text-brand text-2xl" />
        <span>喜加一</span>
      </NuxtLink>
      <nav class="flex items-center gap-1 text-sm">
        <NuxtLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          class="px-3 py-1.5 rounded-md hover:bg-slate-100 transition"
          active-class="text-brand font-medium"
        >
          {{ l.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
