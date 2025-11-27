export interface SocialLinks {
  github: string
  website: string
  linkedin: string
  notion: string
}

export interface MemberResponse {
  memberId: number
  id: number
  email: string
  nickname: string
  profileImage: string
  handle: string
  bio: string
  role: string
  company: string
  location: string
  primaryStack: string[]
  interests: string[]
  socialLinks: SocialLinks
}
