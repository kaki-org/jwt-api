import { defineNuxtPlugin } from '#app';

interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  sub: string;
  email: string;
  name: string;
  [key: string]: unknown;
}

interface LoginResponse {
  token: string;
  expires: number;
  user: User;
}

interface JWTPayload {
  sub: string;
  exp: number;
  iat: number;
  email?: string;
  name?: string;
  [key: string]: unknown;
}

/**
 * 認証プラグイン
 * Composables + Piniaベースの新しい認証システムを提供
 * 
 * このプラグインは後方互換性のために$authインスタンスを提供しますが、
 * 新しいコードではuseAuth() composableの直接使用を推奨します。
 */
class Authentication {
  private _auth: ReturnType<typeof useAuth>;

  constructor() {
    // useAuth composableを内部で使用
    this._auth = useAuth();
  }

  // 認証状態の取得（computed値をunwrapして返す）
  get token(): string | null {
    return unref(this._auth.token);
  }

  get expires(): number {
    const authStore = useAuthStore();
    return authStore.expires;
  }

  get payload(): JWTPayload | Record<string, unknown> {
    return unref(this._auth.payload);
  }

  get user(): User | Record<string, unknown> {
    return unref(this._auth.currentUser) || {};
  }

  // 認証情報を設定する（Piniaストア経由）
  setAuth({ token, expires, user }: LoginResponse): void {
    const authStore = useAuthStore();
    authStore.setAuth({ token, expires, user });
  }

  // ログイン処理（useAuth composableに委譲）
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return await this._auth.login(credentials);
  }

  // 認証状態をリセット（Piniaストア経由）
  resetAuth(): void {
    this._auth.resetAuth();
  }

  // 後方互換性のためのメソッド（resetVuexの代替）
  resetVuex(): void {
    this.resetAuth();
  }

  // ログアウト処理（useAuth composableに委譲）
  async logout(): Promise<void> {
    return await this._auth.logout();
  }

  // 認証状態の確認
  isAuthenticated(): boolean {
    return unref(this._auth.isAuthenticated);
  }

  // ユーザーが存在するかどうか
  isExistUser(): boolean {
    const authStore = useAuthStore();
    return authStore.isExistUser;
  }

  // ユーザーが存在し、かつ有効期限切れの場合
  isExistUserAndExpired(): boolean {
    const authStore = useAuthStore();
    return authStore.isExistUserAndExpired;
  }

  // ログイン状態（ユーザーが存在し、かつ有効期限内）
  loggedIn(): boolean {
    return unref(this._auth.loggedIn);
  }

  // トークンリフレッシュ処理
  async refreshToken(): Promise<boolean> {
    return await this._auth.refreshToken();
  }

  // 自動トークンリフレッシュの確認と実行
  async checkAndRefreshToken(): Promise<boolean> {
    return await this._auth.checkAndRefreshToken();
  }

  // HTTPステータスコードの検証メソッド
  resolveUnauthorized(status: number): boolean {
    return (status >= 200 && status < 300) || status === 401;
  }
}

// TypeScript用の型定義を拡張
declare module '#app' {
  interface NuxtApp {
    $auth: Authentication;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $auth: Authentication;
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
