import { defineStore } from 'pinia'

interface Project {
  id: number
  name?: string
  description?: string
  [key: string]: unknown
}

interface ProjectState {
  current: Project | null
  list: Project[]
  loading: boolean
  error: string | null
}

export const useProjectStore = defineStore('project', {
  state: (): ProjectState => ({
    current: null,
    list: [],
    loading: false,
    error: null,
  }),

  getters: {
    hasProjects: (state) => {
      return state.list.length > 0
    },

    currentProjectName: (state) => {
      return state.current?.name || ''
    },

    projectById: (state) => {
      return (id: number) => state.list.find(project => project.id === id) || null
    },

    isLoading: (state) => {
      return state.loading
    },

    hasError: (state) => {
      return !!state.error
    },
  },

  actions: {
    // プロジェクト一覧を設定
    setProjectList(projects: Project[]) {
      this.list = projects || []
      this.error = null
    },

    // 現在のプロジェクトを設定
    setCurrentProject(project: Project | null) {
      this.current = project
      this.error = null
    },

    // IDから現在のプロジェクトを取得・設定
    getCurrentProjectById(id: number) {
      const project = this.list.find(project => project.id === id) || null
      this.setCurrentProject(project)
      return project
    },

    // パラメータから現在のプロジェクトを取得・設定（Vuex互換）
    getCurrentProject(params?: { id?: string | number }) {
      let currentProject = null
      if (params && params.id) {
        const id = Number(params.id)
        currentProject = this.list.find((project) => project.id === id) || null
      }
      this.setCurrentProject(currentProject)
      return currentProject
    },

    // プロジェクト一覧を取得（Vuex互換）
    getProjectList(projects?: Project[]) {
      this.setProjectList(projects || [])
    },

    // API からプロジェクト一覧を取得
    async fetchProjectList() {
      this.loading = true
      this.error = null
      
      try {
        const { data } = await $fetch<{ data: Project[] }>('/api/v1/projects', {
          method: 'GET',
        })
        
        this.setProjectList(data || [])
        return data
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'プロジェクト一覧の取得に失敗しました'
        this.error = errorMessage
        console.error('Failed to fetch project list:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // プロジェクトを追加
    addProject(project: Project) {
      this.list.push(project)
      this.error = null
    },

    // プロジェクトを更新
    updateProject(id: number, updates: Partial<Omit<Project, 'id'>>) {
      const index = this.list.findIndex(project => project.id === id)
      if (index !== -1) {
        this.list[index] = { ...this.list[index], ...updates, id }
        
        // 現在のプロジェクトが更新対象の場合は同期
        if (this.current?.id === id) {
          this.current = { ...this.current, ...updates, id }
        }
      }
      this.error = null
    },

    // プロジェクトを削除
    removeProject(id: number) {
      this.list = this.list.filter(project => project.id !== id)
      
      // 現在のプロジェクトが削除対象の場合はクリア
      if (this.current?.id === id) {
        this.current = null
      }
      this.error = null
    },

    // 全プロジェクトをクリア
    clearProjects() {
      this.list = []
      this.current = null
      this.error = null
    },

    // エラーをクリア
    clearError() {
      this.error = null
    },

    // ローディング状態を設定
    setLoading(loading: boolean) {
      this.loading = loading
    },

    // エラーを設定
    setError(error: string | null) {
      this.error = error
    },
  },
})