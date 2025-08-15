/**
 * 現在のプロジェクト取得ミドルウェア
 * ルートパラメータからプロジェクトIDを取得し、現在のプロジェクト情報を設定する
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const projectStore = useProjectStore()

  // パラメータからプロジェクトIDを取得
  const projectId: string = to.params.id as string

  if (projectId) {
    try {
      await projectStore.getCurrentProject(projectId)
    } catch (error) {
      console.error('Failed to get current project:', error)
      // エラーハンドリングはuseApiで行われるため、ここでは追加処理のみ
    }
  }
})
