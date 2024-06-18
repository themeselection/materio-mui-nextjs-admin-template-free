'use client'

// React Imports
import { useState } from 'react'
import type { ChangeEvent } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import type { SelectChangeEvent } from '@mui/material/Select'

type Data = {
  firstName: string
  lastName: string
  email: string
  organization: string
  phoneNumber: number | string
  address: string
  state: string
  zipCode: string
  country: string
  language: string
  timezone: string
  currency: string
}

// Vars
const initialData: Data = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  organization: 'ThemeSelection',
  phoneNumber: '+1 (917) 543-9876',
  address: '123 Main St, New York, NY 10001',
  state: 'New York',
  zipCode: '634880',
  country: 'usa',
  language: 'arabic',
  timezone: 'gmt-12',
  currency: 'usd'
}

const languageData = ['English', 'Arabic', 'French', 'German', 'Portuguese']

const AccountDetails = () => {
  // States
  const [formData, setFormData] = useState<Data>(initialData)
  const [fileInput, setFileInput] = useState<string>('')
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')
  const [language, setLanguage] = useState<string[]>(['English'])

  const handleDelete = (value: string) => {
    setLanguage(current => current.filter(item => item !== value))
  }

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    setLanguage(event.target.value as string[])
  }

  const handleFormChange = (field: keyof Data, value: Data[keyof Data]) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleFileInputChange = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement

    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string)
      reader.readAsDataURL(files[0])

      if (reader.result !== null) {
        setFileInput(reader.result as string)
      }
    }
  }

  const handleFileInputReset = () => {
    setFileInput('')
    setImgSrc('/images/avatars/1.png')
  }

  return (
    <Card>
      <CardContent className='mbe-5'>
        <div className='flex max-sm:flex-col items-center gap-6'>
          <img height={100} width={100} className='rounded' src={imgSrc} alt='Profile' />
          <div className='flex flex-grow flex-col gap-4'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Button component='label' size='small' variant='contained' htmlFor='account-settings-upload-image'>
                Upload New Photo
                <input
                  hidden
                  type='file'
                  value={fileInput}
                  accept='image/png, image/jpeg'
                  onChange={handleFileInputChange}
                  id='account-settings-upload-image'
                />
              </Button>
              <Button size='small' variant='outlined' color='error' onClick={handleFileInputReset}>
                Reset
              </Button>
            </div>
            <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
          </div>
        </div>
      </CardContent>
      <CardContent>
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='First Name'
                value={formData.firstName}
                placeholder='John'
                onChange={e => handleFormChange('firstName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Last Name'
                value={formData.lastName}
                placeholder='Doe'
                onChange={e => handleFormChange('lastName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Email'
                value={formData.email}
                placeholder='john.doe@gmail.com'
                onChange={e => handleFormChange('email', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Organization'
                value={formData.organization}
                placeholder='ThemeSelection'
                onChange={e => handleFormChange('organization', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Phone Number'
                value={formData.phoneNumber}
                placeholder='+1 (234) 567-8901'
                onChange={e => handleFormChange('phoneNumber', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Address'
                value={formData.address}
                placeholder='Address'
                onChange={e => handleFormChange('address', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='State'
                value={formData.state}
                placeholder='New York'
                onChange={e => handleFormChange('state', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type='number'
                label='Zip Code'
                value={formData.zipCode}
                placeholder='123456'
                onChange={e => handleFormChange('zipCode', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Country</InputLabel>
                <Select
                  label='Country'
                  value={formData.country}
                  onChange={e => handleFormChange('country', e.target.value)}
                >
                  <MenuItem value='usa'>USA</MenuItem>
                  <MenuItem value='uk'>UK</MenuItem>
                  <MenuItem value='australia'>Australia</MenuItem>
                  <MenuItem value='germany'>Germany</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  multiple
                  label='Language'
                  value={language}
                  onChange={handleChange}
                  renderValue={selected => (
                    <div className='flex flex-wrap gap-2'>
                      {(selected as string[]).map(value => (
                        <Chip
                          key={value}
                          clickable
                          deleteIcon={
                            <i className='ri-close-circle-fill' onMouseDown={event => event.stopPropagation()} />
                          }
                          size='small'
                          label={value}
                          onDelete={() => handleDelete(value)}
                        />
                      ))}
                    </div>
                  )}
                >
                  {languageData.map(name => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>TimeZone</InputLabel>
                <Select
                  label='TimeZone'
                  value={formData.timezone}
                  onChange={e => handleFormChange('timezone', e.target.value)}
                  MenuProps={{ PaperProps: { style: { maxHeight: 250 } } }}
                >
                  <MenuItem value='gmt-12'>(GMT-12:00) International Date Line West</MenuItem>
                  <MenuItem value='gmt-11'>(GMT-11:00) Midway Island, Samoa</MenuItem>
                  <MenuItem value='gmt-10'>(GMT-10:00) Hawaii</MenuItem>
                  <MenuItem value='gmt-09'>(GMT-09:00) Alaska</MenuItem>
                  <MenuItem value='gmt-08'>(GMT-08:00) Pacific Time (US & Canada)</MenuItem>
                  <MenuItem value='gmt-08-baja'>(GMT-08:00) Tijuana, Baja California</MenuItem>
                  <MenuItem value='gmt-07'>(GMT-07:00) Chihuahua, La Paz, Mazatlan</MenuItem>
                  <MenuItem value='gmt-07-mt'>(GMT-07:00) Mountain Time (US & Canada)</MenuItem>
                  <MenuItem value='gmt-06'>(GMT-06:00) Central America</MenuItem>
                  <MenuItem value='gmt-06-ct'>(GMT-06:00) Central Time (US & Canada)</MenuItem>
                  <MenuItem value='gmt-06-mc'>(GMT-06:00) Guadalajara, Mexico City, Monterrey</MenuItem>
                  <MenuItem value='gmt-06-sk'>(GMT-06:00) Saskatchewan</MenuItem>
                  <MenuItem value='gmt-05'>(GMT-05:00) Bogota, Lima, Quito, Rio Branco</MenuItem>
                  <MenuItem value='gmt-05-et'>(GMT-05:00) Eastern Time (US & Canada)</MenuItem>
                  <MenuItem value='gmt-05-ind'>(GMT-05:00) Indiana (East)</MenuItem>
                  <MenuItem value='gmt-04'>(GMT-04:00) Atlantic Time (Canada)</MenuItem>
                  <MenuItem value='gmt-04-clp'>(GMT-04:00) Caracas, La Paz</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  label='Currency'
                  value={formData.currency}
                  onChange={e => handleFormChange('currency', e.target.value)}
                >
                  <MenuItem value='usd'>USD</MenuItem>
                  <MenuItem value='euro'>EUR</MenuItem>
                  <MenuItem value='pound'>Pound</MenuItem>
                  <MenuItem value='bitcoin'>Bitcoin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} className='flex gap-4 flex-wrap'>
              <Button variant='contained' type='submit'>
                Save Changes
              </Button>
              <Button variant='outlined' type='reset' color='secondary' onClick={() => setFormData(initialData)}>
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default AccountDetails
