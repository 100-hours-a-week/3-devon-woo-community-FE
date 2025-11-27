import { MemberResponse } from '@/types/member'

export interface PostResponse {
  postId: number
  member: MemberResponse
  title: string
  content: string
  summary: string
  imageUrl: string
  createdAt: string
  updatedAt: string
  viewCount: number
  likeCount: number
  commentCount: number
  isLiked: boolean
  tags: string[]
  seriesId: number | null
  seriesName: string
  visibility: 'public' | 'private'
}
