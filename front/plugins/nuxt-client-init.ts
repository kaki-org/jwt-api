export default defineNuxtPlugin(async () => {
  // クライアントサイドでのみ実行
  if (import.meta.server) return;

  // 認証ストアを使用してトークンリフレッシュを実行
  const authStore = useAuthStore();

  try {
    // 既存のユーザー情報があり、トークンが期限切れの場合のみリフレッシュを試行
    if (authStore.isExistUserAndExpired) {
      await authStore.refreshToken();
    }
  } catch (error) {
    // リフレッシュに失敗した場合は認証状態をクリア
    console.warn('Token refresh failed during initialization:', error);
    authStore.resetAuth();
  }
});
