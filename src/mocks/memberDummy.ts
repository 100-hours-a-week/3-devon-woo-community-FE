import type { MemberResponse } from '@/types/member'

export const generateMockMember = (memberId: number = 1): MemberResponse => ({
  memberId,
  id: memberId,
  email: 'shwoo@example.com',
  nickname: 'SH Woo',
  profileImage:
    'https://ui-avatars.com/api/?name=SH+Woo&background=2563eb&color=fff&size=160',
  handle: 'Fullstack Developer / TypeScript Enthusiast',
  bio: '프론트엔드와 백엔드를 넘나들며 커뮤니티 서비스를 만드는 개발자 SH Woo 입니다.',
  role: 'Fullstack Engineer',
  company: 'Dev Community',
  location: 'Seoul, Korea',
  primaryStack: ['TypeScript', 'React', 'Node.js', 'Vite'],
  interests: ['Developer Experience', 'Frontend Architecture', 'Open Source'],
  socialLinks: {
    github: 'https://github.com/sh-woo',
    website: 'https://shwoo.dev',
    linkedin: 'https://www.linkedin.com/in/sh-woo',
    notion: 'https://shwoo.notion.site',
  },
})

export default generateMockMember

