import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import { useUserStore } from './user'
import { useProjectStore } from './project'

interface JWTPayload {
  sub: string
  exp: number
  iat: number
  email?: string
  name?: string
  [key: string]: any
}

interface User {
  sub: string
  email: string
  name: string
  [key: string]: any
}

interface AuthState {
  token: string | null
  expires: number
  payload: JWTPayload | Record<string, any>
}

interface LoginResponse {
  token: string
  expires: number
  user: User
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    expires: 0,
    payload: {},
  }),

  getters: {
    // 認証状態の確認（トークンが存在し、有効期限内）
    isAuthenticated: (state): boolean => {
      return state.token !== null && new Date().getTime() < state.expires
    },
    
    // トークンの有効期限切れ確認
    isExpired: (state): boolean => {
      return state.expires > 0 && new Date().getTime() >= state.expires
    },

    // ユーザーが存在するかどうか
    isExistUser(): boolean {
      const userStore = useUserStore()
      const user = userStore.current
      return !!(user?.sub && this.payload.sub && user.sub === this.payload.sub)
    },

    // ユーザーが存在し、かつ有効期限切れの場合
    isExistUserAndExpired(): boolean {
      return this.isExistUser && !this.isAuthenticated
    },

    // ログイン状態（ユーザーが存在し、かつ有効期限内）
    loggedIn(): boolean {
      return this.isExistUser && this.isAuthenticated
    },
  },

  actions: {
    // トークンを設定
    setToken(token: string | null) {
      this.token = token
    },

    // 有効期限を設定（秒をミリ秒に変換）
    setExpires(expires: number) {
      this.expires = expires ? expires * 1000 : 0
    },

    // JWTペイロードを設定
    setPayload(payload: JWTPayload | Record<string, unknown>) {
      this.payload = payload || {}
    },

    // 認証情報を一括設定
    setAuth({ token, expires, user }: LoginResponse) {
      const exp = expires * 1000
      const jwtPayload = token ? jwtDecode<JWTPayload>(token) : {}

      this.token = token
      this.expires = exp
      this.payload = jwtPayload

      // ユーザーストアにユーザー情報を設定
      const userStore = useUserStore()
      userStore.setCurrentUser(user)
    },

    // 認証情報をクリア
    clearAuth() {
      this.token = null
      this.expires = 0
      this.payload = {}
    },

    // ログイン処理
    async login(credentials: { email: string; password: string }) {
      const { post } = useApi()
      const response = await post<LoginResponse>('/api/v1/auth_token', credentials)
      this.setAuth(response)
      return response
    },

    // ログアウト処理
    async logout() {
      try {
        const { delete: del } = useApi()
        // サーバーサイドでのログアウト処理（401エラーを許容）
        await del('/api/v1/auth_token', {
          onResponseError({ response }) {
            // 401エラーは正常なレスポンスとして扱う
            if (response.status === 401) {
              return
            }
            throw new Error(`Logout failed: ${response.status}`)
          }
        })
      } catch (error) {
        // ログアウトエラーはログに記録するが、クライアント側の状態はクリアする
        console.warn('Logout request failed:', error)
      } finally {
        // 常にクライアント側の認証状態をクリア
        this.resetAuth()
      }
    },

    // 認証状態を完全にリセット
    resetAuth() {
      this.clearAuth()
      
      // 関連するストアもクリア
      const userStore = useUserStore()
      userStore.clearCurrentUser()
      
      // プロジェクトストアもクリア
      const projectStore = useProjectStore()
      projectStore.clearProjects()
    },

    // トークンリフレッシュ処理
    async refreshToken() {
      try {
        const { post } = useApi()
        const response = await post<LoginResponse>('/api/v1/auth_token/refresh')
        this.setAuth(response)
        return response
      } catch (error) {
        // リフレッシュに失敗した場合は認証状態をクリア
        this.resetAuth()
        throw error
      }
    },

    // 自動リフレッシュの確認と実行
    async checkAndRefreshToken() {
      // ユーザーが存在し、トークンが期限切れの場合にリフレッシュを試行
      if (this.isExistUserAndExpired) {
        try {
          await this.refreshToken()
          return true
        } catch (error) {
          console.warn('Token refresh failed:', error)
          return false
        }
      }
      return this.isAuthenticated
    },
  },
})