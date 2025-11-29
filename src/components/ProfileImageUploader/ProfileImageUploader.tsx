import { useState } from 'react'
import styles from './ProfileImageUploader.module.css'

interface ProfileImageUploaderProps {
  imageUrl?: string
  onFileSelected: (file: File) => void
}

export default function ProfileImageUploader({ imageUrl = '', onFileSelected }: ProfileImageUploaderProps) {
  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl)
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
    if (!validTypes.includes(file.type)) {
      setError('JPG, PNG, GIF 형식의 이미지만 업로드 가능합니다.')
      e.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('이미지 크기는 5MB를 초과할 수 없습니다.')
      e.target.value = ''
      return
    }

    setError('')

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setCurrentImageUrl(dataUrl)
      onFileSelected(file)
    }
    reader.readAsDataURL(file)
  }

  const handleContainerClick = () => {
    document.getElementById('profileImageInput')?.click()
  }

  return (
    <div className={styles.profileImageUploader}>
      <label className={styles.formLabel}>프로필 사진</label>
      <div className={styles.profileUploadSection}>
        <div
          className={styles.profileImageContainer}
          onClick={handleContainerClick}
        >
          {currentImageUrl ? (
            <img src={currentImageUrl} alt="프로필" className={styles.profileImage} />
          ) : (
            <div className={styles.profilePlaceholder}>
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <path d="M30 30C37.18 30 43 24.18 43 17C43 9.82 37.18 4 30 4C22.82 4 17 9.82 17 17C17 24.18 22.82 30 30 30ZM30 37C21.34 37 4 41.34 4 50V56H56V50C56 41.34 38.66 37 30 37Z" fill="#999"/>
              </svg>
            </div>
          )}
          <div className={styles.profileOverlay}>
            <span className={styles.profileOverlayText}>변경</span>
          </div>
        </div>
        <input
          type="file"
          id="profileImageInput"
          className={styles.profileInputHidden}
          accept="image/jpeg,image/png,image/jpg,image/gif"
          onChange={handleFileChange}
        />
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  )
}
