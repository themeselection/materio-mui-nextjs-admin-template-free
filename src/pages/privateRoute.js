import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Auth from 'src/pages/auth'

function PrivateRoute({ children }) {
  const router = useRouter()

  useEffect(() => {
    const uid = sessionStorage.getItem('uid')
    if (!uid) {
      router.push('/pages/login')
    }
  }, [router])

  return (
    <Auth>
      {children}
    </Auth>
  )
}

export default PrivateRoute