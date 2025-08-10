/**
 * useApiコンポーザブルのテストファイル
 * 実際のテストフレームワークがセットアップされていない場合は、
 * このファイルは参考用として使用してください。
 */

// テスト用のモック関数
const mockAuthStore = {
  token: 'test-token',
  checkAndRefreshToken: vi.fn().mockResolvedValue(true),
  resetAuth: vi.fn(),
}

const mockToastStore = {
  showError: vi.fn(),
}

// useApiコンポーザブルのテスト例
describe('useApi', () => {
  beforeEach(() => {
    // モックをリセット
    vi.clearAllMocks()
  })

  it('should create fetch options with default headers', () => {
    const { createFetchOptions } = useApi()
    const options = createFetchOptions()
    
    expect(options.headers).toEqual({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    })
  })

  it('should add Authorization header when token exists', () => {
    const { createFetchOptions } = useApi()
    const options = createFetchOptions()
    
    // onRequestコールバックをテスト
    const mockRequest = { url: '/test' }
    const mockOptions = { headers: {} }
    
    options.onRequest?.({ request: mockRequest, options: mockOptions })
    
    expect(mockOptions.headers).toHaveProperty('Authorization', 'Bearer test-token')
  })

  it('should handle 401 errors correctly', async () => {
    const { createFetchOptions } = useApi()
    const options = createFetchOptions()
    
    const mockResponse = {
      status: 401,
      statusText: 'Unauthorized',
      _data: null,
    }
    
    // onResponseErrorコールバックをテスト
    expect(() => {
      options.onResponseError?.({
        request: '/test',
        response: mockResponse,
      })
    }).toThrow()
    
    expect(mockAuthStore.checkAndRefreshToken).toHaveBeenCalled()
  })

  it('should make GET request with correct options', async () => {
    const { get } = useApi()
    
    // $fetchのモック
    const mockFetch = vi.fn().mockResolvedValue({ data: 'test' })
    global.$fetch = mockFetch
    
    await get('/test-endpoint')
    
    expect(mockFetch).toHaveBeenCalledWith('/test-endpoint', expect.objectContaining({
      method: 'GET',
    }))
  })

  it('should make POST request with body', async () => {
    const { post } = useApi()
    
    const mockFetch = vi.fn().mockResolvedValue({ data: 'test' })
    global.$fetch = mockFetch
    
    const testBody = { name: 'test' }
    await post('/test-endpoint', testBody)
    
    expect(mockFetch).toHaveBeenCalledWith('/test-endpoint', expect.objectContaining({
      method: 'POST',
      body: testBody,
    }))
  })
})