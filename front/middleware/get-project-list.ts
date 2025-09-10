import type { Project } from '~/types/middleware'
import { handleMiddlewareError } from '~/utils/middleware'

/**
 * プロジェクト一覧取得ミドルウェア
 * プロジェクト一覧が存在しない場合にAPIから取得してストアに設定する
 */
export default defineNuxtRouteMiddleware(async () => {
  const projectStore = useProjectStore()
  const toastStore = useToastStore()
  const { get } = useApi()

  // プロジェクト一覧が存在しない場合のみ取得（パフォーマンス最適化）
  if (projectStore.list.length === 0) {
    try {
      const projects = await get<Project[]>('/api/v1/projects')
      projectStore.setProjectList(projects)
    } catch (error) {
      handleMiddlewareError(error, 'get-project-list')

      // ユーザーフレンドリーなエラーメッセージを表示
      toastStore.showError('プロジェクト一覧の取得に失敗しました')
    }
  }
})
