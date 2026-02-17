'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import Illustrations from '@components/Illustrations'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

const Login = ({ mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [employeeUserId, setEmployeeUserId] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Vars
  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  // Hooks
  const router = useRouter()
  const searchParams = useSearchParams()
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const apiBase = process.env.NEXT_PUBLIC_BASE_PATH || ''

      const res = await fetch(`${apiBase}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee_user_id: employeeUserId, password })
      })

      if (res.ok) {
        const data = await res.json()
        const storage = rememberMe ? window.localStorage : window.sessionStorage

        if (data?.access_token) storage.setItem('access_token', data.access_token)
        if (data?.user) storage.setItem('user', JSON.stringify(data.user))
  const next = searchParams?.get('next')

  router.push(next || '/')
      } else if (res.status === 401) {
        let msg = 'ユーザーIDまたはパスワードが正しくありません'

        try {
          const err = await res.json()

          if (err?.error) msg = err.error
        } catch {}

        setError(msg)
      } else {
        setError(`ログインに失敗しました (HTTP ${res.status})`)
      }
    } catch (err) {
      setError('サーバーに接続できませんでした。ネットワークをご確認ください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] relative p-6'>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='p-6 sm:!p-12'>
          <Link href='/' className='flex justify-center items-center mbe-6'>
            <Logo />
          </Link>
          <div className='flex flex-col gap-5'>
            <div>
              <Typography variant='h4'>{`${themeConfig.templateName} へようこそ！👋🏻`}</Typography>
              <Typography className='mbs-1'>アカウントにサインインして始めましょう</Typography>
            </div>
            <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-5'>
              {searchParams?.get('registered') === '1' ? (
                <Alert severity='success'>アカウント登録が完了しました。ログインしてください。</Alert>
              ) : null}
              {error ? <Alert severity='error'>{error}</Alert> : null}
              <TextField
                autoFocus
                fullWidth
                label='ユーザーID'
                placeholder='hana.kato'
                value={employeeUserId}
                onChange={e => setEmployeeUserId(e.target.value)}
                disabled={loading}
                autoComplete='username'
              />
              <TextField
                fullWidth
                label='パスワード'
                id='outlined-adornment-password'
                type={isPasswordShown ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
                autoComplete='current-password'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        size='small'
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={e => e.preventDefault()}
                        disabled={loading}
                      >
                        <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
                <FormControlLabel
                  control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} disabled={loading} />}
                  label='ログイン状態を保持する'
                />
                <Typography className='text-end' color='primary' component={Link} href='/forgot-password'>
                  パスワードをお忘れですか？
                </Typography>
              </div>
              <Button fullWidth variant='contained' type='submit' disabled={loading || !employeeUserId || !password}>
                {loading ? 'ログイン中…' : 'ログイン'}
              </Button>
              <div className='flex justify-center items-center flex-wrap gap-2'>
                <Typography>はじめてご利用ですか？</Typography>
                <Typography component={Link} href='/register' color='primary'>
                  アカウント作成
                </Typography>
              </div>
              <Divider className='gap-3'>または(未実装)</Divider>
              <div className='flex justify-center items-center gap-2'>
                <IconButton size='small' className='text-facebook'>
                  <i className='ri-facebook-fill' />
                </IconButton>
                <IconButton size='small' className='text-twitter'>
                  <i className='ri-twitter-fill' />
                </IconButton>
                <IconButton size='small' className='text-github'>
                  <i className='ri-github-fill' />
                </IconButton>
                <IconButton size='small' className='text-googlePlus'>
                  <i className='ri-google-fill' />
                </IconButton>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
      <Illustrations maskImg={{ src: authBackground }} />
    </div>
  )
}

export default Login
