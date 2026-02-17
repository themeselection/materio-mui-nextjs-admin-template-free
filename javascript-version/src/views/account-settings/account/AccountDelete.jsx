"use client"

// React / Next
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

// Hooks
import useAuthMe from '@core/hooks/useAuthMe'

// 認可ヘッダ（AccountDetails と同等の簡易版）
const getAuthHeaders = () => {
  try {
    const token =
      (typeof window !== 'undefined' && (window.localStorage.getItem('access_token') || window.sessionStorage.getItem('access_token'))) ||
      ''
    return token ? { Authorization: `Bearer ${token}` } : {}
  } catch {
    return {}
  }
}

const AccountDelete = () => {
  const apiBase = process.env.NEXT_PUBLIC_BASE_PATH || ''
  const router = useRouter()
  const { user } = useAuthMe()

  const [consent, setConsent] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' })

  const clearAuthAndRedirect = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('access_token')
        window.localStorage.removeItem('user')
        window.sessionStorage.removeItem('access_token')
        window.sessionStorage.removeItem('user')
      }
    } catch {}
    router.replace('/login')
  }

  const handleDelete = async () => {
    if (!user?.employee_id) {
      setSnack({ open: true, message: 'ユーザー情報が取得できませんでした。', severity: 'error' })
      return
    }
    setDeleting(true)
    try {
      const headers = { ...getAuthHeaders() }
      const res = await fetch(`${apiBase}/api/employees/${user.employee_id}`, { method: 'DELETE', headers })

      if (res.ok) {
        setSnack({ open: true, message: 'アカウントを削除しました。ログアウトします…', severity: 'success' })
        setTimeout(() => clearAuthAndRedirect(), 400)
        return
      }

      if (res.status === 401) {
        // 権限切れでもログアウトへ
        clearAuthAndRedirect()
        return
      }

      let msg = `削除に失敗しました (HTTP ${res.status})`
      try {
        const data = await res.json()
        if (data?.message) msg = data.message
      } catch {}
      setSnack({ open: true, message: msg, severity: 'error' })
    } catch (e) {
      const isAbort = e && typeof e === 'object' && e.name === 'AbortError'
      setSnack({ open: true, message: isAbort ? '通信がタイムアウトしました。' : 'ネットワークエラーが発生しました。', severity: 'error' })
    } finally {
      setDeleting(false)
      setConfirmOpen(false)
    }
  }

  return (
    <Card>
      <CardHeader title='アカウントの削除' />
      <CardContent className='flex flex-col items-start gap-6'>
        <FormControlLabel control={<Checkbox checked={consent} onChange={e => setConsent(e.target.checked)} />} label='アカウントの無効化に同意します' />
        <Button variant='contained' color='error' disabled={!consent || deleting} onClick={() => setConfirmOpen(true)}>
          {deleting ? '削除中…' : 'アカウントを無効化'}
        </Button>
      </CardContent>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>本当に無効化しますか？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            この操作は元に戻せません。アカウントを削除すると、直ちにログアウトされます。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={deleting}>キャンセル</Button>
          <Button color='error' onClick={handleDelete} disabled={deleting} autoFocus>
            {deleting ? '削除中…' : '削除する'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnack(s => ({ ...s, open: false }))} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Card>
  )
}

export default AccountDelete
