<script setup lang="ts">
const { public: cfg } = useRuntimeConfig()

useHead({
  titleTemplate: (title) => (title ? `${title} | ${cfg.siteName}` : cfg.siteName),
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <SiteHeader />
    <NuxtPage class="flex-1" />
    <SiteFooter />
  </div>
</template>
