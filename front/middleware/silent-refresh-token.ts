/**
 * サイレントトークンリフレッシュミドルウェア
 * ユーザーが存在し、トークンが期限切れの場合に自動的にトークンをリフレッシュする
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const appStore = useAppStore()
  const toastStore = useToastStore()
  const { $dev } = useNuxtApp()

  if (authStore.isExistUserAndExpired) {
    if ($dev) {
      console.log('Execute silent refresh!!')
    }

    try {
      await authStore.refreshToken()
    } catch (error) {
      // Piniaの初期化(セッションはサーバで削除済み)
      authStore.resetAuth()

      if (to.name === 'logout') {
        return navigateTo('/')
      } else {
        const msg: string = 'セッションの有効期限が切れました。' +
                           'もう一度ログインしてください'
        // トースター出力
        toastStore.showError(msg)
        // アクセスルート記憶
        appStore.setRememberPath({
          name: to.name as string,
          params: to.params as Record<string, any>
        })
        return navigateTo('/login')
      }
    }
  }
})
