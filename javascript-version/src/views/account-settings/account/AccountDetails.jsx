'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

// Hooks
import useAuthMe from '@core/hooks/useAuthMe'
import { invalidateMeCache } from '@/utils/auth/meClient'

// パレット（employee-list と同一仕様）
const basePalette = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e']
const palette = Array.from(new Set([...basePalette, '#FF8800']))

// 初期フォーム（employee-list に合わせる）
const initialForm = {
  employeeUserId: '',
  lastName: '',
  firstName: '',
  password: '',
  roleId: '',
  lineId: '',
  status: '在籍中',
  specialNotes: '',
  iconColor: '#FF8800'
}

// Avatar テキスト（姓優先で最大3文字）
const getAvatarText = (ln, fn) => {
  const base = String(ln || fn || '氏名').trim()
  if (!base) return '氏名'
  return base.slice(0, 3)
}

// 表示名（「姓 名」）
const getDisplayName = (ln, fn) => {
  const l = String(ln || '').trim()
  const f = String(fn || '').trim()
  if (!l && !f) return '氏名'
  return f ? `${l} ${f}` : l
}

// #付きHEXへ正規化
const ensureHash = v => {
  const s = String(v || '').trim()
  if (!s) return '#FF8800'
  return s.startsWith('#') ? s : `#${s}`
}

// 認可ヘッダ（簡易版）
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

const AccountDetails = () => {
  const apiBase = process.env.NEXT_PUBLIC_BASE_PATH || ''

  // 認証ユーザーから初期値を反映
  const { user } = useAuthMe()

  const [form, setForm] = useState(initialForm)
  const [roles, setRoles] = useState([])
  const [lines, setLines] = useState([])
  const [loadingRoles, setLoadingRoles] = useState(true)
  const [loadingLines, setLoadingLines] = useState(true)
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [employeeInit, setEmployeeInit] = useState(null)
  const [saving, setSaving] = useState(false)
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' })

  // me から氏名とIDを流し込み（編集開始時の初期化）
  useEffect(() => {
    if (!user) return
    const name = String(user?.employee_name || user?.name || '').trim()
    // "姓 名" の想定で分割（最初の空白で区切る）
    const [ln, ...rest] = name.split(/\s+/)
    const fn = rest.join(' ')

    setForm(prev => ({
      ...prev,
      employeeUserId: user?.employee_user_id || user?.id || '',
      lastName: ln || '',
      firstName: fn || '',
      iconColor: user?.employee_color_code ? `#${String(user.employee_color_code).replace(/^#/, '')}` : prev.iconColor
    }))
  }, [user])

  // 役割/ラインを取得（employee-list と同様のエンドポイント）
  useEffect(() => {
    const ac = new AbortController()
    const headers = { ...getAuthHeaders() }

    ;(async () => {
      try {
        setLoadingRoles(true)
        const res = await fetch(`${apiBase}/api/roles`, { signal: ac.signal, headers })
        if (res.ok) {
          const data = await res.json()
          const list = Array.isArray(data) ? data : (Array.isArray(data?.roles) ? data.roles : [])
          setRoles(list)
        } else {
          setRoles([])
        }
      } catch {
        setRoles([])
      } finally {
        setLoadingRoles(false)
      }
    })()

    ;(async () => {
      try {
        setLoadingLines(true)
        const res = await fetch(`${apiBase}/api/lines`, { signal: ac.signal, headers })
        if (res.ok) {
          const data = await res.json()
          const list = Array.isArray(data) ? data : (Array.isArray(data?.lines) ? data.lines : [])
          setLines(list)
        } else {
          setLines([])
        }
      } catch {
        setLines([])
      } finally {
        setLoadingLines(false)
      }
    })()

    return () => ac.abort()
  }, [apiBase])

  const togglePasswordShown = () => setIsPasswordShown(s => !s)

  const displayName = useMemo(() => getDisplayName(form.lastName, form.firstName), [form.lastName, form.firstName])
  const avatarText = useMemo(() => getAvatarText(form.lastName, form.firstName), [form.lastName, form.firstName])

  const handleFormChange = e => {
    const { name, value } = e.target
    if (name === 'roleId' || name === 'lineId') {
      const v = value === '' ? '' : (typeof value === 'number' ? value : Number(value))
      setForm(prev => ({ ...prev, [name]: v }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleReset = () => setForm(initialForm)

  const buildPayload = () => {
    const name = getDisplayName(form.lastName, form.firstName)
    return {
      employee_name: name,
      employee_user_id: form.employeeUserId || '',
      password: form.password ? form.password : null,
      role_id: form.roleId === '' ? null : form.roleId,
      line_id: form.lineId === '' ? null : form.lineId,
      is_active: form.status === '在籍中',
      color_code: String(form.iconColor || '#FF8800').replace(/^#/, ''),
      special_notes: form.specialNotes || ''
    }
  }

  const handleSave = async e => {
    e?.preventDefault?.()
    if (!user?.employee_id) {
      setSnack({ open: true, message: 'ユーザー情報が取得できませんでした。', severity: 'error' })
      return
    }

    // 簡易バリデーション
    if (!form.employeeUserId) {
      setSnack({ open: true, message: 'ユーザーIDを入力してください。', severity: 'warning' })
      return
    }

    setSaving(true)
    try {
      const headers = { 'Content-Type': 'application/json', ...getAuthHeaders() }
      const res = await fetch(`${apiBase}/api/employees/${user.employee_id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(buildPayload())
      })

      if (!res.ok) {
        let msg = `保存に失敗しました (HTTP ${res.status})`
        try {
          const data = await res.json()
          if (data?.message) msg = data.message
        } catch {}
        setSnack({ open: true, message: msg, severity: 'error' })
        return
      }

      invalidateMeCache()
      setSnack({ open: true, message: '変更を保存しました。', severity: 'success' })
      setForm(prev => ({ ...prev, password: '' }))
    } catch (e) {
      const isAbort = e && typeof e === 'object' && e.name === 'AbortError'
      setSnack({ open: true, message: isAbort ? '通信がタイムアウトしました。' : 'ネットワークエラーが発生しました。', severity: 'error' })
    } finally {
      setSaving(false)
    }
  }


  // 自分自身の従業員詳細を取得して初期値に反映
  useEffect(() => {
    if (!user?.employee_id) return
    const ac = new AbortController()
    const headers = { ...getAuthHeaders() }

    ;(async () => {
      try {
        const res = await fetch(`${apiBase}/api/employees/${user.employee_id}`, { signal: ac.signal, headers })
        if (!res.ok) return
        const data = await res.json()

        // 例のレスポンスを想定
        // {
        //   employee_id, employee_name, employee_user_id, is_active, role_name, line_name, special_notes, color_code
        // }
        const name = String(data?.employee_name || '').trim()
        const [ln, ...rest] = name.split(/\s+/)
        const fn = rest.join(' ')

        setForm(prev => ({
          ...prev,
          employeeUserId: data?.employee_user_id || prev.employeeUserId,
          lastName: ln || prev.lastName,
          firstName: fn || prev.firstName,
          status: data?.is_active ? '在籍中' : '退職済',
          specialNotes: data?.special_notes || '',
          iconColor: data?.color_code ? ensureHash(data.color_code) : prev.iconColor
        }))

        setEmployeeInit({
          role_name: data?.role_name || '',
          line_name: data?.line_name || ''
        })
      } catch {
        // ignore
      }
    })()

    return () => ac.abort()
  }, [apiBase, user?.employee_id])

  // 役割/ラインの名称からIDを初期設定（一覧が取得できてから反映）
  useEffect(() => {
    if (!employeeInit) return

    setForm(prev => {
      let next = { ...prev }

      if (!prev.roleId && employeeInit.role_name && roles?.length) {
        const r = roles.find(r => r?.role_name === employeeInit.role_name)
        if (r && (r.role_id || r.role_id === 0)) next.roleId = r.role_id
      }

      if ((prev.lineId === '' || prev.lineId == null) && employeeInit.line_name && lines?.length) {
        const l = lines.find(l => l?.line_name === employeeInit.line_name)
        if (l && (l.line_id || l.line_id === 0)) next.lineId = l.line_id
      }

      return next
    })
  }, [employeeInit, roles, lines])

  return (
    <Card>
      <CardContent className='mbe-5'>
        <div className='flex max-sm:flex-col items-center gap-6'>
          <Avatar
            sx={{ width: 80, height: 80, bgcolor: form.iconColor, fontSize: 36, fontWeight: 700, color: '#fff' }}
            alt={displayName}
          >
            {avatarText}
          </Avatar>
          <div className='flex flex-col'>
            <Typography variant='h6' className='font-bold'>{displayName}</Typography>
            <Typography variant='body2' color='text.secondary'>{form.employeeUserId || 'ユーザーID'}</Typography>
          </div>
        </div>
        <div className='mti-0 mbs-5'>
          <Typography variant='body2' sx={{ mb: 1 }}>色を選択</Typography>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {palette.map(color => (
              <IconButton
                key={color}
                size='small'
                onClick={() => setForm(prev => ({ ...prev, iconColor: color }))}
                title={color}
                sx={{
                  width: 28,
                  height: 28,
                  padding: 0,
                  borderRadius: '50%',
                  border: form.iconColor === color ? '2px solid #6366f1' : '2px solid #fff',
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.08)',
                  background: color,
                  '&:hover': { background: color, opacity: 0.85 }
                }}
              />
            ))}
          </div>
        </div>
      </CardContent>
      <CardContent>
  <form onSubmit={handleSave}>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='ユーザーID'
                placeholder='hana.kato'
                name='employeeUserId'
                value={form.employeeUserId}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label='姓'
                placeholder='加藤'
                name='lastName'
                value={form.lastName}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label='名'
                placeholder='花'
                name='firstName'
                value={form.firstName}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='パスワード（変更時のみ）'
                type={isPasswordShown ? 'text' : 'password'}
                name='password'
                value={form.password}
                onChange={handleFormChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton size='small' edge='end' onClick={togglePasswordShown} onMouseDown={e => e.preventDefault()}>
                        <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label='役割'
                name='roleId'
                value={form.roleId === '' ? '' : form.roleId}
                onChange={handleFormChange}
                disabled={loadingRoles || roles.length === 0}
                SelectProps={{ MenuProps: { disablePortal: true } }}
              >
                {loadingRoles ? (
                  <MenuItem value='' disabled>読み込み中…</MenuItem>
                ) : (
                  roles.map(role => (
                    <MenuItem key={role?.role_id ?? role?.role_name} value={role?.role_id}>
                      {role?.role_name}{role?.is_admin ? '（管理者）' : ''}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label='担当ライン'
                name='lineId'
                value={form.lineId === '' ? '' : form.lineId}
                onChange={handleFormChange}
                disabled={loadingLines}
                SelectProps={{ MenuProps: { disablePortal: true } }}
                helperText={(!loadingLines && lines.length === 0) ? 'ラインが未登録です。管理画面から追加してください。' : '　'}
              >
                <MenuItem value=''>未選択</MenuItem>
                {loadingLines ? (
                  <MenuItem value='' disabled>読み込み中…</MenuItem>
                ) : (
                  lines.map(line => (
                    <MenuItem key={line?.line_id ?? line?.line_name} value={line?.line_id}>
                      {line?.line_name}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label='在籍状況'
                name='status'
                value={form.status}
                onChange={handleFormChange}
                SelectProps={{ MenuProps: { disablePortal: true } }}
              >
                <MenuItem value='在籍中'>在籍中</MenuItem>
                <MenuItem value='退職済'>退職済</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='特記事項'
                placeholder='夜勤中心 など'
                name='specialNotes'
                value={form.specialNotes}
                onChange={handleFormChange}
                multiline
                minRows={2}
              />
            </Grid>
            <Grid item xs={12} className='flex gap-4 flex-wrap'>
              <Button variant='contained' type='submit' disabled={saving}>
                {saving ? '保存中…' : '変更を保存'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnack(s => ({ ...s, open: false }))}
          severity={snack.severity}
          sx={{ width: '100%' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Card>
  )
}

export default AccountDetails
