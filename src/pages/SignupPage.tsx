import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import Header from '@/components/Header'
import ProfileImageUploader from '@/components/ProfileImageUploader'
import styles from './SignupPage.module.css'

const DEFAULT_PRIMARY_STACK = ['Java', 'Spring Boot', 'JPA', 'MySQL', 'AWS']
const DEFAULT_INTERESTS = ['서버 아키텍처', '대규모 트래픽 처리', 'Event-driven Design', 'DevOps 자동화']

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [nickname, setNickname] = useState('')

  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordConfirmError, setPasswordConfirmError] = useState('')
  const [nicknameError, setNicknameError] = useState('')

  const [handle, setHandle] = useState('')
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')
  const [bio, setBio] = useState('')
  const [primaryStackText, setPrimaryStackText] = useState('')
  const [interestsText, setInterestsText] = useState('')
  const [socialLinks, setSocialLinks] = useState({
    github: '',
    website: '',
    linkedin: '',
    notion: ''
  })

  const { signup } = useAuth()
  const navigate = useNavigate()

  const validateEmail = (email: string) => {
    if (!email.trim()) return '이메일을 입력해주세요.'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return '올바른 이메일 형식이 아닙니다.'
    return ''
  }

  const validatePassword = (password: string) => {
    if (!password) return '비밀번호를 입력해주세요.'
    if (password.length < 8 || password.length > 20) {
      return '비밀번호는 8자 이상, 20자 이하이어야 합니다.'
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return '비밀번호는 영문과 숫자를 포함해야 합니다.'
    }
    return ''
  }

  const validatePasswordConfirm = (password: string, passwordConfirm: string) => {
    if (!passwordConfirm) return '비밀번호를 한번 더 입력해주세요.'
    if (password !== passwordConfirm) return '비밀번호가 일치하지 않습니다.'
    return ''
  }

  const validateNickname = (nickname: string) => {
    if (!nickname.trim()) return '닉네임을 입력해주세요.'
    if (nickname.length > 30) return '닉네임은 30자 이하이어야 합니다.'
    return ''
  }

  const isAccountFormValid = () => {
    return (
      email.trim() &&
      password.trim() &&
      passwordConfirm.trim() &&
      nickname.trim() &&
      !emailError &&
      !passwordError &&
      !passwordConfirmError &&
      !nicknameError
    )
  }

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const emailErr = validateEmail(email)
    const passwordErr = validatePassword(password)
    const passwordConfirmErr = validatePasswordConfirm(password, passwordConfirm)
    const nicknameErr = validateNickname(nickname)

    setEmailError(emailErr)
    setPasswordError(passwordErr)
    setPasswordConfirmError(passwordConfirmErr)
    setNicknameError(nicknameErr)

    if (!emailErr && !passwordErr && !passwordConfirmErr && !nicknameErr) {
      setStep(2)
    }
  }

  const parseList = (text: string, fallback: string[] = []) => {
    const parsed = text
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
    return parsed.length ? parsed : fallback
  }

  const completeSignup = async (skipProfile: boolean) => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const profilePayload = skipProfile ? {} : {
        handle: handle.trim(),
        bio: bio.trim(),
        role: role.trim(),
        company: company.trim(),
        location: location.trim(),
        primaryStack: parseList(primaryStackText, DEFAULT_PRIMARY_STACK),
        interests: parseList(interestsText, DEFAULT_INTERESTS),
        socialLinks: {
          github: socialLinks.github.trim(),
          website: socialLinks.website.trim(),
          linkedin: socialLinks.linkedin.trim(),
          notion: socialLinks.notion.trim()
        }
      }

      await signup({
        email: email.trim(),
        password: password.trim(),
        passwordConfirm: passwordConfirm.trim(),
        nickname: nickname.trim(),
        ...profilePayload
      })

      alert('회원가입이 완료되었습니다!')
      navigate('/')
    } catch (error) {
      alert('회원가입에 실패했습니다. 입력 정보를 확인해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    completeSignup(false)
  }

  return (
    <div className={styles.signupPage}>
      <Header variant="minimal" />

      <main className={styles.mainContainer}>
        <div className={styles.signupPanel}>
          <div className={styles.signupSteps}>
            <div className={`${styles.signupStep} ${step === 1 ? styles.active : step > 1 ? styles.completed : ''}`}>
              <div className={styles.stepIndicator}>1</div>
              <div className={styles.stepInfo}>
                <p className={styles.stepLabel}>계정 정보</p>
                <p className={styles.stepDesc}>로그인에 필요한 기본 정보</p>
              </div>
            </div>
            <div className={`${styles.signupStep} ${step === 2 ? styles.active : step > 2 ? styles.completed : ''}`}>
              <div className={styles.stepIndicator}>2</div>
              <div className={styles.stepInfo}>
                <p className={styles.stepLabel}>프로필 설정</p>
                <p className={styles.stepDesc}>개발자 프로필 정보</p>
              </div>
            </div>
          </div>

          <div className={styles.stepCard}>
            {step === 1 ? (
              <form className={styles.stepForm} onSubmit={handleAccountSubmit}>
                <h2 className={styles.stepTitle}>계정 정보</h2>
                <p className={styles.stepSubtitle}>Tech Blog 사용을 위한 필수 정보를 입력해주세요.</p>

                <div className={`${styles.formGrid} ${styles.twoColumns}`}>
                  <div className={styles.formGroup}>
                    <label htmlFor="emailInput" className={styles.formLabel}>이메일*</label>
                    <input
                      type="email"
                      id="emailInput"
                      className={`${styles.formInput} ${emailError ? styles.error : ''}`}
                      placeholder="이메일을 입력해주세요"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value)
                        setEmailError('')
                      }}
                      onBlur={() => setEmailError(validateEmail(email))}
                    />
                    <p className={`${styles.helperText} ${emailError ? styles.show : ''}`}>
                      {emailError || '*올바른 이메일 주소를 입력해주세요.'}
                    </p>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="nicknameInput" className={styles.formLabel}>닉네임*</label>
                    <input
                      type="text"
                      id="nicknameInput"
                      className={`${styles.formInput} ${nicknameError ? styles.error : ''}`}
                      placeholder="닉네임을 입력해주세요"
                      maxLength={30}
                      value={nickname}
                      onChange={e => {
                        setNickname(e.target.value)
                        setNicknameError('')
                      }}
                      onBlur={() => setNicknameError(validateNickname(nickname))}
                    />
                    <p className={`${styles.helperText} ${nicknameError ? styles.show : ''}`}>
                      {nicknameError || '*닉네임을 입력해주세요.'}
                    </p>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="passwordInput" className={styles.formLabel}>비밀번호*</label>
                    <input
                      type="password"
                      id="passwordInput"
                      className={`${styles.formInput} ${passwordError ? styles.error : ''}`}
                      placeholder="비밀번호를 입력해주세요"
                      value={password}
                      onChange={e => {
                        setPassword(e.target.value)
                        setPasswordError('')
                      }}
                      onBlur={() => setPasswordError(validatePassword(password))}
                    />
                    <p className={`${styles.helperText} ${passwordError ? styles.show : ''}`}>
                      {passwordError || '*비밀번호는 8자 이상, 20자 이하이며, 영문과 숫자를 포함해야 합니다.'}
                    </p>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="passwordConfirmInput" className={styles.formLabel}>비밀번호 확인*</label>
                    <input
                      type="password"
                      id="passwordConfirmInput"
                      className={`${styles.formInput} ${passwordConfirmError ? styles.error : ''}`}
                      placeholder="비밀번호를 한번 더 입력해주세요"
                      value={passwordConfirm}
                      onChange={e => {
                        setPasswordConfirm(e.target.value)
                        setPasswordConfirmError('')
                      }}
                      onBlur={() => setPasswordConfirmError(validatePasswordConfirm(password, passwordConfirm))}
                    />
                    <p className={`${styles.helperText} ${passwordConfirmError ? styles.show : ''}`}>
                      {passwordConfirmError || '*비밀번호를 한번 더 입력해주세요.'}
                    </p>
                  </div>
                </div>

                <div className={styles.stepActions}>
                  <button type="submit" className={styles.btnPrimary} disabled={!isAccountFormValid()}>
                    다음 단계로
                  </button>
                </div>
              </form>
            ) : (
              <form className={styles.stepForm} onSubmit={handleProfileSubmit}>
                <div className={styles.profileStepHeader}>
                  <div>
                    <h2 className={styles.stepTitle}>프로필 설정</h2>
                    <p className={styles.stepSubtitle}>
                      프로필 정보는 나중에 프로필 페이지에서 다시 수정할 수 있습니다.
                    </p>
                  </div>
                  <div className={styles.stepActions}>
                    <button type="button" className={styles.btnTertiary} onClick={() => setStep(1)}>이전</button>
                    <button type="button" className={styles.btnSecondary} onClick={() => completeSignup(true)} disabled={isSubmitting}>나중에 할래요</button>
                  </div>
                </div>

                <ProfileImageUploader imageUrl="" onFileSelected={setSelectedImageFile} />

                <div className={`${styles.formGrid} ${styles.twoColumns}`}>
                  <div className={styles.formGroup}>
                    <label htmlFor="handleInput" className={styles.formLabel}>한 줄 소개</label>
                    <input
                      type="text"
                      id="handleInput"
                      className={styles.formInput}
                      maxLength={80}
                      placeholder="예: Backend Developer / Java Enthusiast"
                      value={handle}
                      onChange={e => setHandle(e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="roleInput" className={styles.formLabel}>직무/포지션</label>
                    <input
                      type="text"
                      id="roleInput"
                      className={styles.formInput}
                      placeholder="예: Backend Engineer"
                      value={role}
                      onChange={e => setRole(e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="companyInput" className={styles.formLabel}>회사/소속</label>
                    <input
                      type="text"
                      id="companyInput"
                      className={styles.formInput}
                      placeholder="예: Codestate Labs"
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="locationInput" className={styles.formLabel}>위치</label>
                    <input
                      type="text"
                      id="locationInput"
                      className={styles.formInput}
                      placeholder="예: Seoul, Korea"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="bioInput" className={styles.formLabel}>간단 소개</label>
                  <textarea
                    id="bioInput"
                    className={styles.formTextarea}
                    rows={4}
                    maxLength={300}
                    placeholder="MSA 기반 백엔드 아키텍처 구축과 대규모 트래픽 대응 경험이 있는 Java/Spring 개발자입니다."
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                  />
                  <div className={styles.charCount}>
                    <span>{bio.length}</span> / 300
                  </div>
                </div>

                <div className={`${styles.formGrid} ${styles.twoColumns}`}>
                  <div className={styles.formGroup}>
                    <label htmlFor="primaryStackInput" className={styles.formLabel}>주요 기술 스택</label>
                    <input
                      type="text"
                      id="primaryStackInput"
                      className={styles.formInput}
                      placeholder="Java, Spring Boot, JPA, MySQL, AWS"
                      value={primaryStackText}
                      onChange={e => setPrimaryStackText(e.target.value)}
                    />
                    <p className={`${styles.helperText} ${styles.small}`}>쉼표로 구분해 입력해주세요.</p>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="interestsInput" className={styles.formLabel}>관심 분야</label>
                    <input
                      type="text"
                      id="interestsInput"
                      className={styles.formInput}
                      placeholder="서버 아키텍처, CQRS, Observability"
                      value={interestsText}
                      onChange={e => setInterestsText(e.target.value)}
                    />
                    <p className={`${styles.helperText} ${styles.small}`}>쉼표로 구분해 입력해주세요.</p>
                  </div>
                </div>

                <div className={`${styles.formGrid} ${styles.twoColumns}`}>
                  <div className={styles.formGroup}>
                    <label htmlFor="githubInput" className={styles.formLabel}>GitHub</label>
                    <input
                      type="url"
                      id="githubInput"
                      className={styles.formInput}
                      placeholder="https://github.com/username"
                      value={socialLinks.github}
                      onChange={e => setSocialLinks({ ...socialLinks, github: e.target.value })}
                    />
                    <p className={`${styles.helperText} ${styles.small}`}>GitHub 링크를 입력해주세요.</p>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="websiteInput" className={styles.formLabel}>Website</label>
                    <input
                      type="url"
                      id="websiteInput"
                      className={styles.formInput}
                      placeholder="https://your-website.com"
                      value={socialLinks.website}
                      onChange={e => setSocialLinks({ ...socialLinks, website: e.target.value })}
                    />
                    <p className={`${styles.helperText} ${styles.small}`}>Website 링크를 입력해주세요.</p>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="linkedinInput" className={styles.formLabel}>LinkedIn</label>
                    <input
                      type="url"
                      id="linkedinInput"
                      className={styles.formInput}
                      placeholder="https://linkedin.com/in/username"
                      value={socialLinks.linkedin}
                      onChange={e => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                    />
                    <p className={`${styles.helperText} ${styles.small}`}>LinkedIn 링크를 입력해주세요.</p>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="notionInput" className={styles.formLabel}>Notion / Portfolio</label>
                    <input
                      type="url"
                      id="notionInput"
                      className={styles.formInput}
                      placeholder="https://notion.so/portfolio"
                      value={socialLinks.notion}
                      onChange={e => setSocialLinks({ ...socialLinks, notion: e.target.value })}
                    />
                    <p className={`${styles.helperText} ${styles.small}`}>Notion / Portfolio 링크를 입력해주세요.</p>
                  </div>
                </div>

                <div className={styles.stepActions}>
                  <button type="button" className={styles.btnTertiary} onClick={() => setStep(1)}>이전</button>
                  <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
                    {isSubmitting ? '가입 중...' : '완료'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
