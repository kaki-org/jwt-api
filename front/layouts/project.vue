<template>
  <v-app>
    <!-- tool bar -->
    <LoggedInAppBar clipped-left>
      <template #navigation-toggle-button>
        <v-app-bar-nav-icon @click="toggleDrawer" />
      </template>
    </LoggedInAppBar>

    <!-- navigation drawer-->
    <ProjectNavigationDrawer v-model:drawer="drawer" />

    <!-- main content -->
    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
// Nuxt 4.x対応のプロジェクトレイアウト
// Composition API + definePageMeta形式に最適化

// ミドルウェアの設定
definePageMeta({
  middleware: ['authentication', 'get-project-list', 'get-project-current']
})

// リアクティブな状態管理
const drawer = ref<boolean | null>(null)

// ドロワーの開閉を切り替える関数
const toggleDrawer = () => {
  drawer.value = !drawer.value
}

// レスポンシブ対応: 画面サイズに応じてドロワーの初期状態を設定
const isLargeScreen = ref(false)

// メディアクエリを使用した画面サイズ判定
const updateScreenSize = () => {
  if (process.client) {
    isLargeScreen.value = window.matchMedia('(min-width: 1280px)').matches
  }
}

onMounted(() => {
  updateScreenSize()
  
  // 大画面では初期状態でドロワーを開く
  drawer.value = isLargeScreen.value
  
  // 画面サイズ変更の監視
  if (process.client) {
    const mediaQuery = window.matchMedia('(min-width: 1280px)')
    const handleChange = (e: MediaQueryListEvent) => {
      isLargeScreen.value = e.matches
      drawer.value = e.matches
    }
    
    mediaQuery.addEventListener('change', handleChange)
    
    // クリーンアップ
    onUnmounted(() => {
      mediaQuery.removeEventListener('change', handleChange)
    })
  }
})
</script>
