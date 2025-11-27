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
  const allComments: CommentResponse[] = [
    {
      commentId: 1,
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
      commentId: 2,
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
  ]

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

