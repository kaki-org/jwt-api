import { handleMiddlewareError } from '~/utils/middleware'

/**
 * 現在のプロジェクト取得ミドルウェア
 * ルートパラメータからプロジェクトIDを取得し、現在のプロジェクト情報を設定する
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const projectStore = useProjectStore()
  const toastStore = useToastStore()

  // パラメータからプロジェクトIDを取得（型安全性を向上）
  const projectId = to.params.id as string | undefined

  if (projectId && typeof projectId === 'string') {
    try {
      await projectStore.getCurrentProject({ id: projectId })
    } catch (error) {
      handleMiddlewareError(error, 'get-project-current')

      // ユーザーフレンドリーなエラーメッセージを表示
      toastStore.showError('プロジェクト情報の取得に失敗しました')

      // プロジェクト一覧ページにリダイレクト
      return navigateTo('/projects')
    }
  }
})
