import type { PopularTag } from '@/types/tag'

const DEFAULT_TAGS: PopularTag[] = [
  { name: 'JavaScript', count: 45 },
  { name: 'React', count: 38 },
  { name: 'TypeScript', count: 32 },
  { name: 'Node.js', count: 28 },
  { name: 'CSS', count: 25 },
  { name: 'Python', count: 22 },
  { name: 'Java', count: 20 },
  { name: 'Spring', count: 18 },
  { name: 'Docker', count: 15 },
  { name: 'AWS', count: 12 },
]

export const generateMockTags = (limit?: number): PopularTag[] => {
  if (!limit) {
    return DEFAULT_TAGS
  }
  return DEFAULT_TAGS.slice(0, limit)
}
