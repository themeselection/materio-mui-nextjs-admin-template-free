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
import { useRouter } from 'next/router'
import { useData } from 'src/@core/layouts/HipotecarLayout'

interface State {
  name: string
}

const BaseForm = () => {
  const router = useRouter()
  const context = useData()

  // ** States
  const [values, setValues] = useState<State>({
    name: ''
  })

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClick = () => {
    context?.setData({ ...context?.data, user: { ...context?.data.user, name: values.name } })
    router.push('/risk')
  }

  return (
    <Card>
      <CardHeader
        title='Hola! Cual es tu nombre?'
        subheader='En menos de 3 minutos tendras tus resultados!'
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent>
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Name'
                defaultValue={context?.data.user.name}
                placeholder='Leo Messi'
                onChange={handleChange('name')}
              />
            </Grid>

            <Typography variant='caption' style={{ marginLeft: '2em', marginTop: '1em' }}>
              No sabes lo que es un credito hipotecario?{' '}
              <Link href='https://es.wikipedia.org/wiki/Cr%C3%A9dito_hipotecario' target='_blank'>
                Haz click aqui.
              </Link>
            </Typography>
            <Grid container spacing={5}></Grid>

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

export default BaseForm
