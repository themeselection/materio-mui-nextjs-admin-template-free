import React, { useState } from 'react'
import { TextField, Button, FormControlLabel, Radio, RadioGroup, FormControl, FormLabel } from '@mui/material'
import styled from '@emotion/styled'
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/router';

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  position:'relative',
  margin: '2rem auto',
}))

const IconContainer = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '0',
  right: '30px',
  margin: '1rem',
  cursor: 'pointer'
}))

const MyForm = ({ Data }) => {
  const [formData, setFormData] = useState({
    username: Data.username,
    email: Data.email,
    firstName: Data.firstName,
    lastName: Data.lastName,
    gender: Data.gender
  })

  const router = useRouter()

  const handleChange = event => {
    const { name, value } = event.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = event => {
    event.preventDefault()

  }

  const handleClose = () => {
    router.push('/')
  }

  return (
    <Container>
      <form onSubmit={handleSubmit} className='my-form'>
        <TextField
          name='username'
          label='Username'
          value={formData.username}
          onChange={handleChange}
          fullWidth
          margin='normal'
          required
        />
        <TextField
          name='email'
          label='Email'
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin='normal'
          type='email'
          required
        />
        <TextField
          name='firstName'
          label='First Name'
          value={formData.firstName}
          onChange={handleChange}
          fullWidth
          margin='normal'
          required
        />
        <TextField
          name='lastName'
          label='Last Name'
          value={formData.lastName}
          onChange={handleChange}
          fullWidth
          margin='normal'
          required
        />
        <FormControl component='fieldset' margin='normal'>
          <FormLabel component='legend'>Gender</FormLabel>
          <RadioGroup name='gender' value={formData.gender} onChange={handleChange} row>
            <FormControlLabel value='female' control={<Radio />} label='Female' />
            <FormControlLabel value='male' control={<Radio />} label='Male' />
            <FormControlLabel value='other' control={<Radio />} label='Other' />
          </RadioGroup>
        </FormControl>
      </form>
      <Button type='submit' variant='contained' color='primary'>
        Submit
      </Button>
      <IconContainer>
      <CloseIcon onClick={handleClose} />
      </IconContainer>

    </Container>
  )
}

export default MyForm
