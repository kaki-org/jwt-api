/**
 * プロジェクト一覧取得ミドルウェア
 * プロジェクト一覧が存在しない場合にAPIから取得してストアに設定する
 */
export default defineNuxtRouteMiddleware(async () => {
  const projectStore = useProjectStore();
  const { get } = useApi();

  // プロジェクト一覧が存在しない場合のみ取得
  if (!projectStore.list.length) {
    try {
      const projects = await get<any[]>('/api/v1/projects');
      projectStore.setProjectList(projects);
    } catch (error) {
      console.error('Failed to fetch project list:', error);
      // エラーハンドリングはuseApiで行われるため、ここでは追加処理のみ
    }
  }
});
