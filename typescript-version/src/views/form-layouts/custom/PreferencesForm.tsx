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
import { Bank, Banks, CreditType, CreditTypes, Neighborhood, Neighborhoods } from 'src/configs/credits'

interface State {
  budget: number
  duration: number
  banks: Bank[]
  neighborhoods: Neighborhood[]
  creditType: CreditType
}

const PreferencesForm = () => {
  const router = useRouter()
  const context = useData()

  // ** States
  const [values, setValues] = useState<State>({
    budget: 0,
    duration: 0,
    banks: [],
    creditType: 'Adquisicion',
    neighborhoods: []
  })

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event)
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClick = () => {
    context?.setData({
      ...context?.data,
      budget: values.budget,
      duration: values.duration,
      banks: values.banks,
      neighborhoods: values.neighborhoods,
      creditType: values.creditType
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
                <Select
                  label='Banco'
                  multiple
                  defaultValue={context?.data.banks ?? []}
                  id='form-layouts-separator-select'
                  onChange={() => handleChange('banks')}
                >
                  labelId='form-layouts-separator-select-label'
                  {Banks.map(bank => (
                    <MenuItem key={bank} value={bank}>
                      {bank}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Barrio donde te gustaria comprar?</InputLabel>
                <Select
                  label='barrio'
                  multiple
                  defaultValue={context?.data.neighborhoods ?? []}
                  id='form-layouts-separator-select'
                  onChange={() => handleChange('neighborhoods')}
                >
                  labelId='form-layouts-separator-select-label'
                  {Neighborhoods.map(neighborhood => (
                    <MenuItem key={neighborhood} value={neighborhood}>
                      {neighborhood}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>
                  Tipo de credito que te gustaria obtener?
                </InputLabel>
                <Select
                  label='creditType'
                  defaultValue={context?.data.creditType ?? 'Adquisicion'}
                  id='form-layouts-separator-select'
                  onChange={() => handleChange('creditType')}
                >
                  labelId='form-layouts-separator-select-label'
                  {CreditTypes.map(creditType => (
                    <MenuItem key={creditType} value={creditType}>
                      {creditType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='number'
                defaultValue={context?.data.budget}
                label='Presupuesto'
                onChange={handleChange('budget')}
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
                defaultValue={context?.data.duration}
                onChange={handleChange('duration')}
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
