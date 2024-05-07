// ** React Imports
import { ChangeEvent, MouseEvent, useState, SyntheticEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import { Checkbox, FormControlLabel, FormGroup, MenuItem } from '@mui/material'
import { useRouter } from 'next/router'
import { MessageOutline, TimerOutline, WalletOutline } from 'mdi-material-ui'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useData } from 'src/@core/layouts/HipotecarLayout'

interface State {
  budget: number
  duration: number
  bank: string
  neighborhood: string
}

const PreferencesForm = () => {
  const router = useRouter()
  const context = useData()

  // ** States
  const [values, setValues] = useState<State>({
    budget: 0,
    duration: 0,
    bank: '',
    neighborhood: ''
  })

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClick = () => {
    context?.setData({
      ...context?.data,
      budget: values.budget,
      duration: values.duration,
      bank: values.bank,
      neighborhood: values.neighborhood
    })

    router.push('/comparison')
  }

  return (
    <Card>
      <CardHeader title='Veamos, cuales son tus preferencias?' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Recibis tus haberes en algun banco?</InputLabel>
                <Select label='Banco' multiple defaultValue={[]} id='form-layouts-separator-select' onChange={ () => handleChange("bank")}>
                  labelId='form-layouts-separator-select-label'
                  <MenuItem value='bbva'>BBVA</MenuItem>
                  <MenuItem value='supervielle'>Supervielle</MenuItem>
                  <MenuItem value='santander'>Santander</MenuItem>
                  <MenuItem value='hipotecario'>Hipotecario</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Barrio donde te gustaria comprar?</InputLabel>
                <Select label='barrio' multiple defaultValue={[]} id='form-layouts-separator-select'  onChange={ () => handleChange("neighborhood")}>
                  labelId='form-layouts-separator-select-label'
                  <MenuItem value='almagro'>Almagro</MenuItem>
                  <MenuItem value='balvanera'>Balvanera</MenuItem>
                  <MenuItem value='palermo'>Palermo</MenuItem>
                  <MenuItem value='recoleta'>Recoleta</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='number'
                label='Presupuesto'
                onChange={handleChange("budget")}
                placeholder='$100,000'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <WalletOutline />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type='number'
                label='Años'
                onChange={handleChange("duration")}
                placeholder='30'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <TimerOutline />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type='submit' variant='contained' size='large' onClick={handleClick}>
                Confirmar
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default PreferencesForm
