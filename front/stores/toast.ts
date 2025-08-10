import { defineStore } from 'pinia'

interface ToastState {
  msg: string | null
  color: string
  timeout: number
}

export const useToastStore = defineStore('toast', {
  state: (): ToastState => ({
    msg: null,
    color: 'error',
    timeout: 4000,
  }),

  getters: {
    isVisible: (state) => {
      return state.msg !== null
    },
  },

  actions: {
    setToast({ msg, color, timeout }: { msg: string | null; color?: string; timeout?: number }) {
      this.msg = msg
      this.color = color || 'error'
      this.timeout = timeout || 4000
    },

    showSuccess(msg: string, timeout?: number) {
      this.setToast({ msg, color: 'success', timeout })
    },

    showError(msg: string, timeout?: number) {
      this.setToast({ msg, color: 'error', timeout })
    },

    showWarning(msg: string, timeout?: number) {
      this.setToast({ msg, color: 'warning', timeout })
    },

    showInfo(msg: string, timeout?: number) {
      this.setToast({ msg, color: 'info', timeout })
    },

    clearToast() {
      this.msg = null
    },

    // Auto-clear toast after timeout
    showToastWithAutoHide({ msg, color, timeout }: { msg: string; color?: string; timeout?: number }) {
      this.setToast({ msg, color, timeout })
      
      const timeoutMs = timeout || this.timeout
      setTimeout(() => {
        this.clearToast()
      }, timeoutMs)
    },
  },
})