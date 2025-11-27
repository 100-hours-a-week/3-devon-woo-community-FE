import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import Header from '@/components/Header'
import FormField from '@/components/FormField'
import SocialLoginButtons, { type OAuthProvider } from '@/components/SocialLogin'
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

  const handleOAuthLogin = (provider: OAuthProvider) => {
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

          <SocialLoginButtons onProviderClick={handleOAuthLogin} />

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
