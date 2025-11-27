import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import ProfileImageUploader from '@/components/ProfileImageUploader'
import { memberApi } from '@/api'
import { useAuth } from '@/features/auth'
import type { MemberResponse } from '@/types'
import { USE_MOCK } from '@/config/env'
import { validateUrl } from '@/utils/validators'
import { parseCommaSeparatedList } from '@/utils/formatters'
import styles from './ProfileEditPage.module.css'

const DEFAULT_PROFILE_IMAGE = 'https://via.placeholder.com/160?text=Profile'
const DEFAULT_PRIMARY_STACK = ['Java', 'Spring Boot', 'JPA', 'MySQL', 'AWS']
const DEFAULT_INTERESTS = ['서버 아키텍처', '대규모 트래픽 처리', 'Event-driven Design', 'DevOps 자동화']

export default function ProfileEditPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', isError: false })

  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [nickname, setNickname] = useState('')
  const [handle, setHandle] = useState('')
  const [bio, setBio] = useState('')
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')
  const [primaryStackText, setPrimaryStackText] = useState('')
  const [interestsText, setInterestsText] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [notionUrl, setNotionUrl] = useState('')

  const [errors, setErrors] = useState<Record<string, string>>({})
  const originalDataRef = useRef<string>('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    loadProfile()
  }, [user, navigate])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  useEffect(() => {
    const currentData = getCurrentFormData()
    setHasUnsavedChanges(currentData !== originalDataRef.current)
  }, [
    nickname,
    handle,
    bio,
    role,
    company,
    location,
    primaryStackText,
    interestsText,
    githubUrl,
    websiteUrl,
    linkedinUrl,
    notionUrl,
    profileImageFile,
  ])

  const getCurrentFormData = () => {
    return JSON.stringify({
      nickname,
      handle,
      bio,
      role,
      company,
      location,
      primaryStackText,
      interestsText,
      githubUrl,
      websiteUrl,
      linkedinUrl,
      notionUrl,
      hasImageFile: !!profileImageFile,
    })
  }

  const loadProfile = async () => {
    try {
      if (!USE_MOCK && user?.memberId) {
        const response = await memberApi.getProfile(user.memberId)
        if (response.success && response.data) {
          const profile = response.data
          setProfileImage(profile.profileImage || DEFAULT_PROFILE_IMAGE)
          setNickname(profile.nickname || '')
          setHandle(profile.handle || '')
          setBio(profile.bio || '')
          setRole(profile.role || '')
          setCompany(profile.company || '')
          setLocation(profile.location || '')
          setPrimaryStackText((profile.primaryStack || []).join(', '))
          setInterestsText((profile.interests || []).join(', '))
          setGithubUrl(profile.socialLinks?.github || '')
          setWebsiteUrl(profile.socialLinks?.website || '')
          setLinkedinUrl(profile.socialLinks?.linkedin || '')
          setNotionUrl(profile.socialLinks?.notion || '')

          originalDataRef.current = JSON.stringify({
            nickname: profile.nickname || '',
            handle: profile.handle || '',
            bio: profile.bio || '',
            role: profile.role || '',
            company: profile.company || '',
            location: profile.location || '',
            primaryStackText: (profile.primaryStack || []).join(', '),
            interestsText: (profile.interests || []).join(', '),
            githubUrl: profile.socialLinks?.github || '',
            websiteUrl: profile.socialLinks?.website || '',
            linkedinUrl: profile.socialLinks?.linkedin || '',
            notionUrl: profile.socialLinks?.notion || '',
            hasImageFile: false,
          })
        }
      } else {
        setNickname('홍길동')
        setHandle('Backend Developer / Java Enthusiast')
        setBio('MSA 기반 백엔드 아키텍처와 대규모 트래픽 대응 경험이 있는 Java/Spring 개발자입니다.')
        setRole('Backend Engineer')
        setCompany('Codestate Labs')
        setLocation('Seoul, Korea')
        setPrimaryStackText(DEFAULT_PRIMARY_STACK.join(', '))
        setInterestsText(DEFAULT_INTERESTS.join(', '))
        setGithubUrl('https://github.com/codestate-dev')
        setWebsiteUrl('https://blog.codestate.dev')
        setLinkedinUrl('https://www.linkedin.com/in/codestate')
        setNotionUrl('https://codestate.notion.site/portfolio')

        originalDataRef.current = getCurrentFormData()
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
      showToast('프로필을 불러오는데 실패했습니다.', true)
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!nickname.trim()) {
      newErrors.nickname = '닉네임을 입력해주세요.'
    }

    const githubValidation = validateUrl(githubUrl)
    if (!githubValidation.isValid) {
      newErrors.github = githubValidation.error
    }
    const websiteValidation = validateUrl(websiteUrl)
    if (!websiteValidation.isValid) {
      newErrors.website = websiteValidation.error
    }
    const linkedinValidation = validateUrl(linkedinUrl)
    if (!linkedinValidation.isValid) {
      newErrors.linkedin = linkedinValidation.error
    }
    const notionValidation = validateUrl(notionUrl)
    if (!notionValidation.isValid) {
      newErrors.notion = notionValidation.error
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }


  const handleSave = async () => {
    if (!validateForm()) {
      showToast('입력값을 확인해주세요.', true)
      return
    }

    setIsSaving(true)
    try {
      const primaryStack = parseCommaSeparatedList(primaryStackText)

      const interests = parseCommaSeparatedList(interestsText)

      const updateData = {
        nickname: nickname.trim(),
        handle: handle.trim() || undefined,
        bio: bio.trim() || undefined,
        role: role.trim() || undefined,
        company: company.trim() || undefined,
        location: location.trim() || undefined,
        primaryStack,
        interests,
        socialLinks: {
          github: githubUrl.trim() || undefined,
          website: websiteUrl.trim() || undefined,
          linkedin: linkedinUrl.trim() || undefined,
          notion: notionUrl.trim() || undefined,
        },
      }

      if (!USE_MOCK && user?.memberId) {
        const response = await memberApi.updateProfile(user.memberId, updateData)
        if (!response.success) {
          throw new Error('Failed to update profile')
        }
      }

      originalDataRef.current = getCurrentFormData()
      setHasUnsavedChanges(false)
      showToast('프로필이 저장되었습니다.')

      setTimeout(() => {
        navigate(`/profile/${user?.memberId || ''}`)
      }, 1000)
    } catch (error) {
      console.error('Failed to save profile:', error)
      showToast('프로필 저장에 실패했습니다.', true)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (confirm('변경사항이 저장되지 않았습니다. 정말 취소하시겠습니까?')) {
        navigate(`/profile/${user?.memberId || ''}`)
      }
    } else {
      navigate(`/profile/${user?.memberId || ''}`)
    }
  }

  const handleImageSelected = (file: File) => {
    setProfileImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setProfileImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const showToast = (message: string, isError = false) => {
    setToast({ show: true, message, isError })
    setTimeout(() => {
      setToast({ show: false, message: '', isError: false })
    }, 3000)
  }

  if (isLoading) {
    return (
      <div className={styles.profileEditPage}>
        <Header />
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner} />
        </div>
      </div>
    )
  }

  const primaryStack = parseCommaSeparatedList(primaryStackText)
  const interests = parseCommaSeparatedList(interestsText)

  const previewProfile: MemberResponse = {
    memberId: user?.memberId || 1,
    id: user?.memberId || 1,
    email: user?.email || '',
    nickname: nickname || '사용자',
    profileImage,
    handle: handle || undefined,
    bio: bio || undefined,
    role: role || undefined,
    company: company || undefined,
    location: location || undefined,
    primaryStack,
    interests,
    socialLinks: {
      github: githubUrl || undefined,
      website: websiteUrl || undefined,
      linkedin: linkedinUrl || undefined,
      notion: notionUrl || undefined,
    },
  }

  return (
    <div className={styles.profileEditPage}>
      <Header />

      <div className={styles.mainContainer}>
        <section className={styles.profilePreview}>
          <div className={styles.profileCover} />

          <div className={styles.profileCardBody}>
            <div className={styles.profileCardMain}>
              <div className={styles.profileAvatar}>
                <img src={previewProfile.profileImage} alt={previewProfile.nickname} />
              </div>

              <div className={styles.profileSummary}>
                <div className={styles.profileSummaryRow}>
                  <div>
                    <h1 className={styles.profileName}>{previewProfile.nickname}</h1>
                    {previewProfile.handle && (
                      <p className={styles.profileHandle}>{previewProfile.handle}</p>
                    )}
                  </div>
                </div>

                <ul className={styles.profileDetails}>
                  {previewProfile.role && <li>{previewProfile.role}</li>}
                  {previewProfile.company && <li>{previewProfile.company}</li>}
                  {previewProfile.location && <li>{previewProfile.location}</li>}
                </ul>

                {previewProfile.socialLinks?.website && (
                  <a
                    href={previewProfile.socialLinks.website}
                    className={styles.profileWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {previewProfile.socialLinks.website}
                  </a>
                )}
              </div>
            </div>

            {previewProfile.bio && <p className={styles.profileBio}>{previewProfile.bio}</p>}
          </div>

          {previewProfile.primaryStack && previewProfile.primaryStack.length > 0 && (
            <div className={styles.profileSection}>
              <h3>주요 기술 스택</h3>
              <div className={styles.skillsList}>
                {previewProfile.primaryStack.map((skill) => (
                  <span key={skill} className={styles.skillChip}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {previewProfile.interests && previewProfile.interests.length > 0 && (
            <div className={styles.profileSection}>
              <h3>관심 분야</h3>
              <ul className={styles.interestList}>
                {previewProfile.interests.map((interest) => (
                  <li key={interest}>{interest}</li>
                ))}
              </ul>
            </div>
          )}

          {(previewProfile.socialLinks?.github ||
            previewProfile.socialLinks?.website ||
            previewProfile.socialLinks?.linkedin ||
            previewProfile.socialLinks?.notion) && (
            <div className={styles.profileSection}>
              <h3>링크</h3>
              <div className={styles.socialLinks}>
                {previewProfile.socialLinks.github && (
                  <a
                    href={previewProfile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                )}
                {previewProfile.socialLinks.website && (
                  <a
                    href={previewProfile.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Website
                  </a>
                )}
                {previewProfile.socialLinks.linkedin && (
                  <a
                    href={previewProfile.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                )}
                {previewProfile.socialLinks.notion && (
                  <a
                    href={previewProfile.socialLinks.notion}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Notion
                  </a>
                )}
              </div>
            </div>
          )}
        </section>

        <section className={styles.editSection}>
          <div className={styles.editHeader}>
            <h2 className={styles.editTitle}>프로필 수정</h2>
            <p className={styles.editSubtitle}>공개 프로필 정보를 수정합니다.</p>
          </div>

          <form className={styles.editForm} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>프로필 사진</h3>
              <ProfileImageUploader imageUrl={profileImage} onFileSelected={handleImageSelected} />
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>기본 정보</h3>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  닉네임
                  <span className={styles.labelRequired}>*</span>
                </label>
                <input
                  type="text"
                  className={`${styles.formInput} ${errors.nickname ? styles.error : ''}`}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임을 입력하세요"
                />
                {errors.nickname && <p className={styles.formError}>{errors.nickname}</p>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  한 줄 소개
                  <span className={styles.labelOptional}>(선택)</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="예: Frontend Developer / React Specialist"
                  maxLength={60}
                />
                <p className={styles.charCount}>{handle.length}/60</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  소개
                  <span className={styles.labelOptional}>(선택)</span>
                </label>
                <textarea
                  className={styles.formTextarea}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="자신을 소개해보세요"
                  maxLength={300}
                />
                <p className={styles.charCount}>{bio.length}/300</p>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>직무 정보</h3>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  직무
                  <span className={styles.labelOptional}>(선택)</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="예: Backend Engineer"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  회사
                  <span className={styles.labelOptional}>(선택)</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="예: Codestate Labs"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  위치
                  <span className={styles.labelOptional}>(선택)</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="예: Seoul, Korea"
                />
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>기술 스택 및 관심사</h3>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  주요 기술 스택
                  <span className={styles.labelOptional}>(선택)</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={primaryStackText}
                  onChange={(e) => setPrimaryStackText(e.target.value)}
                  placeholder="예: Java, Spring Boot, JPA, MySQL, AWS"
                />
                <p className={styles.formHint}>쉼표(,)로 구분하여 입력하세요</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  관심 분야
                  <span className={styles.labelOptional}>(선택)</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={interestsText}
                  onChange={(e) => setInterestsText(e.target.value)}
                  placeholder="예: 서버 아키텍처, 대규모 트래픽 처리"
                />
                <p className={styles.formHint}>쉼표(,)로 구분하여 입력하세요</p>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>소셜 링크</h3>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  GitHub
                  <span className={styles.labelOptional}>(선택)</span>
                </label>
                <input
                  type="url"
                  className={`${styles.formInput} ${errors.github ? styles.error : ''}`}
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                />
                {errors.github && <p className={styles.formError}>{errors.github}</p>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Website
                  <span className={styles.labelOptional}>(선택)</span>
                </label>
                <input
                  type="url"
                  className={`${styles.formInput} ${errors.website ? styles.error : ''}`}
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://your-website.com"
                />
                {errors.website && <p className={styles.formError}>{errors.website}</p>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  LinkedIn
                  <span className={styles.labelOptional}>(선택)</span>
                </label>
                <input
                  type="url"
                  className={`${styles.formInput} ${errors.linkedin ? styles.error : ''}`}
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://www.linkedin.com/in/username"
                />
                {errors.linkedin && <p className={styles.formError}>{errors.linkedin}</p>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Notion
                  <span className={styles.labelOptional}>(선택)</span>
                </label>
                <input
                  type="url"
                  className={`${styles.formInput} ${errors.notion ? styles.error : ''}`}
                  value={notionUrl}
                  onChange={(e) => setNotionUrl(e.target.value)}
                  placeholder="https://username.notion.site/page"
                />
                {errors.notion && <p className={styles.formError}>{errors.notion}</p>}
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.btnSecondary} onClick={handleCancel}>
                취소
              </button>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? '저장 중...' : '저장'}
              </button>
            </div>
          </form>
        </section>
      </div>

      <div className={`${styles.toast} ${toast.show ? styles.show : ''} ${toast.isError ? styles.error : ''}`}>
        {toast.message}
      </div>

      <div className={`${styles.loadingOverlay} ${isSaving ? styles.show : ''}`}>
        <div className={styles.loadingSpinner} />
        <p>저장 중...</p>
      </div>
    </div>
  )
}
