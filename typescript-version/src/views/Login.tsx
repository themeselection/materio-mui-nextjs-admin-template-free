'use client'

// React Imports
import { useState } from 'react'
import type { FormEvent } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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

// Config Imports
import themeConfig from '@configs/themeConfig'

const Login = () => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  // Hooks
  const router = useRouter()

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    router.push('/')
  }

  return (
    <Card className='flex flex-col is-[450px]'>
      <CardContent>
        <div className='flex justify-center items-start'>Logo</div>
        <Typography>{`Welcome to ${themeConfig.templateName}!👋🏻`}</Typography>
        <Typography>Please sign-in to your account and start the adventure</Typography>
        <form noValidate action={() => {}} autoComplete='off' onSubmit={handleSubmit}>
          <TextField autoFocus fullWidth label='Email' />
          <TextField
            fullWidth
            label='Password'
            id='outlined-adornment-password'
            type={isPasswordShown ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                    <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
            <FormControlLabel control={<Checkbox />} label='Remember me' />
            <Typography className='text-end' color='primary' component={Link} href='/forgot-password'>
              Forgot password?
            </Typography>
          </div>
          <Button fullWidth variant='contained' type='submit'>
            Log In
          </Button>
          <div className='flex justify-center items-center flex-wrap gap-2'>
            <Typography>New on our platform?</Typography>
            <Typography component={Link} href='/register' color='primary'>
              Create an account
            </Typography>
          </div>
          <Divider className='gap-2'>Or</Divider>
          <div className='flex justify-center items-center'>
            <IconButton href='/' component={Link} onClick={e => e.preventDefault()}>
              <i className='ri-facebook-circle-fill' />
            </IconButton>
            <IconButton href='/' component={Link} onClick={e => e.preventDefault()}>
              <i className='ri-twitter-fill' />
            </IconButton>
            <IconButton href='/' component={Link} onClick={e => e.preventDefault()}>
              <i className='ri-github-fill' />
            </IconButton>
            <IconButton href='/' component={Link} onClick={e => e.preventDefault()}>
              <i className='ri-google-line' />
            </IconButton>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default Login
