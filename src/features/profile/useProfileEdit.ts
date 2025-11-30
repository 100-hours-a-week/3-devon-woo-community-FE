import { useState, useEffect, useRef } from 'react'
import { memberApi } from '@/api'
import type { MemberResponse } from '@/types'
import { validateUrl } from '@/utils/validators'
import { parseCommaSeparatedList } from '@/utils/formatters'
import { USE_MOCK } from '@/config/env'
import { DEFAULT_PROFILE_CONFIG } from '@/config/defaults'

interface UseProfileEditOptions {
  memberId?: number
  onSaveSuccess?: () => void
  onSaveError?: (error: Error) => void
}

interface UseProfileEditResult {
  isLoading: boolean
  isSaving: boolean
  hasUnsavedChanges: boolean
  profileImage: string
  profileImageFile: File | null
  nickname: string
  handle: string
  bio: string
  role: string
  company: string
  location: string
  primaryStackText: string
  interestsText: string
  githubUrl: string
  websiteUrl: string
  linkedinUrl: string
  notionUrl: string
  errors: Record<string, string>
  previewProfile: MemberResponse
  error: Error | null
  setProfileImageFile: (file: File | null) => void
  setNickname: (nickname: string) => void
  setHandle: (handle: string) => void
  setBio: (bio: string) => void
  setRole: (role: string) => void
  setCompany: (company: string) => void
  setLocation: (location: string) => void
  setPrimaryStackText: (text: string) => void
  setInterestsText: (text: string) => void
  setGithubUrl: (url: string) => void
  setWebsiteUrl: (url: string) => void
  setLinkedinUrl: (url: string) => void
  setNotionUrl: (url: string) => void
  handleSave: () => Promise<void>
}

export function useProfileEdit({
  memberId,
  onSaveSuccess,
  onSaveError,
}: UseProfileEditOptions = {}): UseProfileEditResult {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const [profileImage, setProfileImage] = useState<string>(DEFAULT_PROFILE_CONFIG.image)
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
    const loadProfile = async () => {
      try {
        if (memberId) {
          const response = await memberApi.getProfile(memberId)
          if (response.success && response.data) {
            const profile = response.data
            setProfileImage(profile.profileImage || DEFAULT_PROFILE_CONFIG.image)
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
          setProfileImage(DEFAULT_PROFILE_CONFIG.image)
          setNickname(DEFAULT_PROFILE_CONFIG.profile.nickname)
          setHandle(DEFAULT_PROFILE_CONFIG.profile.handle)
          setBio(DEFAULT_PROFILE_CONFIG.profile.bio)
          setRole(DEFAULT_PROFILE_CONFIG.profile.role)
          setCompany(DEFAULT_PROFILE_CONFIG.profile.company)
          setLocation(DEFAULT_PROFILE_CONFIG.profile.location)
          setPrimaryStackText(DEFAULT_PROFILE_CONFIG.primaryStack.join(', '))
          setInterestsText(DEFAULT_PROFILE_CONFIG.interests.join(', '))
          setGithubUrl(DEFAULT_PROFILE_CONFIG.socialLinks.github)
          setWebsiteUrl(DEFAULT_PROFILE_CONFIG.socialLinks.website)
          setLinkedinUrl(DEFAULT_PROFILE_CONFIG.socialLinks.linkedin)
          setNotionUrl(DEFAULT_PROFILE_CONFIG.socialLinks.notion)

          originalDataRef.current = JSON.stringify({
            nickname: DEFAULT_PROFILE_CONFIG.profile.nickname,
            handle: DEFAULT_PROFILE_CONFIG.profile.handle,
            bio: DEFAULT_PROFILE_CONFIG.profile.bio,
            role: DEFAULT_PROFILE_CONFIG.profile.role,
            company: DEFAULT_PROFILE_CONFIG.profile.company,
            location: DEFAULT_PROFILE_CONFIG.profile.location,
            primaryStackText: DEFAULT_PROFILE_CONFIG.primaryStack.join(', '),
            interestsText: DEFAULT_PROFILE_CONFIG.interests.join(', '),
            githubUrl: DEFAULT_PROFILE_CONFIG.socialLinks.github,
            websiteUrl: DEFAULT_PROFILE_CONFIG.socialLinks.website,
            linkedinUrl: DEFAULT_PROFILE_CONFIG.socialLinks.linkedin,
            notionUrl: DEFAULT_PROFILE_CONFIG.socialLinks.notion,
            hasImageFile: false,
          })
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
        setError(err instanceof Error ? err : new Error('Failed to load profile'))
      } finally {
        setIsLoading(false)
      }
    }

    void loadProfile()
  }, [memberId])

  useEffect(() => {
    const currentData = JSON.stringify({
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

  useEffect(() => {
    if (profileImageFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(profileImageFile)
    }
  }, [profileImageFile])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!nickname.trim()) {
      newErrors.nickname = '$D %t8.'
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
      setError(new Error('%D Uxt8.'))
      return
    }

    setIsSaving(true)
    setError(null)

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

      if (!USE_MOCK) {
        const response = await memberApi.updateProfile(updateData)
        if (!response.success) {
          throw new Error('Failed to update profile')
        }
      }

      originalDataRef.current = JSON.stringify({
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
      setHasUnsavedChanges(false)
      onSaveSuccess?.()
    } catch (err) {
      console.error('Failed to save profile:', err)
      const errorObj = err instanceof Error ? err : new Error('\D   (.')
      setError(errorObj)
      onSaveError?.(errorObj)
    } finally {
      setIsSaving(false)
    }
  }

  const primaryStack = parseCommaSeparatedList(primaryStackText)
  const interests = parseCommaSeparatedList(interestsText)

  const previewProfile: MemberResponse = {
    memberId: memberId || 1,
    email: '',
    nickname: nickname || '',
    profileImage,
    handle: handle || '',
    bio: bio || '',
    role: role || '',
    company: company || '',
    location: location || '',
    primaryStack,
    interests,
    socialLinks: {
      github: githubUrl || '',
      website: websiteUrl || '',
      linkedin: linkedinUrl || '',
      notion: notionUrl || '',
    },
  }

  return {
    isLoading,
    isSaving,
    hasUnsavedChanges,
    profileImage,
    profileImageFile,
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
    errors,
    previewProfile,
    error,
    setProfileImageFile,
    setNickname,
    setHandle,
    setBio,
    setRole,
    setCompany,
    setLocation,
    setPrimaryStackText,
    setInterestsText,
    setGithubUrl,
    setWebsiteUrl,
    setLinkedinUrl,
    setNotionUrl,
    handleSave,
  }
}
