/**
 * ミドルウェア関連の型定義
 */

// ルートパラメータの型定義
export interface RouteParams {
  [key: string]: string | string[]
}

// 記憶するパス情報の型定義
export interface RememberPath {
  name: string
  params: RouteParams
}

// プロジェクト情報の型定義
export interface Project {
  id: number
  name: string
  description?: string
  created_at?: string
  updated_at?: string
  [key: string]: any // インデックスシグネチャを追加
}

// APIエラーレスポンスの型定義
export interface ApiError {
  message: string
  status?: number
  statusText?: string
}
