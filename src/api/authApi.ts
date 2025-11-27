import httpClient from './httpClient'
import type { ApiResponse } from '@/types/common'
import type { LoginRequest, LoginResponse, SignupRequest } from '@/types/auth'

export const authApi = {
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return httpClient.post('/auth/login', data)
  },

  signup: async (data: SignupRequest): Promise<ApiResponse<LoginResponse>> => {
    return httpClient.post('/auth/signup', data)
  },

  logout: async (): Promise<ApiResponse<null>> => {
    return httpClient.post('/auth/logout')
  },

  refresh: async (): Promise<ApiResponse<{ accessToken: string }>> => {
    return httpClient.post('/auth/refresh', {}, { withCredentials: true })
  },

  checkEmail: async (email: string): Promise<ApiResponse<{ available: boolean }>> => {
    return httpClient.get(`/auth/check-email?email=${encodeURIComponent(email)}`)
  },

  checkNickname: async (nickname: string): Promise<ApiResponse<{ available: boolean }>> => {
    return httpClient.get(`/auth/check-nickname?nickname=${encodeURIComponent(nickname)}`)
  },
}

export default authApi
