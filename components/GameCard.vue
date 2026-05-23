<script setup lang="ts">
defineProps<{
  game: {
    id: string
    title: string
    description?: string
    image: string
    originalPrice?: string
    endDate: string
    startDate?: string
    slug: string
    url: string
    isCurrent?: boolean
  }
  upcoming?: boolean
}>()
</script>

<template>
  <article class="group rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition border border-slate-100">
    <NuxtLink :to="`/game/${game.slug}`" class="block">
      <div class="relative aspect-[16/9] overflow-hidden bg-slate-100">
        <img
          v-if="game.image"
          :src="game.image"
          :alt="game.title"
          loading="lazy"
          class="w-full h-full object-cover group-hover:scale-105 transition"
        />
        <span
          class="absolute top-2 left-2 px-2 py-0.5 text-xs rounded-md font-medium"
          :class="upcoming ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'"
        >
          {{ upcoming ? '即将免费' : '限免中' }}
        </span>
      </div>
    </NuxtLink>
    <div class="p-4">
      <h3 class="font-semibold text-base mb-1 line-clamp-1">{{ game.title }}</h3>
      <p v-if="game.description" class="text-sm text-slate-500 line-clamp-2 mb-3 min-h-[2.5rem]">
        {{ game.description }}
      </p>
      <div class="flex items-center justify-between">
        <Countdown
          :end-date="upcoming ? (game.startDate || game.endDate) : game.endDate"
          :prefix="upcoming ? '将于 ' : '剩余 '"
        />
        <a
          v-if="!upcoming"
          :href="game.url"
          target="_blank"
          rel="noopener"
          class="px-3 py-1 text-xs font-medium rounded-md bg-brand text-white hover:bg-brand-dark transition"
          @click.stop
        >
          立即领取
        </a>
        <span v-else class="text-xs text-slate-400">敬请期待</span>
      </div>
    </div>
  </article>
</template>
