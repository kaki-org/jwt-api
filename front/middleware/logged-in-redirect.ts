/**
 * ログイン済みユーザーリダイレクトミドルウェア
 * ログイン済みユーザーが特定のページにアクセスした場合にホームページにリダイレクトする
 */
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const appStore = useAppStore()

  // ログイン済ユーザーをリダイレクトさせる
  const redirectPaths: string[] = appStore.loggedIn.redirectPaths

  if (authStore.loggedIn && redirectPaths.includes(to.name as string)) {
    return navigateTo(appStore.loggedIn.homePath)
  }
})
