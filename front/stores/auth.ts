import { defineStore } from 'pinia'

interface AuthState {
  token: string | null
  expires: number
  payload: Record<string, any>
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    expires: 0,
    payload: {},
  }),

  getters: {
    isAuthenticated: (state) => {
      return state.token !== null && state.expires > Date.now()
    },
    
    isExpired: (state) => {
      return state.expires <= Date.now()
    },
  },

  actions: {
    setToken(token: string | null) {
      this.token = token
    },

    setExpires(expires: number) {
      this.expires = expires || 0
    },

    setPayload(payload: Record<string, any>) {
      this.payload = payload || {}
    },

    setAuth({ token, expires, payload }: { token: string | null; expires: number; payload: Record<string, any> }) {
      this.token = token
      this.expires = expires || 0
      this.payload = payload || {}
    },

    clearAuth() {
      this.token = null
      this.expires = 0
      this.payload = {}
    },
  },
})