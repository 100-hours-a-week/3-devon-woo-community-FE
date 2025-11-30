import httpClient from './httpClient'
import type { ApiResponse } from '@/types/common'

export type ImageUploadProvider = 'cloudinary' | 's3'

export interface CreatePresignedUploadParams {
  fileName: string
  fileType: string
  provider: ImageUploadProvider
}

export interface PresignedUploadPayload {
  provider: ImageUploadProvider
  uploadUrl: string
  fileUrl: string
  /**
   * Cloudinary/Form-data style uploads require key/value fields.
   */
  fields?: Record<string, string>
  /**
   * S3 PUT uploads often include custom headers (ACL, etc).
   */
  headers?: Record<string, string>
}

export const uploadApi = {
  createPresignedUpload: async (
    params: CreatePresignedUploadParams
  ): Promise<ApiResponse<PresignedUploadPayload>> => {
    return httpClient.post('/api/v1/uploads/presign', params)
  },
}

export default uploadApi
