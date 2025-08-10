import { defineStore } from 'pinia'

interface ToastState {
  msg: string | null
  color: string
  timeout: number
}

export const useToastStore = defineStore('toast', {
  state: (): ToastState => ({
    msg: null,
    color: 'info',
    timeout: 5000,
  }),

  getters: {
    // トーストが表示されているかどうか
    isVisible: (state): boolean => {
      return state.msg !== null && state.msg !== ''
    },

    // 現在のトーストメッセージ
    currentMessage: (state): string => {
      return state.msg || ''
    },

    // 現在のトーストカラー
    currentColor: (state): string => {
      return state.color
    },

    // 現在のタイムアウト値
    currentTimeout: (state): number => {
      return state.timeout
    },
  },

  actions: {
    // 基本的なトースト表示
    showToast(msg: string, color: string = 'info', timeout: number = 5000) {
      this.msg = msg
      this.color = color
      this.timeout = timeout
    },

    // 成功メッセージを表示
    showSuccess(msg: string, timeout: number = 5000) {
      this.showToast(msg, 'success', timeout)
    },

    // エラーメッセージを表示
    showError(msg: string, timeout: number = 8000) {
      this.showToast(msg, 'error', timeout)
    },

    // 警告メッセージを表示
    showWarning(msg: string, timeout: number = 6000) {
      this.showToast(msg, 'warning', timeout)
    },

    // 情報メッセージを表示
    showInfo(msg: string, timeout: number = 5000) {
      this.showToast(msg, 'info', timeout)
    },

    // 無期限トーストを表示（手動で閉じるまで表示）
    showPersistent(msg: string, color: string = 'info') {
      this.showToast(msg, color, -1)
    },

    // トーストをクリア
    clearToast() {
      this.msg = null
      this.color = 'info'
      this.timeout = 5000
    },

    // メッセージのみを設定
    setMessage(msg: string | null) {
      this.msg = msg
    },

    // カラーのみを設定
    setColor(color: string) {
      this.color = color
    },

    // タイムアウトのみを設定
    setTimeout(timeout: number) {
      this.timeout = timeout
    },

    // 複数の設定を一度に変更
    updateToast(updates: Partial<ToastState>) {
      if (updates.msg !== undefined) {
        this.msg = updates.msg
      }
      if (updates.color !== undefined) {
        this.color = updates.color
      }
      if (updates.timeout !== undefined) {
        this.timeout = updates.timeout
      }
    },

    // トーストの状態をリセット（初期状態に戻す）
    resetToast() {
      this.msg = null
      this.color = 'info'
      this.timeout = 5000
    },
  },
})