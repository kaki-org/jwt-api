import { defineStore } from 'pinia'

interface AppState {
  styles: {
    homeAppBarHeight: number
  }
  loggedIn: {
    homePath: {
      name: string
    }
    rememberPath: {
      name: string
      params: Record<string, any>
    }
    redirectPaths: string[]
  }
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    styles: {
      homeAppBarHeight: 56,
    },
    loggedIn: {
      homePath: {
        name: 'projects',
      },
      rememberPath: {
        name: 'projects',
        params: {},
      },
      // ログイン後アクセス不可ルート一覧
      redirectPaths: ['index', 'signup', 'login'],
    },
  }),

  getters: {
    homeAppBarHeight: (state) => state.styles.homeAppBarHeight,

    homePathName: (state) => state.loggedIn.homePath.name,

    rememberPath: (state) => state.loggedIn.rememberPath,

    shouldRedirectAfterLogin: (state) => {
      return (routeName: string) =>
        state.loggedIn.redirectPaths.includes(routeName)
    },
  },

  actions: {
    setRememberPath({
      name,
      params,
    }: {
      name: string
      params?: Record<string, any>
    }) {
      // ログイン前パスが渡された場合は loggedIn.homePath に書き換える
      if (this.loggedIn.redirectPaths.includes(name)) {
        name = this.loggedIn.homePath.name
      }

      this.loggedIn.rememberPath = {
        name,
        params: params || {},
      }
    },

    setHomeAppBarHeight(height: number) {
      this.styles.homeAppBarHeight = height
    },

    addRedirectPath(path: string) {
      if (!this.loggedIn.redirectPaths.includes(path)) {
        this.loggedIn.redirectPaths.push(path)
      }
    },

    removeRedirectPath(path: string) {
      this.loggedIn.redirectPaths = this.loggedIn.redirectPaths.filter(
        (p) => p !== path
      )
    },
  },
})
