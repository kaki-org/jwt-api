import { getRouteName, isExcludedRoute } from '~/utils/middleware'

/**
 * ログイン済みユーザーリダイレクトミドルウェア
 * ログイン済みユーザーが特定のページにアクセスした場合にホームページにリダイレクトする
 */
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const appStore = useAppStore()

  // 型安全性を向上させるためのガード
  const routeName = getRouteName(to)
  if (!routeName) {
    return
  }

  // ログイン済ユーザーをリダイレクトさせる
  const redirectPaths: readonly string[] = appStore.loggedIn.redirectPaths

  if (authStore.loggedIn && isExcludedRoute(routeName, redirectPaths)) {
    return navigateTo(appStore.loggedIn.homePath)
  }
})
