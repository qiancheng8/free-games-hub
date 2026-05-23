<script setup lang="ts">
const props = defineProps<{
  endDate: string
  prefix?: string
}>()

const now = useNow({ interval: 60_000 })

const text = computed(() => {
  const diff = new Date(props.endDate).getTime() - now.value.getTime()
  if (diff <= 0) return '已结束'
  const d = Math.floor(diff / 86_400_000)
  const h = Math.floor((diff % 86_400_000) / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  if (d > 0) return `${d} 天 ${h} 小时`
  if (h > 0) return `${h} 小时 ${m} 分`
  return `${m} 分钟`
})

const tone = computed(() => {
  const diff = new Date(props.endDate).getTime() - now.value.getTime()
  if (diff <= 0) return 'text-slate-400'
  if (diff < 24 * 3_600_000) return 'text-red-500'
  if (diff < 3 * 24 * 3_600_000) return 'text-orange-500'
  return 'text-emerald-600'
})
</script>

<template>
  <span class="text-xs font-mono" :class="tone">
    <Icon name="mdi:clock-outline" class="inline mr-0.5" />
    {{ prefix }}{{ text }}
  </span>
</template>
