import { MemberResponse } from '@/types/member'

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  member: MemberResponse
}
