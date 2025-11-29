<template>
  <v-app>
    <BeforeLoginAppBar />
    <v-main>
      <AppToaster />
      <NuxtPage />
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script setup lang="ts">
// Nuxt 4.x対応のログイン前レイアウト
// Composition API + definePageMeta形式に最適化

// ミドルウェアの設定
definePageMeta({
  middleware: ['logged-in-redirect'],
})
</script>
