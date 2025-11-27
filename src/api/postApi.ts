import httpClient from './httpClient'
import type { ApiResponse, PageResponse } from '@/types/common'
import type { PostSummaryResponse, PostResponse } from '@/types/post'

interface GetPostsParams {
  page?: number
  size?: number
  sort?: string
  memberId?: number
  search?: string
}

export const postApi = {
  getPosts: async (
    params: GetPostsParams = {}
  ): Promise<ApiResponse<PageResponse<PostSummaryResponse>>> => {
    const { page = 0, size = 20, sort = 'createdAt,desc', memberId, search } = params

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort,
    })

    if (memberId !== undefined) {
      queryParams.append('memberId', memberId.toString())
    }

    if (search) {
      queryParams.append('search', search)
    }

    return httpClient.get(`/api/v1/posts?${queryParams.toString()}`)
  },

  getPostById: async (
    postId: number,
    memberId?: number
  ): Promise<ApiResponse<PostResponse>> => {
    const queryParams = memberId ? `?memberId=${memberId}` : ''
    return httpClient.get(`/api/v1/posts/${postId}${queryParams}`)
  },

  createPost: async (postData: unknown): Promise<ApiResponse<PostResponse>> => {
    return httpClient.post('/api/v1/posts', postData)
  },

  updatePost: async (
    postId: number,
    postData: unknown
  ): Promise<ApiResponse<PostResponse>> => {
    return httpClient.put(`/api/v1/posts/${postId}`, postData)
  },

  deletePost: async (postId: number): Promise<ApiResponse<null>> => {
    return httpClient.delete(`/api/v1/posts/${postId}`)
  },

  likePost: async (postId: number): Promise<ApiResponse<{ liked: boolean }>> => {
    return httpClient.post(`/api/v1/posts/${postId}/like`)
  },
}

export default postApi
