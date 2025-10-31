import axios, { AxiosError } from 'axios'
import axiosRetry from 'axios-retry'

const SERVER_FB_TOKEN = process.env.FB_ACCESS_TOKEN || process.env.NEXT_PUBLIC_FB_ACCESS_TOKEN

const FB_GRAPH_BASE = process.env.FB_GRAPH_BASE || 'https://graph.facebook.com'
const FB_GRAPH_VERSION = process.env.FB_GRAPH_VERSION || 'v21.0'
const API_BASE_URL = `${FB_GRAPH_BASE.replace(/\/$/, '')}/${FB_GRAPH_VERSION}`

export const axiosClientFacebook = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
})

axiosRetry(axiosClientFacebook, {
  retries: 20,
  retryDelay: (retryCount) => retryCount * 500,
  retryCondition: (error) => {
    const status = error.response?.status ?? 0
    return (
      error.code === 'ECONNABORTED' ||
      error.message === 'Network Error' ||
      status === 500 ||
      status === 502 ||
      status === 503 ||
      status === 504
    )
  }
})

axiosClientFacebook.interceptors.request.use((config) => {
  if (SERVER_FB_TOKEN && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${SERVER_FB_TOKEN}`
  }
  return config
})

axiosClientFacebook.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    return Promise.reject(normalizeAxiosError(error))
  }
)

export function createAxiosServerFacebook(cookiesStr?: string) {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      ...(cookiesStr ? { cookie: cookiesStr } : {}),
      ...(SERVER_FB_TOKEN ? { Authorization: `Bearer ${SERVER_FB_TOKEN}` } : {})
    },
    timeout: 15000
  })

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => Promise.reject(normalizeAxiosError(error))
  )

  return instance
}

function normalizeAxiosError(error: AxiosError) {
  const status = error.response?.status
  const data = error.response?.data as any
  return {
    status,
    message: data?.message || (error.message === 'Network Error' ? 'Không thể kết nối máy chủ' : error.message),
    data,
    url: (error.config?.baseURL || '') + (error.config?.url || '')
  }
}
