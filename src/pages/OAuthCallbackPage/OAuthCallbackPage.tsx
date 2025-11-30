import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/api/authApi'
import { httpClient } from '@/api'
import { useAuth } from '@/features/auth'

export default function OAuthCallbackPage() {
  const navigate = useNavigate()
  const { loadUser } = useAuth()

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const response = await authApi.refresh()

        if (response.success && response.data) {
          httpClient.setAccessToken(response.data.accessToken)
          await loadUser()
          navigate('/')
        } else {
          throw new Error('Failed to get access token')
        }
      } catch (error) {
        console.error('OAuth callback error:', error)
        navigate('/login')
      }
    }

    handleOAuthCallback()
  }, [navigate, loadUser])

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      <p>로그인 처리 중...</p>
    </div>
  )
}
