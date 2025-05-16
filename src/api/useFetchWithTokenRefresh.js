import { useNavigate } from 'react-router-dom'
import { api } from '@hooks/useAxios'
import { useAccessTokenStore, useRefreshTokenStore } from '@store/useUserStore'

/**
 * 인증 만료 시 자동으로 토큰을 갱신하고, 실패 시 /login으로 이동하는 fetch 래퍼 훅
 * @returns {Object} { wrappedGet, wrappedPost, wrappedRequest }
 */
const useFetchWithTokenRefresh = () => {
  const navigate = useNavigate()
  const accessToken = useAccessTokenStore(state => state.accessToken)
  const setAccessToken = useAccessTokenStore(state => state.setAccessToken)
  const refreshToken = useRefreshTokenStore(state => state.refreshToken)

  // 내부에서 직접 토큰 갱신
  const refreshAccessToken = async () => {
    try {
      const response = await api.post('/auth/refresh', {
        refresh_token: refreshToken
      })
      const newAccessToken = response.data?.content?.data?.access_token
      if (newAccessToken) {
        setAccessToken(newAccessToken)
        return newAccessToken
      } else {
        setAccessToken(null)
        throw new Error('Failed to refresh access token')
      }
    } catch (error) {
      setAccessToken(null)
      return error
    }
  }

  // 공통 요청 래퍼
  // config는 axios 요청 설정 객체입니다.
  // headers, params, data 등의 옵션을 포함할 수 있습니다.
  // 예: { headers: {...}, params: {...}, data: {...} }
  const wrappedRequest = async (method, url, config = {}) => {
    const headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${accessToken}`
    }
    const mergedConfig = { ...config, headers }
    try {
      if (method === 'get' || method === 'delete') {
        const response = await api[method](url, mergedConfig)
        return response.data.content.data
      } else {
        const data = mergedConfig.data
        const configForAxios = { ...mergedConfig }
        delete configForAxios.data
        const response = await api[method](url, data, configForAxios)
        return response.data.content.data
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const refreshResult = await refreshAccessToken()
        if (refreshResult instanceof Error) {
          navigate('/login')
          return
        }
        // 토큰 갱신 성공 시 단 1회만 재요청, 실패하면 /login 이동
        const newAccessToken = useAccessTokenStore.getState().accessToken
        const retryHeaders = {
          ...(config.headers || {}),
          Authorization: `Bearer ${newAccessToken}`
        }
        const retryConfig = { ...config, headers: retryHeaders }
        try {
          if (method === 'get' || method === 'delete') {
            const retryResponse = await api[method](url, retryConfig)
            return retryResponse.data.content.data;
          } else {
            const data = retryConfig.data
            const configForAxios = { ...retryConfig }
            delete configForAxios.data
            const retryResponse = await api[method](url, data, configForAxios)
            return retryResponse.data.content.data;
          }
        } catch {
          navigate('/login')
          return
        }
      } else {
        throw error
      }
    }
  }

  /**
   * GET 요청 (request body도 전달 가능)
   * @param {string} url - 요청할 API 엔드포인트
   * @param {object} [config] - axios config (params, headers, data 등)
   * @returns {Promise<any>} - API 응답 데이터
   * @example
   *   await Get('/api/endpoint', { params: { foo: 1 }, data: { bar: 2 } })
   */
  const Get = (url, config) => wrappedRequest('get', url, config)

  /**
   * POST 요청
   * @param {string} url - 요청할 API 엔드포인트
   * @param {object} [data] - request body
   * @param {object} [config] - axios config (params, headers 등)
   * @returns {Promise<any>} - API 응답 데이터
   * @example
   *   await Post('/api/endpoint', { foo: 1 }, { params: { bar: 2 } })
   */
  const Post = (url, data, config) => wrappedRequest('post', url, { ...config, data })

  /**
   * PUT 요청
   * @param {string} url - 요청할 API 엔드포인트
   * @param {object} [data] - request body
   * @param {object} [config] - axios config (params, headers 등)
   * @returns {Promise<any>} - API 응답 데이터
   * @example
   *   await Put('/api/endpoint', { foo: 1 }, { params: { bar: 2 } })
   */
  const Put = (url, data, config) => wrappedRequest('put', url, { ...config, data })

  return { Get, Post, Put, wrappedRequest }
}

export default useFetchWithTokenRefresh 