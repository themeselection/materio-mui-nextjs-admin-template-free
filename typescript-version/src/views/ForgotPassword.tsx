'use client'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

// Component Imports
import Form from '@components/Form'
import DirectionalIcon from '@components/DirectionalIcon'

const ForgotPassword = () => {
  return (
    <Card className='flex flex-col is-[450px]'>
      <CardContent>
        <div className='flex justify-center items-start'>Logo</div>
        <Typography>Forgot Password 🔒</Typography>
        <Typography>Enter your email and we&#39;ll send you instructions to reset your password</Typography>
        <Form noValidate autoComplete='off'>
          <TextField autoFocus fullWidth label='Email' />
          <Button fullWidth variant='contained' type='submit'>
            Send reset link
          </Button>
          <Typography className='flex justify-center items-center' color='primary'>
            <Link href='/login' className='flex items-center'>
              <DirectionalIcon ltrIconClass='ri-arrow-left-s-line' rtlIconClass='ri-arrow-right-s-line' />
              <span>Back to Login</span>
            </Link>
          </Typography>
        </Form>
      </CardContent>
    </Card>
  )
}

export default ForgotPassword
