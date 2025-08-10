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
}

export const useProjectStore = defineStore('project', {
  state: (): ProjectState => ({
    current: null,
    list: [],
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
  },

  actions: {
    setProjectList(projects: Project[]) {
      this.list = projects || []
    },

    setCurrentProject(project: Project | null) {
      this.current = project
    },

    getCurrentProjectById(id: number) {
      const project = this.list.find(project => project.id === id) || null
      this.setCurrentProject(project)
      return project
    },

    addProject(project: Project) {
      this.list.push(project)
    },

    updateProject(id: number, updates: Partial<Omit<Project, 'id'>>) {
      const index = this.list.findIndex(project => project.id === id)
      if (index !== -1) {
        this.list[index] = { ...this.list[index], ...updates }
        
        // Update current project if it's the one being updated
        if (this.current?.id === id) {
          this.current = { ...this.current, ...updates }
        }
      }
    },

    removeProject(id: number) {
      this.list = this.list.filter(project => project.id !== id)
      
      // Clear current project if it's the one being removed
      if (this.current?.id === id) {
        this.current = null
      }
    },

    clearProjects() {
      this.list = []
      this.current = null
    },
  },
})