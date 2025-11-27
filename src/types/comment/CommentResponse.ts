import { MemberResponse } from '@/types/member'

export interface CommentResponse {
  commentId: number
  postId: number
  content: string
  member: MemberResponse
  createdAt: string
  updatedAt: string
}

export interface CommentCreateRequest {
  content: string
}

export interface CommentUpdateRequest {
  content: string
}
