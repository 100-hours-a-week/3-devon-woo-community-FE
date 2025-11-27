import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import Header from '@/components/Header'
import FormField from '@/components/FormField'
import styles from './LoginPage.module.css'

const OAUTH_API_BASE_URL = 'http://localhost:8080'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login({ email, password })
      navigate('/')
    } catch (err) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = (provider: string) => {
    window.location.href = `${OAUTH_API_BASE_URL}/oauth2/authorization/${provider}`
  }

  const handleInputChange = () => {
    if (error) setError('')
  }

  return (
    <div className={styles.loginPage}>
      <Header variant="minimal" />

      <main className={styles.mainContainer}>
        <div className={styles.loginWrapper}>
          <h2 className={styles.pageTitle}>로그인</h2>

          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <FormField
              type="email"
              placeholder="이메일"
              value={email}
              onChange={value => {
                setEmail(value)
                handleInputChange()
              }}
              required
              autoComplete="email"
            />

            <FormField
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={value => {
                setPassword(value)
                handleInputChange()
              }}
              required
              autoComplete="current-password"
              showPasswordToggle
            />

            <div className={`${styles.errorMessage} ${error ? styles.visible : ''}`}>
              {error || ' '}
            </div>

            <button
              type="submit"
              className={`${styles.btnPrimary} ${styles.btnLogin}`}
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className={styles.divider}>
            <span>또는</span>
          </div>

          <div className={styles.oauthSection}>
            <div className={styles.oauthButtons}>
              <button
                type="button"
                className={`${styles.oauthBtn} ${styles.google}`}
                onClick={() => handleOAuthLogin('google')}
                aria-label="구글로 로그인"
                title="구글로 로그인"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M18.17 8.37H10v3.45h4.71c-.4 2.06-2.02 3.18-4.71 3.18-2.87 0-5.2-2.33-5.2-5.2s2.33-5.2 5.2-5.2c1.24 0 2.37.44 3.25 1.17l2.58-2.58C14.33 1.85 12.28 1 10 1 5.03 1 1 5.03 1 10s4.03 9 9 9c5.18 0 8.92-3.64 8.92-8.78 0-.59-.06-1.17-.17-1.73-.08-.33-.17-.66-.58-1.12z" fill="currentColor"/>
                </svg>
              </button>
              <button
                type="button"
                className={`${styles.oauthBtn} ${styles.github}`}
                onClick={() => handleOAuthLogin('github')}
                aria-label="깃허브로 로그인"
                title="깃허브로 로그인"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.165 20 14.418 20 10c0-5.523-4.477-10-10-10z" fill="currentColor"/>
                </svg>
              </button>
              <button
                type="button"
                className={`${styles.oauthBtn} ${styles.kakao}`}
                onClick={() => handleOAuthLogin('kakao')}
                aria-label="카카오로 로그인"
                title="카카오로 로그인"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M10 0C4.477 0 0 3.582 0 8c0 2.866 1.946 5.37 4.867 6.75l-1.247 4.597c-.113.418.368.748.731.502l5.028-3.417c.206.011.414.018.621.018 5.523 0 10-3.582 10-8s-4.477-8-10-8z" fill="currentColor"/>
                </svg>
              </button>
              <button
                type="button"
                className={`${styles.oauthBtn} ${styles.naver}`}
                onClick={() => handleOAuthLogin('naver')}
                aria-label="네이버로 로그인"
                title="네이버로 로그인"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M13.6 10.8L6.4 0H0v20h6.4V9.2L13.6 20H20V0h-6.4v10.8z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.formLinks}>
            <a href="#" className={styles.link}>이메일</a>
            <span className={styles.dividerDot}>|</span>
            <a href="#" className={styles.link}>비밀번호</a>
            <span>를 잊으셨나요?</span>
          </div>

          <div className={styles.signupLink}>
            처음 지원하실경우엔 <Link to="/signup">회원가입</Link>이 필요합니다.
          </div>
        </div>
      </main>
    </div>
  )
}
