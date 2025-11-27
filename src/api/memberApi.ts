import httpClient from './httpClient'
import type { ApiResponse } from '@/types/common'
import { createSuccessResponse } from '@/types/common'
import type { MemberResponse } from '@/types/member'
import { USE_MOCK } from '@/config/env'
import { generateMockMember } from '@/mocks/memberDummy'

export const memberApi = {
  getProfile: async (memberId?: number): Promise<ApiResponse<MemberResponse>> => {
    if (USE_MOCK) {
      const mockMember = generateMockMember(memberId ?? 1)
      return createSuccessResponse(mockMember)
    }

    const url = memberId ? `/api/v1/members/${memberId}` : '/api/v1/members/me'
    return httpClient.get(url)
  },

  updateProfile: async (data: Partial<MemberResponse>): Promise<ApiResponse<MemberResponse>> => {
    if (USE_MOCK) {
      const updatedMock = { ...generateMockMember(), ...data } as MemberResponse
      return createSuccessResponse(updatedMock)
    }

    return httpClient.put('/api/v1/members/me', data)
  },

  updatePassword: async (data: {
    currentPassword: string
    newPassword: string
  }): Promise<ApiResponse<null>> => {
    if (USE_MOCK) {
      return createSuccessResponse(null)
    }

    return httpClient.put('/api/v1/members/me/password', data)
  },

  deleteAccount: async (): Promise<ApiResponse<null>> => {
    if (USE_MOCK) {
      return createSuccessResponse(null)
    }

    return httpClient.delete('/api/v1/members/me')
  },
}

export default memberApi
