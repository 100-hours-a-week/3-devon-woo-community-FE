import { MemberResponse } from '@/types/member'

export interface PostSummaryResponse {
  postId: number
  title: string
  summary: string
  thumbnail: string
  member: MemberResponse
  createdAt: string
  viewCount: number
  likeCount: number
  commentCount: number
}
