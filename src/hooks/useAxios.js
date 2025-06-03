import axios from 'axios'
import { useAccessTokenStore, useRefreshTokenStore } from '@store/useUserStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
  // timeout: 10000
})

// 요청 인터셉터
api.interceptors.request.use(
  config => {
    // /auth/login, /auth/register는 withCredentials: true
    if (
      config.url === '/auth/login' ||
      config.url === '/auth/register'
    ) {
      config.withCredentials = true
      delete config.headers.Authorization
    }
    // /auth/refresh는 헤더 필요 없음
    else if (config.url === '/auth/refresh') {
      delete config.headers.Authorization
    }
    // 그 외 요청은 Authorization 헤더 필요
    else {
      const accessToken = useAccessTokenStore.getState().accessToken
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }
    }
    return config
  },
  error => Promise.reject(error)
)

// 응답 인터셉터
api.interceptors.response.use(
  response => response.data?.content?.data,
  async error => {
    const originalRequest = error.config
    const { url } = originalRequest

    // /auth/login, /auth/register, /auth/refresh 실패 시 /login 이동
    if (
      url === '/auth/login' ||
      url === '/auth/register' ||
      url === '/auth/refresh'
    ) {
      // 로컬 스토리지 값 삭제
      useAccessTokenStore.getState().setAccessToken('')
      useRefreshTokenStore.getState().setRefreshToken('')
      window.location.href = '/login'
      return Promise.reject(error)
    }

    // 그 외 요청에서 401 발생 시
    if (error.response && error.response.status === 401 && !originalRequest._retry && error.response.data?.title.includes('토큰')) {
      originalRequest._retry = true
      try {
        // refresh 요청
        const refreshToken = useRefreshTokenStore.getState().refreshToken
        const refreshRes = await api.post('/auth/refresh', { refresh_token: refreshToken })
        const refreshData = refreshRes.data?.content?.data
        if (refreshData?.access_token) {
          // 토큰 저장
          useAccessTokenStore.getState().setAccessToken(refreshData.access_token)
          if (refreshData.refresh_token) {
            useRefreshTokenStore.getState().setRefreshToken(refreshData.refresh_token)
          }
          // Authorization 헤더 갱신 후 원래 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${refreshData.access_token}`
          return api(originalRequest)
        } else {
          // 로컬 스토리지 값 삭제
          useAccessTokenStore.getState().setAccessToken('')
          useRefreshTokenStore.getState().setRefreshToken('')
          window.location.href = '/login'
          return Promise.reject(error)
        }
      } catch (refreshError) {
        // 로컬 스토리지 값 삭제
        useAccessTokenStore.getState().setAccessToken('')
        useRefreshTokenStore.getState().setRefreshToken('')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // 그 외 에러는 그대로 throw
    return Promise.reject(error)
  }
)

export default api
