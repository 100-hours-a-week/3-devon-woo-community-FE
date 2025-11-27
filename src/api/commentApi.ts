import httpClient from './httpClient'
import type { ApiResponse, PageResponse } from '@/types/common'
import type {
  CommentResponse,
  CommentCreateRequest,
  CommentUpdateRequest,
} from '@/types/comment'

export const commentApi = {
  getComments: async (
    postId: number,
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<PageResponse<CommentResponse>>> => {
    return httpClient.get(
      `/api/v1/posts/${postId}/comments?page=${page}&size=${size}`
    )
  },

  createComment: async (
    postId: number,
    data: CommentCreateRequest
  ): Promise<ApiResponse<CommentResponse>> => {
    return httpClient.post(`/api/v1/posts/${postId}/comments`, data)
  },

  updateComment: async (
    commentId: number,
    data: CommentUpdateRequest
  ): Promise<ApiResponse<CommentResponse>> => {
    return httpClient.put(`/api/v1/comments/${commentId}`, data)
  },

  deleteComment: async (commentId: number): Promise<ApiResponse<null>> => {
    return httpClient.delete(`/api/v1/comments/${commentId}`)
  },
}

export default commentApi
