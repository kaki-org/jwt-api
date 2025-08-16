/**
 * ミドルウェア用キャッシュユーティリティ
 */

// プロジェクト一覧のキャッシュ管理
class ProjectListCache {
  private static instance: ProjectListCache
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private readonly TTL = 5 * 60 * 1000 // 5分間のキャッシュ

  static getInstance(): ProjectListCache {
    if (!ProjectListCache.instance) {
      ProjectListCache.instance = new ProjectListCache()
    }
    return ProjectListCache.instance
  }

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  get(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) {
      return null
    }

    // TTLチェック
    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  clear(): void {
    this.cache.clear()
  }

  has(key: string): boolean {
    const cached = this.cache.get(key)
    if (!cached) {
      return false
    }

    // TTLチェック
    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(key)
      return false
    }

    return true
  }
}

export const projectListCache = ProjectListCache.getInstance()

/**
 * プロジェクト詳細のキャッシュ管理
 */
class ProjectDetailCache {
  private static instance: ProjectDetailCache
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private readonly TTL = 2 * 60 * 1000 // 2分間のキャッシュ

  static getInstance(): ProjectDetailCache {
    if (!ProjectDetailCache.instance) {
      ProjectDetailCache.instance = new ProjectDetailCache()
    }
    return ProjectDetailCache.instance
  }

  set(projectId: string, data: any): void {
    this.cache.set(projectId, {
      data,
      timestamp: Date.now()
    })
  }

  get(projectId: string): any | null {
    const cached = this.cache.get(projectId)
    if (!cached) {
      return null
    }

    // TTLチェック
    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(projectId)
      return null
    }

    return cached.data
  }

  clear(): void {
    this.cache.clear()
  }

  has(projectId: string): boolean {
    const cached = this.cache.get(projectId)
    if (!cached) {
      return false
    }

    // TTLチェック
    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(projectId)
      return false
    }

    return true
  }
}

export const projectDetailCache = ProjectDetailCache.getInstance()
