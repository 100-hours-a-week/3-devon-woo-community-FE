import type { CommentResponse } from '@/types/comment'
import type { PageResponse } from '@/types/common'

const baseMember = {
  memberId: 1,
  id: 1,
  email: 'user1@example.com',
  nickname: 'CodeMaster',
  profileImage:
    'https://ui-avatars.com/api/?name=CodeMaster&background=667eea&color=fff&size=128',
  handle: 'Frontend Developer',
  bio: '',
  role: 'Frontend Developer',
  company: 'Tech Inc',
  location: 'Seoul',
  primaryStack: ['React', 'TypeScript'],
  interests: ['Frontend'],
  socialLinks: { github: '', website: '', linkedin: '', notion: '' },
}

export const generateMockCommentsPage = (
  postId: number,
  page: number = 0,
  size: number = 20
): PageResponse<CommentResponse> => {
  const baseComments: Omit<CommentResponse, 'commentId'>[] = [
    {
      postId,
      content:
        '정말 유익한 글이네요! 마크다운으로 작성하니 훨씬 깔끔하고 관리하기 편한 것 같아요.',
      member: {
        ...baseMember,
      },
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      postId,
      content:
        '코드 블록 부분이 특히 마음에 드네요. 다음 프로젝트에 적용해봐야겠습니다!',
      member: {
        ...baseMember,
        memberId: 2,
        id: 2,
        email: 'user2@example.com',
        nickname: 'DevNinja',
        profileImage:
          'https://ui-avatars.com/api/?name=DevNinja&background=764ba2&color=fff&size=128',
        handle: 'Backend Engineer',
        role: 'Backend Engineer',
        company: 'Startup Co',
        location: 'Busan',
        primaryStack: ['Node.js', 'Express'],
        interests: ['Backend'],
      },
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      postId,
      content:
        '예제 코드가 이해하기 쉽게 잘 정리되어 있어서 팀 온보딩 자료로 써도 좋을 것 같아요.',
      member: {
        ...baseMember,
        memberId: 3,
        id: 3,
        email: 'user3@example.com',
        nickname: 'Onboarder',
        profileImage:
          'https://ui-avatars.com/api/?name=Onboarder&background=34d399&color=fff&size=128',
        handle: 'Frontend Lead',
        role: 'Frontend Lead',
        company: 'EduTech',
        location: 'Seoul',
        primaryStack: ['React', 'Recoil', 'Vite'],
        interests: ['Frontend', 'Education'],
      },
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
    {
      postId,
      content:
        '실제 서비스에 적용해봤는데 성능이 꽤 좋아졌습니다. 특히 리스트 가상화 부분이 큰 도움이 됐어요.',
      member: {
        ...baseMember,
        memberId: 4,
        id: 4,
        email: 'user4@example.com',
        nickname: 'PerfHunter',
        profileImage:
          'https://ui-avatars.com/api/?name=PerfHunter&background=f97316&color=fff&size=128',
        handle: 'Performance Engineer',
        role: 'Performance Engineer',
        company: 'Scale Corp',
        location: 'Daejeon',
        primaryStack: ['React', 'Next.js'],
        interests: ['Performance', 'Monitoring'],
      },
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      postId,
      content:
        '초보자 입장에서 개념을 다시 정리하는 데 큰 도움이 되었습니다. 이런 기초 정리 글이 더 많았으면 좋겠어요.',
      member: {
        ...baseMember,
        memberId: 5,
        id: 5,
        email: 'user5@example.com',
        nickname: 'NewbieDev',
        profileImage:
          'https://ui-avatars.com/api/?name=NewbieDev&background=60a5fa&color=fff&size=128',
        handle: 'Junior Developer',
        role: 'Junior Developer',
        company: 'Startup Co',
        location: 'Seoul',
        primaryStack: ['JavaScript'],
        interests: ['Web Development'],
      },
      createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    },
    {
      postId,
      content:
        '테스트 코드까지 같이 보여주셔서 실제 현업 코드에 바로 적용하기 좋네요. 감사합니다!',
      member: {
        ...baseMember,
        memberId: 6,
        id: 6,
        email: 'user6@example.com',
        nickname: 'Tester',
        profileImage:
          'https://ui-avatars.com/api/?name=Tester&background=a855f7&color=fff&size=128',
        handle: 'QA Engineer',
        role: 'QA Engineer',
        company: 'Quality Labs',
        location: 'Seoul',
        primaryStack: ['Playwright', 'Cypress'],
        interests: ['Testing'],
      },
      createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    },
    {
      postId,
      content:
        '다국어 처리나 접근성 부분에 대한 내용도 나중에 한번 다뤄주시면 좋겠습니다. 잘 읽었습니다!',
      member: {
        ...baseMember,
        memberId: 7,
        id: 7,
        email: 'user7@example.com',
        nickname: 'A11yDev',
        profileImage:
          'https://ui-avatars.com/api/?name=A11yDev&background=22c55e&color=fff&size=128',
        handle: 'Web Engineer',
        role: 'Web Engineer',
        company: 'Global Service',
        location: 'Incheon',
        primaryStack: ['React', 'TypeScript'],
        interests: ['Accessibility', 'i18n'],
      },
      createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    },
    {
      postId,
      content:
        '아키텍처에 대한 고민이 느껴지는 글이네요. 팀 룰 정할 때 참고하면 좋을 것 같습니다.',
      member: {
        ...baseMember,
        memberId: 8,
        id: 8,
        email: 'user8@example.com',
        nickname: 'Architector',
        profileImage:
          'https://ui-avatars.com/api/?name=Architector&background=f59e0b&color=fff&size=128',
        handle: 'Software Architect',
        role: 'Software Architect',
        company: 'Enterprise Co',
        location: 'Seoul',
        primaryStack: ['Node.js', 'Spring'],
        interests: ['Architecture'],
      },
      createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    },
    {
      postId,
      content:
        '코드 스타일 가이드와 함께 읽으니 훨씬 정리가 잘 되네요. 린터 설정 글이랑도 이어지면 좋을 듯 합니다.',
      member: {
        ...baseMember,
        memberId: 9,
        id: 9,
        email: 'user9@example.com',
        nickname: 'StyleGuide',
        profileImage:
          'https://ui-avatars.com/api/?name=StyleGuide&background=3b82f6&color=fff&size=128',
        handle: 'Frontend Engineer',
        role: 'Frontend Engineer',
        company: 'Design Studio',
        location: 'Seoul',
        primaryStack: ['React', 'ESLint', 'Prettier'],
        interests: ['DX', 'Tooling'],
      },
      createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    },
    {
      postId,
      content:
        '시리즈로 다른 주제도 계속 연재해주시면 정기적으로 찾아오게 될 것 같아요. 좋은 글 감사합니다 :)',
      member: {
        ...baseMember,
        memberId: 10,
        id: 10,
        email: 'user10@example.com',
        nickname: 'SeriesReader',
        profileImage:
          'https://ui-avatars.com/api/?name=SeriesReader&background=ec4899&color=fff&size=128',
        handle: 'Fullstack Developer',
        role: 'Fullstack Developer',
        company: 'Side Project',
        location: 'Gwangju',
        primaryStack: ['React', 'Node.js'],
        interests: ['Side Project'],
      },
      createdAt: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString(),
    },
  ]

  const totalComments = 20

  const allComments: CommentResponse[] = Array.from(
    { length: totalComments },
    (_, index) => {
      const template = baseComments[index % baseComments.length]
      const timeOffsetHours = 1 + index

      return {
        commentId: index + 1,
        postId,
        content: template.content,
        member: {
          ...template.member,
        },
        createdAt: new Date(
          Date.now() - timeOffsetHours * 60 * 60 * 1000
        ).toISOString(),
        updatedAt: new Date(
          Date.now() - timeOffsetHours * 60 * 60 * 1000
        ).toISOString(),
      }
    }
  )

  const startIndex = page * size
  const endIndex = startIndex + size

  const pageItems = allComments.slice(startIndex, endIndex)

  return {
    items: pageItems,
    page,
    size,
    totalElements: allComments.length,
    totalPages: 1,
  }
}

export const generateMockComment = (
  postId: number,
  content: string
): CommentResponse => ({
  commentId: Date.now(),
  postId,
  content,
  member: {
    ...baseMember,
    nickname: 'Current User',
    email: 'current@example.com',
    profileImage:
      'https://ui-avatars.com/api/?name=User&background=667eea&color=fff&size=128',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})
