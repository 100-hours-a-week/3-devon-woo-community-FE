import type { SocialLinks } from './MemberResponse'

export interface UpdateProfileRequest {
  nickname?: string
  profileImage?: string
  handle?: string
  bio?: string
  role?: string
  company?: string
  location?: string
  primaryStack?: string[]
  interests?: string[]
  socialLinks?: Partial<SocialLinks>
}
