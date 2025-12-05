import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import ProfileImage from '@/components/ProfileImage'
import styles from './Header.module.css'

interface HeaderProps {
  variant?: 'full' | 'minimal'
}

export default function Header({ variant = 'full' }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const isMinimal = variant === 'minimal'

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logoSection}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoText}>Tech Blog</span>
          </Link>
        </div>

        {!isMinimal && (
          <>
            <nav className={styles.navMenu}>
              <Link to="/" className={styles.navLink}>
                Posts
              </Link>
              <Link to="/about" className={styles.navLink}>
                About
              </Link>
              {isAuthenticated && (
                <Link to="/profile" className={styles.navLink}>
                  Profile
                </Link>
              )}
            </nav>

            <form className={styles.searchSection} onSubmit={handleSearch}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="검색"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button type="submit" className={styles.searchBtn} aria-label="검색">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          </>
        )}

        <div className={styles.authSection}>
          {isAuthenticated ? (
            <div className={styles.profileMenu}>
              <button
                className={styles.profileBtn}
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <ProfileImage
                  imageUrl={user?.profileImage}
                  name={user?.nickname || 'User'}
                  alt={user?.nickname || 'User'}
                  className={styles.profileImage}
                />
              </button>

              {isProfileMenuOpen && (
                <div className={styles.profileDropdown}>
                  <Link to="/profile" className={styles.dropdownItem}>
                    마이페이지
                  </Link>
                  <Link to="/posts/create" className={styles.dropdownItem}>
                    글쓰기
                  </Link>
                  <button onClick={handleLogout} className={styles.dropdownItem}>
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            !isMinimal && (
              <div className={styles.authButtons}>
                <Link to="/login" className={styles.loginBtn}>
                  로그인
                </Link>
                <Link to="/signup" className={styles.signupBtn}>
                  회원가입
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  )
}
