import httpClient from './httpClient'
import type { ApiResponse } from '@/types/common'

export interface ImageSignatureData {
  apiKey: string
  cloudName: string
  timestamp: number
  signature: string
  uploadPreset: string
  folder?: string
}

export interface ImageSignatureParams {
  type?: string
}

export const uploadApi = {
  getImageSignature: async (
    params?: ImageSignatureParams
  ): Promise<ApiResponse<ImageSignatureData>> => {
    const searchParams = new URLSearchParams()
    if (params?.type) {
      searchParams.set('type', params.type)
    }
    const query = searchParams.toString()
    const endpoint = query ? `/api/v1/images/sign?${query}` : '/api/v1/images/sign'
    return httpClient.get<ApiResponse<ImageSignatureData>>(endpoint)
  },
}

export default uploadApi
