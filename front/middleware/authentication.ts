/**
 * 認証ミドルウェア
 * ログインが必要なページへのアクセス時に認証状態をチェックし、
 * 未認証の場合はログインページにリダイレクトする
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  const appStore = useAppStore();
  const toastStore = useToastStore();

  // リダイレクトを必要としないパス
  const notRedirectPaths: string[] = ["account", "project"];
  if (notRedirectPaths.includes(to.name as string)) {
    return;
  }

  // ログイン前ユーザー処理
  if (!authStore.loggedIn) {
    // ユーザー以外の値が存在する可能性があるので全てを削除する
    authStore.resetAuth();

    const msg = "まずはログインしてください";
    console.log(msg, "info");
    console.log(to);
    toastStore.showInfo(msg);

    // アクセスルート記憶
    appStore.setRememberPath({
      name: to.name as string,
      params: to.params as Record<string, any>,
    });

    return navigateTo("/login");
  }
});
