import { useEffect } from 'react'
import styles from './Toast.module.css'

interface ToastProps {
  message: string
  isVisible: boolean
  isError?: boolean
  duration?: number
  onClose: () => void
}

export default function Toast({ message, isVisible, isError = false, duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  return (
    <div className={`${styles.toast} ${isVisible ? styles.show : ''} ${isError ? styles.error : ''}`}>
      {message}
    </div>
  )
}
