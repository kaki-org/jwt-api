import { defineNuxtPlugin } from '#app';

/**
 * 認証プラグイン
 * Composables + Piniaベースの新しい認証システムを提供
 * 
 * このプラグインは後方互換性のために$authインスタンスを提供しますが、
 * 新しいコードではuseAuth() composableの直接使用を推奨します。
 */
class Authentication {
  constructor() {
    // useAuth composableを内部で使用
    this._auth = useAuth();
  }

  // 認証状態の取得（computed値をunwrapして返す）
  get token() {
    return unref(this._auth.token);
  }

  get expires() {
    const authStore = useAuthStore();
    return authStore.expires;
  }

  get payload() {
    return unref(this._auth.payload);
  }

  get user() {
    return unref(this._auth.currentUser) || {};
  }

  // 認証情報を設定する（Piniaストア経由）
  setAuth({ token, expires, user }) {
    const authStore = useAuthStore();
    authStore.setAuth({ token, expires, user });
  }

  // ログイン処理（useAuth composableに委譲）
  async login(credentials) {
    return await this._auth.login(credentials);
  }

  // 認証状態をリセット（Piniaストア経由）
  resetAuth() {
    this._auth.resetAuth();
  }

  // 後方互換性のためのメソッド（resetVuexの代替）
  resetVuex() {
    this.resetAuth();
  }

  // ログアウト処理（useAuth composableに委譲）
  async logout() {
    return await this._auth.logout();
  }

  // 認証状態の確認
  isAuthenticated() {
    return unref(this._auth.isAuthenticated);
  }

  // ユーザーが存在するかどうか
  isExistUser() {
    const authStore = useAuthStore();
    return authStore.isExistUser;
  }

  // ユーザーが存在し、かつ有効期限切れの場合
  isExistUserAndExpired() {
    const authStore = useAuthStore();
    return authStore.isExistUserAndExpired;
  }

  // ログイン状態（ユーザーが存在し、かつ有効期限内）
  loggedIn() {
    return unref(this._auth.loggedIn);
  }

  // トークンリフレッシュ処理
  async refreshToken() {
    return await this._auth.refreshToken();
  }

  // 自動トークンリフレッシュの確認と実行
  async checkAndRefreshToken() {
    return await this._auth.checkAndRefreshToken();
  }

  // HTTPステータスコードの検証メソッド
  resolveUnauthorized(status) {
    return (status >= 200 && status < 300) || status === 401;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  // 認証インスタンスを作成してプロバイド
  const auth = new Authentication();
  nuxtApp.provide('auth', auth);
  
  // グローバルに$authとしてアクセス可能にする
  return {
    provide: {
      auth
    }
  };
});
