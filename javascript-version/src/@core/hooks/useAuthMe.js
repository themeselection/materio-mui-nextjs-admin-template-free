import { useCallback, useEffect, useState } from 'react'
import { fetchMeCached } from '@/utils/auth/meClient'

// 認証ユーザー情報を取得し、is_admin を返す共通フック
// 戻り値: { user, isAdmin, loading, error, refresh }
export default function useAuthMe() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [tick, setTick] = useState(0)

    const refresh = useCallback(() => setTick(t => t + 1), [])

    useEffect(() => {
        const run = async () => {
            setLoading(true)
            setError(null)

            try {
                const data = await fetchMeCached({ timeoutMs: 5000, force: tick > 0 })
                setUser(data || null)
            } catch (e) {
                if (e && e.status === 401) {
                    setUser(null)
                } else {
                    setError(e)
                }
            } finally {
                setLoading(false)
            }
        }

        run()
        
        return () => {}
    }, [tick])

    const isAdmin = !!user?.is_admin

    return { user, isAdmin, loading, error, refresh }
}
