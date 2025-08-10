import { defineStore } from 'pinia'

interface User {
  sub: string
  email: string
  name: string
  id?: number
  [key: string]: unknown
}

interface UserState {
  current: User | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    current: null,
  }),

  getters: {
    // ユーザーがログインしているかどうか
    isLoggedIn: (state): boolean => {
      return state.current !== null
    },

    // ユーザー名を取得
    userName: (state): string => {
      return state.current?.name || ''
    },

    // ユーザーのメールアドレスを取得
    userEmail: (state): string => {
      return state.current?.email || ''
    },

    // ユーザーのsubject（JWT識別子）を取得
    userSub: (state): string => {
      return state.current?.sub || ''
    },

    // ユーザーIDを取得
    userId: (state): number | undefined => {
      return state.current?.id
    },

    // ユーザーの表示名を取得（名前またはメールアドレス）
    displayName: (state): string => {
      return state.current?.name || state.current?.email || ''
    },

    // ユーザー情報が完全かどうかを確認
    hasCompleteProfile: (state): boolean => {
      return !!(state.current?.sub && state.current?.email && state.current?.name)
    },
  },

  actions: {
    // 現在のユーザー情報を設定
    setCurrentUser(user: User | null) {
      this.current = user
    },

    // 現在のユーザー情報をクリア
    clearCurrentUser() {
      this.current = null
    },

    // ユーザー情報を部分的に更新
    updateUser(userData: Partial<User>) {
      if (this.current) {
        this.current = { ...this.current, ...userData }
      }
    },

    // ユーザー情報を完全に置き換え
    replaceUser(user: User) {
      this.current = user
    },

    // ユーザー情報をサーバーから取得して更新
    async fetchUserInfo() {
      try {
        const user = await $fetch<User>('/api/v1/user', {
          method: 'GET',
        })
        this.setCurrentUser(user)
        return user
      } catch (error) {
        console.error('Failed to fetch user info:', error)
        throw error
      }
    },

    // ユーザー情報をサーバーに送信して更新
    async updateUserInfo(userData: Partial<Omit<User, 'sub'>>) {
      if (!this.current) {
        throw new Error('No current user to update')
      }

      try {
        const updatedUser = await $fetch<User>('/api/v1/user', {
          method: 'PATCH',
          body: userData,
        })
        this.setCurrentUser(updatedUser)
        return updatedUser
      } catch (error) {
        console.error('Failed to update user info:', error)
        throw error
      }
    },

    // パスワード変更
    async changePassword(passwordData: { currentPassword: string; newPassword: string }) {
      try {
        await $fetch('/api/v1/user/password', {
          method: 'PATCH',
          body: passwordData,
        })
      } catch (error) {
        console.error('Failed to change password:', error)
        throw error
      }
    },

    // アカウント削除
    async deleteAccount() {
      try {
        await $fetch('/api/v1/user', {
          method: 'DELETE',
        })
        this.clearCurrentUser()
      } catch (error) {
        console.error('Failed to delete account:', error)
        throw error
      }
    },

    // ユーザー情報の検証
    validateUser(user: unknown): user is User {
      return (
        typeof user === 'object' &&
        user !== null &&
        'sub' in user &&
        'email' in user &&
        'name' in user &&
        typeof (user as User).sub === 'string' &&
        typeof (user as User).email === 'string' &&
        typeof (user as User).name === 'string'
      )
    },
  },
})