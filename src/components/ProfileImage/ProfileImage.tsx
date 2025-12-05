import { useState } from 'react'

interface ProfileImageProps {
  imageUrl?: string | null
  name: string
  className?: string
  alt?: string
}

const getFallbackAvatar = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff&size=128`

export default function ProfileImage({ imageUrl, name, className, alt }: ProfileImageProps) {
  const [hasError, setHasError] = useState(false)

  const safeName = name || 'User'
  const src = !hasError && imageUrl ? imageUrl : getFallbackAvatar(safeName)

  return (
    <img
      src={src}
      alt={alt || safeName}
      className={className}
      onError={() => {
        if (!hasError) {
          setHasError(true)
        }
      }}
    />
  )
}

