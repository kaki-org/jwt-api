import { getRouteName, getRouteParams, handleMiddlewareError } from '~/utils/middleware'

/**
 * サイレントトークンリフレッシュミドルウェア
 * ユーザーが存在し、トークンが期限切れの場合に自動的にトークンをリフレッシュする
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const appStore = useAppStore()
  const toastStore = useToastStore()
  const { $dev } = useNuxtApp()

  // トークンリフレッシュが必要かチェック
  if (authStore.isExistUserAndExpired) {
    if ($dev) {
      console.log('Execute silent refresh!!')
    }

    try {
      await authStore.refreshToken()
    } catch (error) {
      handleMiddlewareError(error, 'silent-refresh-token')

      // Piniaの初期化(セッションはサーバで削除済み)
      authStore.resetAuth()

      // 型安全性を向上させるためのガード
      const routeName = getRouteName(to)

      if (routeName === 'logout') {
        return navigateTo('/')
      } else {
        const msg = 'セッションの有効期限が切れました。もう一度ログインしてください'

        // トースター出力
        toastStore.showError(msg)

        // アクセスルート記憶（型安全性を向上）
        if (routeName) {
          appStore.setRememberPath({
            name: routeName,
            params: getRouteParams(to)
          })
        }

        return navigateTo('/login')
      }
    }
  }
})
