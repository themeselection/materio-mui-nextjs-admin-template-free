'use client'

import { useEffect, useState } from 'react'

import { usePathname, useRouter } from 'next/navigation'
import { fetchMeCached } from '@/utils/auth/meClient'

// Client-side guard that checks access_token in storage and redirects to /login if missing
export default function AuthGuard({ children }) {
    const router = useRouter()
    const pathname = usePathname()
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        let isMounted = true

        const redirectToLogin = () => {
            const next = encodeURIComponent(pathname || '/')

            router.replace(`/login?next=${next}`)
        }

        const clearAuth = () => {
            try {
                if (typeof window !== 'undefined') {
                    window.localStorage.removeItem('access_token')
                    window.localStorage.removeItem('user')
                    window.sessionStorage.removeItem('access_token')
                    window.sessionStorage.removeItem('user')
                }
            } catch {}
        }

        const redirectToError = (params = {}) => {
            const search = new URLSearchParams({
                from: pathname || '/',
                ...Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null))
            }).toString()

            router.replace(`/error?${search}`)
        }

        const checkAuth = async () => {
            try {
                const data = await fetchMeCached({ timeoutMs: 5000 })

                if (!data) return redirectToLogin()

                // Optionally refresh user info in storage for other consumers
                try {
                    if (typeof window !== 'undefined') {
                        const useLocal = !!window.localStorage.getItem('access_token')
                        const storage = useLocal ? window.localStorage : window.sessionStorage

                        storage.setItem('user', JSON.stringify(data))
                    }
                } catch {}

                if (isMounted) setAuthorized(true)
            } catch (e) {
                if (e && e.status === 401) {
                    clearAuth()
                    return redirectToLogin()
                }

                // Network/timeout error: redirect to error page
                const isAbort = (e && typeof e === 'object' && 'name' in e && e.name === 'AbortError')
                redirectToError({ code: isAbort ? 'timeout' : 'network' })
            }
        }

        checkAuth()

        return () => {
            isMounted = false
        }
    }, [router, pathname])

    if (!authorized) return null

    return children
}
