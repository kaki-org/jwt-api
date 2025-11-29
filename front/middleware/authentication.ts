import {
  getRouteName,
  getRouteParams,
  isExcludedRoute,
} from '~/utils/middleware'

/**
 * 認証ミドルウェア
 * ログインが必要なページへのアクセス時に認証状態をチェックし、
 * 未認証の場合はログインページにリダイレクトする
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const appStore = useAppStore()
  const toastStore = useToastStore()

  // 型安全性を向上させるためのガード
  const routeName = getRouteName(to)
  if (!routeName) {
    return
  }

  // リダイレクトを必要としないパス（型安全性を向上）
  const notRedirectPaths: readonly string[] = ['account', 'project']
  if (isExcludedRoute(routeName, notRedirectPaths)) {
    return
  }

  // ログイン前ユーザー処理
  if (!authStore.loggedIn) {
    // ユーザー以外の値が存在する可能性があるので全てを削除する
    authStore.resetAuth()

    const msg = 'まずはログインしてください'
    console.log(msg, 'info')
    console.log(to)
    toastStore.showInfo(msg)

    // アクセスルート記憶（型安全性を向上）
    appStore.setRememberPath({
      name: routeName,
      params: getRouteParams(to),
    })

    return navigateTo('/login')
  }
})
