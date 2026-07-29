import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
})

// Auth token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lf_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api

// API functions
export const runsApi = {
  list: (params?: any) => api.get('/runs', { params }),
  get: (id: string) => api.get(`/runs/${id}`),
  getChildren: (id: string) => api.get(`/runs/${id}/children`),
  delete: (id: string) => api.delete(`/runs/${id}`),
  bulkDelete: (ids: string[]) => api.post('/runs/bulk-delete', { ids }),
  addToDataset: (runId: string, datasetId: string) => api.post(`/runs/${runId}/add-to-dataset`, { dataset_id: datasetId }),
}

export const statsApi = {
  dashboard: (params?: any) => api.get('/stats/dashboard', { params }),
}

export const projectsApi = {
  list: () => api.get('/projects'),
  get: (id: string) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: string, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
  stats: (id: string) => api.get(`/projects/${id}/stats`),
}

export const datasetsApi = {
  list: (projectId: string) => api.get('/datasets', { params: { project_id: projectId } }),
  get: (id: string) => api.get(`/datasets/${id}`),
  create: (data: any) => api.post('/datasets', data),
  examples: (id: string) => api.get(`/datasets/${id}/examples`),
  addExample: (id: string, data: any) => api.post(`/datasets/${id}/examples`, data),
}

export const evalApi = {
  list: (projectId: string) => api.get('/evaluations', { params: { project_id: projectId } }),
  get: (id: string) => api.get(`/evaluations/${id}`),
  run: (data: any) => api.post('/evaluations/run', data),
  compare: (a: string, b: string) => api.get('/evaluations/compare', { params: { a, b } }),
  submitAnnotation: (runId: string, data: any) => api.post(`/annotations/${runId}`, data),
  getAnnotations: (runId: string) => api.get('/annotations', { params: { run_id: runId } }),
  queues: (projectId: string) => api.get('/annotations/queues', { params: { project_id: projectId } }),
}

export const promptsApi = {
  list: (projectId: string) => api.get('/prompts', { params: { project_id: projectId } }),
  get: (id: string) => api.get(`/prompts/${id}`),
  create: (data: any) => api.post('/prompts', data),
  versions: (id: string) => api.get(`/prompts/${id}/versions`),
  addVersion: (id: string, data: any) => api.post(`/prompts/${id}/versions`, data),
  playground: (data: any) => api.post('/prompts/playground', data),
  setProduction: (versionId: string) => api.put(`/prompts/versions/${versionId}/set-production`),
}

export const flowsApi = {
  list: (projectId: string) => api.get('/flows', { params: { project_id: projectId } }),
  get: (id: string) => api.get(`/flows/${id}`),
  create: (data: any) => api.post('/flows', data),
  update: (id: string, data: any) => api.put(`/flows/${id}`, data),
  generateCode: (id: string, data: any) => api.post(`/flows/${id}/generate-code`, data),
}

export const alertsApi = {
  list: (projectId: string) => api.get('/alerts', { params: { project_id: projectId } }),
  create: (data: any) => api.post('/alerts', data),
  update: (id: string, data: any) => api.put(`/alerts/${id}`, data),
  delete: (id: string) => api.delete(`/alerts/${id}`),
}
