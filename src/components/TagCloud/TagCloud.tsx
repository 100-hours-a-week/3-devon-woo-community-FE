import { useState } from 'react'
import styles from './TagCloud.module.css'

interface Tag {
  name: string
  count?: number
}

interface TagCloudProps {
  tags: Tag[]
  onTagClick?: (tagName: string) => void
}

export default function TagCloud({ tags, onTagClick }: TagCloudProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  if (!tags || tags.length === 0) {
    return (
      <div className={styles.tagCloud}>
        <h3 className={styles.tagCloudTitle}>태그</h3>
        <p className={styles.tagCloudEmpty}>태그가 없습니다.</p>
      </div>
    )
  }

  const handleTagClick = (tagName: string) => {
    setSelectedTag(tagName)
    if (onTagClick) {
      onTagClick(tagName)
    }
  }

  return (
    <div className={styles.tagCloud}>
      <h3 className={styles.tagCloudTitle}>태그</h3>
      <div className={styles.tagCloudList}>
        {tags.map(tag => (
          <button
            key={tag.name}
            className={`${styles.tagCloudTag} ${selectedTag === tag.name ? styles.isActive : ''}`}
            onClick={() => handleTagClick(tag.name)}
          >
            <span className={styles.tagCloudTagName}>{tag.name}</span>
            {tag.count !== undefined && (
              <span className={styles.tagCloudTagCount}>{tag.count}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
