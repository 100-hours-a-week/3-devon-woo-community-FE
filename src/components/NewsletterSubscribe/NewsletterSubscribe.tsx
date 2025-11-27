import { useState, FormEvent, ChangeEvent } from 'react'
import styles from './NewsletterSubscribe.module.css'

interface NewsletterSubscribeProps {
  onSubscribe?: (email: string) => Promise<void>
}

export default function NewsletterSubscribe({ onSubscribe }: NewsletterSubscribeProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [error, setError] = useState('')

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email || !validateEmail(email)) {
      setError('유효한 이메일 주소를 입력해주세요.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      if (onSubscribe) {
        await onSubscribe(email)
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      setIsLoading(false)
      setIsSubscribed(true)
    } catch (error) {
      setIsLoading(false)
      setError(error instanceof Error ? error.message : '구독에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setError('')
  }

  if (isSubscribed) {
    return (
      <div className={styles.newsletter}>
        <h3 className={styles.newsletterTitle}>뉴스레터</h3>
        <div className={styles.newsletterSuccess}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" fill="var(--color-success-light)" />
            <path
              d="M16 24l6 6 10-12"
              stroke="var(--color-success)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className={styles.newsletterSuccessText}>구독이 완료되었습니다!</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.newsletter}>
      <h3 className={styles.newsletterTitle}>뉴스레터</h3>
      <p className={styles.newsletterDescription}>
        새로운 포스트를 이메일로 받아보세요
      </p>

      <form className={styles.newsletterForm} onSubmit={handleSubmit}>
        <div className={styles.newsletterInputWrapper}>
          <input
            type="email"
            className={styles.newsletterInput}
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={handleEmailChange}
            disabled={isLoading}
            required
          />
          <button
            type="submit"
            className={styles.newsletterButton}
            disabled={isLoading}
          >
            {isLoading ? '구독 중...' : '구독하기'}
          </button>
        </div>

        {error && <p className={styles.newsletterError}>{error}</p>}
      </form>
    </div>
  )
}
