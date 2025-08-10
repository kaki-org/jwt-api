import { defineStore } from 'pinia'

interface User {
  id?: number
  email?: string
  name?: string
  [key: string]: any
}

interface UserState {
  current: User | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    current: null,
  }),

  getters: {
    isLoggedIn: (state) => {
      return state.current !== null
    },

    userName: (state) => {
      return state.current?.name || ''
    },

    userEmail: (state) => {
      return state.current?.email || ''
    },
  },

  actions: {
    setCurrentUser(user: User | null) {
      this.current = user
    },

    clearCurrentUser() {
      this.current = null
    },

    updateUser(userData: Partial<User>) {
      if (this.current) {
        this.current = { ...this.current, ...userData }
      }
    },
  },
})