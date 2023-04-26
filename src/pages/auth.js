import { useEffect } from 'react'
import { useRouter } from 'next/router'

function Auth() {
  const router = useRouter()

  useEffect(() => {
    const uid = sessionStorage.getItem('uid')
    if (!uid) {
      router.push('/pages/login')
    }
  }, [router])
}

export default Auth
