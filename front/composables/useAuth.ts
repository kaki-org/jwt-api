import type { Ref } from 'vue'

interface LoginCredentials {
  email: string
  password: string
}

interface User {
  sub: string
  email: string
  name: string
  [key: string]: unknown
}

interface LoginResponse {
  token: string
  expires: number
  user: User
}

interface JWTPayload {
  sub: string
  exp: number
  iat: number
  email?: string
  name?: string
  [key: string]: unknown
}

/**
 * 認証関連のロジックを提供するコンポーザブル
 * ログイン・ログアウト・トークン管理の機能を提供する
 */
export const useAuth = () => {
  const authStore = useAuthStore()
  const userStore = useUserStore()
  const toastStore = useToastStore()

  // 認証状態の取得
  const isAuthenticated: Ref<boolean> = computed(
    () => authStore.isAuthenticated
  )
  const isExpired: Ref<boolean> = computed(() => authStore.isExpired)
  const loggedIn: Ref<boolean> = computed(() => authStore.loggedIn)
  const currentUser: Ref<User | null> = computed(() => userStore.current)
  const token: Ref<string | null> = computed(() => authStore.token)
  const payload: Ref<JWTPayload | Record<string, unknown>> = computed(
    () => authStore.payload
  )

  /**
   * ログイン処理
   * @param credentials ログイン認証情報
   * @returns ログインレスポンス
   */
  const login = async (
    credentials: LoginCredentials
  ): Promise<LoginResponse> => {
    try {
      const response = await authStore.login(credentials)

      // ログイン成功時のトースト表示
      toastStore.showSuccess('ログインしました')

      return response
    } catch (error) {
      // ログインエラー時のトースト表示
      toastStore.showError('ログインに失敗しました')
      throw error
    }
  }

  /**
   * ログアウト処理
   */
  const logout = async (): Promise<void> => {
    try {
      await authStore.logout()

      // ログアウト成功時のトースト表示
      toastStore.showSuccess('ログアウトしました')

      // ログインページにリダイレクト
      await navigateTo('/login')
    } catch {
      // ログアウトエラー時のトースト表示（ただし、認証状態はクリアされている）
      toastStore.showError(
        'ログアウト処理でエラーが発生しましたが、ログアウトは完了しました'
      )

      // エラーが発生してもログインページにリダイレクト
      await navigateTo('/login')
    }
  }

  /**
   * トークンリフレッシュ処理
   * @returns リフレッシュ成功可否
   */
  const refreshToken = async (): Promise<boolean> => {
    try {
      await authStore.refreshToken()
      return true
    } catch (error) {
      console.warn('Token refresh failed:', error)
      return false
    }
  }

  /**
   * 自動トークンリフレッシュの確認と実行
   * @returns 認証状態（リフレッシュ後）
   */
  const checkAndRefreshToken = async (): Promise<boolean> => {
    return await authStore.checkAndRefreshToken()
  }

  /**
   * 認証状態の完全リセット
   */
  const resetAuth = (): void => {
    authStore.resetAuth()
  }

  /**
   * 認証が必要なページへのアクセス制御
   * @param redirectTo リダイレクト先（デフォルト: /login）
   */
  const requireAuth = async (redirectTo: string = '/login'): Promise<void> => {
    if (!loggedIn.value) {
      // 認証が必要なメッセージを表示
      toastStore.showInfo('まずはログインしてください')

      // ログインページにリダイレクト
      await navigateTo(redirectTo)
    }
  }

  /**
   * 認証済みユーザーのログインページアクセス制御
   * @param redirectTo リダイレクト先（デフォルト: /projects）
   */
  const redirectIfAuthenticated = async (
    redirectTo: string = '/projects'
  ): Promise<void> => {
    if (loggedIn.value) {
      // 既にログイン済みの場合はプロジェクトページにリダイレクト
      await navigateTo(redirectTo)
    }
  }

  /**
   * トークンの有効期限チェック
   * @returns 有効期限までの残り時間（ミリ秒）
   */
  const getTokenTimeRemaining = (): number => {
    if (!authStore.expires) return 0
    return Math.max(0, authStore.expires - Date.now())
  }

  /**
   * トークンの有効期限が近いかどうかをチェック
   * @param thresholdMinutes 閾値（分）デフォルト: 5分
   * @returns 有効期限が近い場合はtrue
   */
  const isTokenExpiringSoon = (thresholdMinutes: number = 5): boolean => {
    const remaining = getTokenTimeRemaining()
    const threshold = thresholdMinutes * 60 * 1000 // 分をミリ秒に変換
    return remaining > 0 && remaining < threshold
  }

  return {
    // 状態
    isAuthenticated: readonly(isAuthenticated),
    isExpired: readonly(isExpired),
    loggedIn: readonly(loggedIn),
    currentUser: readonly(currentUser),
    token: readonly(token),
    payload: readonly(payload),

    // アクション
    login,
    logout,
    refreshToken,
    checkAndRefreshToken,
    resetAuth,
    requireAuth,
    redirectIfAuthenticated,

    // ユーティリティ
    getTokenTimeRemaining,
    isTokenExpiringSoon,
  }
}
