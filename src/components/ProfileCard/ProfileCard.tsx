import { Link } from 'react-router-dom'
import type { MemberResponse } from '@/types'
import styles from './ProfileCard.module.css'

interface ProfileCardProps {
  profile: MemberResponse
  isOwner?: boolean
}

export default function ProfileCard({ profile, isOwner = false }: ProfileCardProps) {
  const primaryStack = profile.primaryStack || []
  const interests = profile.interests || []
  const socialLinks = profile.socialLinks || {}

  return (
    <section className={styles.profileCard}>
      <div className={styles.profileCover} />

      <div className={styles.profileCardBody}>
        <div className={styles.profileCardMain}>
          <div className={styles.profileAvatar}>
            <img
              src={profile.profileImage || 'https://via.placeholder.com/160?text=Profile'}
              alt={profile.nickname || '프로필'}
            />
          </div>

          <div className={styles.profileSummary}>
            <div className={styles.profileSummaryRow}>
              <div>
                <h1 className={styles.profileName}>{profile.nickname || '사용자'}</h1>
                {profile.handle && <p className={styles.profileHandle}>{profile.handle}</p>}
              </div>
              {isOwner && (
                <Link to="/profile/edit" className={styles.profileEditIcon} aria-label="프로필 수정">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M12.5 2.75L15.25 5.5m-6.57 7.32l-4.18 1.16 1.16-4.18 6.82-6.82a1.5 1.5 0 0 1 2.12 0l1.72 1.72a1.5 1.5 0 0 1 0 2.12l-7.64 7.64z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              )}
            </div>

            <ul className={styles.profileDetails}>
              {profile.role && <li>{profile.role}</li>}
              {profile.company && <li>{profile.company}</li>}
              {profile.location && <li>{profile.location}</li>}
            </ul>

            {socialLinks.website && (
              <a
                href={socialLinks.website}
                className={styles.profileWebsite}
                target="_blank"
                rel="noopener noreferrer"
              >
                {socialLinks.website}
              </a>
            )}
          </div>
        </div>

        {profile.bio && <p className={styles.profileBio}>{profile.bio}</p>}
      </div>

      {primaryStack.length > 0 && (
        <div className={styles.profileSection}>
          <h3>주요 기술 스택</h3>
          <div className={styles.skillsList}>
            {primaryStack.map((skill) => (
              <span key={skill} className={styles.skillChip}>{skill}</span>
            ))}
          </div>
        </div>
      )}

      {interests.length > 0 && (
        <div className={styles.profileSection}>
          <h3>관심 분야</h3>
          <ul className={styles.interestList}>
            {interests.map((interest) => (
              <li key={interest}>{interest}</li>
            ))}
          </ul>
        </div>
      )}

      {(socialLinks.github || socialLinks.website || socialLinks.linkedin || socialLinks.notion) && (
        <div className={styles.profileSection}>
          <h3>링크</h3>
          <div className={styles.socialLinks}>
            {socialLinks.github && (
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            )}
            {socialLinks.website && (
              <a href={socialLinks.website} target="_blank" rel="noopener noreferrer">
                Website
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            )}
            {socialLinks.notion && (
              <a href={socialLinks.notion} target="_blank" rel="noopener noreferrer">
                Notion
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
