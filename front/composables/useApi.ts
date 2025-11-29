import type { $Fetch } from 'nitropack'

interface ApiError {
  statusCode: number
  statusMessage: string
  data?: unknown
}

type ApiRequestOptions = Parameters<$Fetch>[1]
type ApiRequestBody = Record<string, unknown> | BodyInit | null | undefined

/**
 * $fetchベースのHTTPクライアントコンポーザブル
 * 認証ヘッダーの自動付与、エラーハンドリングを含む
 */
export const useApi = () => {
  const authStore = useAuthStore()
  const toastStore = useToastStore()
  const { $config } = useNuxtApp()

  // APIのベースURL
  const baseURL = $config.public.apiUrl || '/api'

  /**
   * 共通のfetchオプションを作成
   * @param options カスタムオプション
   * @returns マージされたfetchオプション
   */
  const createFetchOptions = (
    options: ApiRequestOptions = {}
  ): ApiRequestOptions => {
    const defaultOptions: ApiRequestOptions = {
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers,
      },
      // 認証ヘッダーの自動付与
      onRequest({ request, options }) {
        // 認証トークンが存在する場合、Authorizationヘッダーを追加
        if (authStore.token) {
          options.headers = new Headers({
            ...Object.fromEntries(new Headers(options.headers).entries()),
            Authorization: `Bearer ${authStore.token}`,
          })
        }

        // 開発環境でのリクエストログ
        if (import.meta.dev) {
          console.log('[API Request]', request, options)
        }
      },
      // レスポンス処理
      onResponse({ response }) {
        // 開発環境でのレスポンスログ
        if (import.meta.dev) {
          console.log('[API Response]', response.status, response._data)
        }
      },
      // エラーハンドリング
      onResponseError({ request, response }) {
        const error: ApiError = {
          statusCode: response.status,
          statusMessage: response.statusText,
          data: response._data,
        }

        // 開発環境でのエラーログ
        if (import.meta.dev) {
          console.error('[API Error]', request, error)
        }

        // 401エラー（認証エラー）の処理
        if (response.status === 401) {
          handleUnauthorizedError()
        }
        // 403エラー（認可エラー）の処理
        else if (response.status === 403) {
          handleForbiddenError()
        }
        // 404エラー（リソースが見つからない）の処理
        else if (response.status === 404) {
          handleNotFoundError()
        }
        // 422エラー（バリデーションエラー）の処理
        else if (response.status === 422) {
          handleValidationError(error.data)
        }
        // 500エラー（サーバーエラー）の処理
        else if (response.status >= 500) {
          handleServerError()
        }
        // その他のエラー
        else {
          handleGenericError(error)
        }

        // エラーを再スローして呼び出し元で処理できるようにする
        throw error
      },
    }

    // カスタムオプションとマージ
    return {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    }
  }

  /**
   * 401エラー（認証エラー）の処理
   */
  const handleUnauthorizedError = async () => {
    // トークンリフレッシュを試行
    const refreshed = await authStore.checkAndRefreshToken()

    if (!refreshed) {
      // リフレッシュに失敗した場合は認証状態をクリアしてログインページにリダイレクト
      authStore.resetAuth()
      toastStore.showError(
        '認証の有効期限が切れました。再度ログインしてください。'
      )
      await navigateTo('/login')
    }
  }

  /**
   * 403エラー（認可エラー）の処理
   */
  const handleForbiddenError = () => {
    toastStore.showError('このリソースにアクセスする権限がありません。')
  }

  /**
   * 404エラー（リソースが見つからない）の処理
   */
  const handleNotFoundError = () => {
    toastStore.showError('要求されたリソースが見つかりません。')
  }

  /**
   * 422エラー（バリデーションエラー）の処理
   * @param data エラーデータ
   */
  const handleValidationError = (data: unknown) => {
    if (data && typeof data === 'object' && 'errors' in data) {
      const errors = data.errors as Record<string, string[]>
      const errorMessages = Object.values(errors).flat()
      toastStore.showError(`入力エラー: ${errorMessages.join(', ')}`)
    } else {
      toastStore.showError('入力内容に問題があります。')
    }
  }

  /**
   * 500エラー（サーバーエラー）の処理
   */
  const handleServerError = () => {
    toastStore.showError(
      'サーバーでエラーが発生しました。しばらく時間をおいて再度お試しください。'
    )
  }

  /**
   * その他のエラーの処理
   * @param error エラー情報
   */
  const handleGenericError = (error: ApiError) => {
    toastStore.showError(
      `エラーが発生しました (${error.statusCode}): ${error.statusMessage}`
    )
  }

  /**
   * GETリクエスト
   * @param url リクエストURL
   * @param options fetchオプション
   * @returns レスポンスデータ
   */
  const get = async <T = unknown>(
    url: string,
    options: ApiRequestOptions = {}
  ): Promise<T> => {
    const fetchOptions = createFetchOptions({
      ...options,
      method: 'GET' as const,
    })
    return await $fetch<T>(url, fetchOptions)
  }

  /**
   * POSTリクエスト
   * @param url リクエストURL
   * @param body リクエストボディ
   * @param options fetchオプション
   * @returns レスポンスデータ
   */
  const post = async <T = unknown>(
    url: string,
    body?: ApiRequestBody,
    options: ApiRequestOptions = {}
  ): Promise<T> => {
    const fetchOptions = createFetchOptions({
      ...options,
      method: 'POST' as const,
      body,
    })
    return await $fetch<T>(url, fetchOptions)
  }

  /**
   * PUTリクエスト
   * @param url リクエストURL
   * @param body リクエストボディ
   * @param options fetchオプション
   * @returns レスポンスデータ
   */
  const put = async <T = unknown>(
    url: string,
    body?: ApiRequestBody,
    options: ApiRequestOptions = {}
  ): Promise<T> => {
    const fetchOptions = createFetchOptions({
      ...options,
      method: 'PUT' as const,
      body,
    })
    return await $fetch<T>(url, fetchOptions)
  }

  /**
   * PATCHリクエスト
   * @param url リクエストURL
   * @param body リクエストボディ
   * @param options fetchオプション
   * @returns レスポンスデータ
   */
  const patch = async <T = unknown>(
    url: string,
    body?: ApiRequestBody,
    options: ApiRequestOptions = {}
  ): Promise<T> => {
    const fetchOptions = createFetchOptions({
      ...options,
      method: 'PATCH' as const,
      body,
    })
    return await $fetch<T>(url, fetchOptions)
  }

  /**
   * DELETEリクエスト
   * @param url リクエストURL
   * @param options fetchオプション
   * @returns レスポンスデータ
   */
  const del = async <T = unknown>(
    url: string,
    options: ApiRequestOptions = {}
  ): Promise<T> => {
    const fetchOptions = createFetchOptions({
      ...options,
      method: 'DELETE' as const,
    })
    return await $fetch<T>(url, fetchOptions)
  }

  /**
   * カスタムfetchリクエスト
   * @param url リクエストURL
   * @param options fetchオプション
   * @returns レスポンスデータ
   */
  const fetch = async <T = unknown>(
    url: string,
    options: ApiRequestOptions = {}
  ): Promise<T> => {
    const fetchOptions = createFetchOptions(options)
    return await $fetch<T>(url, fetchOptions)
  }

  return {
    // HTTPメソッド
    get,
    post,
    put,
    patch,
    delete: del,
    fetch,

    // ユーティリティ
    createFetchOptions,
  }
}
