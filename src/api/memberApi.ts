import httpClient from './httpClient'
import type { ApiResponse } from '@/types/common'
import type { MemberResponse } from '@/types/member'

export const memberApi = {
  getProfile: async (memberId?: number): Promise<ApiResponse<MemberResponse>> => {
    const url = memberId ? `/api/v1/members/${memberId}` : '/api/v1/members/me'
    return httpClient.get(url)
  },

  updateProfile: async (data: Partial<MemberResponse>): Promise<ApiResponse<MemberResponse>> => {
    return httpClient.put('/api/v1/members/me', data)
  },

  updatePassword: async (data: {
    currentPassword: string
    newPassword: string
  }): Promise<ApiResponse<null>> => {
    return httpClient.put('/api/v1/members/me/password', data)
  },

  deleteAccount: async (): Promise<ApiResponse<null>> => {
    return httpClient.delete('/api/v1/members/me')
  },
}

export default memberApi
