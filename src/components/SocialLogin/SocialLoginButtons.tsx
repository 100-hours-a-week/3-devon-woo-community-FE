import { GoogleIcon, GitHubIcon, KakaoIcon, NaverIcon } from './ProviderIcons'
import styles from './SocialLoginButtons.module.css'

export type OAuthProvider = 'google' | 'github' | 'kakao' | 'naver'

interface SocialLoginButtonsProps {
  onProviderClick: (provider: OAuthProvider) => void
  providers?: OAuthProvider[]
}

const providerConfig = {
  google: { Icon: GoogleIcon, label: '구글로 로그인' },
  github: { Icon: GitHubIcon, label: '깃허브로 로그인' },
  kakao: { Icon: KakaoIcon, label: '카카오로 로그인' },
  naver: { Icon: NaverIcon, label: '네이버로 로그인' },
}

export default function SocialLoginButtons({
  onProviderClick,
  providers = ['google', 'github', 'kakao', 'naver'],
}: SocialLoginButtonsProps) {
  return (
    <div className={styles.oauthSection}>
      <div className={styles.oauthButtons}>
        {providers.map(provider => {
          const { Icon, label } = providerConfig[provider]
          return (
            <button
              key={provider}
              type="button"
              className={`${styles.oauthBtn} ${styles[provider]}`}
              onClick={() => onProviderClick(provider)}
              aria-label={label}
              title={label}
            >
              <Icon />
            </button>
          )
        })}
      </div>
    </div>
  )
}
