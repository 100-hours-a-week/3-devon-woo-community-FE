export interface PageResponse<T> {
  items: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface PageInfo {
  hasNext: boolean
  hasPrevious: boolean
  isFirst: boolean
  isLast: boolean
}

export const getPageInfo = <T>(page: PageResponse<T>): PageInfo => ({
  hasNext: page.page < page.totalPages - 1,
  hasPrevious: page.page > 0,
  isFirst: page.page === 0,
  isLast: page.page === page.totalPages - 1,
})
