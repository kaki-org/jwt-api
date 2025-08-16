/**
 * ミドルウェア共通ユーティリティ関数
 */

import type { RouteLocationNormalized } from 'vue-router'
import type { RouteParams } from '~/types/middleware'

/**
 * ルート名を安全に取得する
 * @param to ルート情報
 * @returns ルート名（存在しない場合はundefined）
 */
export function getRouteName(to: RouteLocationNormalized): string | undefined {
  return to.name as string | undefined
}

/**
 * ルートパラメータを型安全に取得する
 * @param to ルート情報
 * @returns 型安全なルートパラメータ
 */
export function getRouteParams(to: RouteLocationNormalized): RouteParams {
  return to.params as RouteParams
}

/**
 * 指定されたルート名が除外リストに含まれているかチェックする
 * @param routeName ルート名
 * @param excludePaths 除外パスのリスト
 * @returns 除外対象の場合true
 */
export function isExcludedRoute(
  routeName: string | undefined,
  excludePaths: readonly string[]
): boolean {
  return routeName ? excludePaths.includes(routeName) : false
}

/**
 * エラーメッセージを統一的に処理する
 * @param error エラーオブジェクト
 * @param context エラーが発生したコンテキスト
 */
export function handleMiddlewareError(error: unknown, context: string): void {
  console.error(`[${context}] Middleware error:`, error)
}
