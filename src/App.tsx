import { AuthProvider } from '@/features/auth'
import Router from '@/app/Router'

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  )
}

export default App
