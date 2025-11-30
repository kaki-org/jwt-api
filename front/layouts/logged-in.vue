<template>
  <v-app>
    <LoggedInAppBar />
    <v-main>
      <NuxtPage />
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script setup lang="ts">
// Nuxt 4.x対応のログイン後レイアウト
// Composition API + definePageMeta形式に最適化

// ミドルウェアの設定
definePageMeta({
  middleware: ['authentication'],
})
</script>
