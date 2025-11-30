import styles from './LoadingSpinner.module.css'

interface LoadingSpinnerProps {
  message?: string
  fullPage?: boolean
}

export default function LoadingSpinner({ message, fullPage = false }: LoadingSpinnerProps) {
  return (
    <div className={`${styles.loading} ${fullPage ? styles.fullPage : ''}`}>
      <div className={styles.loadingSpinner} />
      {message && <p className={styles.loadingMessage}>{message}</p>}
    </div>
  )
}
