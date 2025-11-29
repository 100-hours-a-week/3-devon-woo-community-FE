import httpClient from './httpClient'
import type { ApiResponse } from '@/types/common'
import { createSuccessResponse } from '@/types/common'
import type { PopularTag } from '@/types/tag'
import { USE_MOCK } from '@/config/env'
import { generateMockTags } from '@/mocks/tagDummy'

export interface PopularTagResponse {
  items: PopularTag[]
}

export const tagApi = {
  getPopularTags: async (limit: number = 10): Promise<ApiResponse<PopularTagResponse>> => {
    if (USE_MOCK) {
      const tags = generateMockTags(limit)
      return createSuccessResponse({ items: tags })
    }

    const response = await httpClient.get<ApiResponse<PopularTagResponse>>(
      `/api/v1/tags/popular?size=${limit}`
    )
    return response
  },
}

export default tagApi
