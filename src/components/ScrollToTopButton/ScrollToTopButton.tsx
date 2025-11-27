import { useState, useEffect } from 'react'
import styles from './ScrollToTopButton.module.css'

interface ScrollToTopButtonProps {
  threshold?: number
}

export default function ScrollToTopButton({ threshold = 300 }: ScrollToTopButtonProps) {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > threshold)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      className={`${styles.scrollTopBtn} ${showScrollTop ? styles.visible : ''}`}
      onClick={scrollToTop}
      aria-label="맨 위로 이동"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
