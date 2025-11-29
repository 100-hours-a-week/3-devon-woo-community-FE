export interface PostCreateRequest {
  title: string
  content: string
  image?: string
  summary?: string
  tags?: string[]
  seriesId?: number | null
  visibility?: 'public' | 'private'
  isDraft?: boolean
  commentsAllowed?: boolean
}

export interface PostUpdateRequest {
  title?: string
  content?: string
  image?: string
  summary?: string
  tags?: string[]
  seriesId?: number | null
  visibility?: 'public' | 'private'
  commentsAllowed?: boolean
}
