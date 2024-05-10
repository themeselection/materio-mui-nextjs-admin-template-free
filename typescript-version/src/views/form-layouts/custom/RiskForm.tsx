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
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import { useRouter } from 'next/router'
import { useData } from 'src/@core/layouts/HipotecarLayout'

interface State {
  stableWork: boolean
  notOver50: boolean
  noDebts: boolean
  paymentCapacity: boolean
  minimumBudget: boolean
}

const RiskForm = () => {
  const router = useRouter()
  const context = useData()

  // ** States
  const [values, setValues] = useState<State>({
    stableWork: true,
    notOver50: true,
    minimumBudget: true,
    noDebts: true,
    paymentCapacity: true
  })

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.checked })
  }

  const handleClick = () => {
    context?.setData({
      ...context?.data,
      user: {
        ...context?.data.user,
        riskAssesmentPassed: true
      }
    })
    router.push('/preferences')
  }

  const allowed = !Object.values(values).some(v => v === false)

  return (
    <Card>
      <CardHeader
        title={`${
          context?.data.user.name || 'Primero'
        }, algunas preguntas para asegurarnos que te conviene sacar un credito hipotecario`}
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent>
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox onChange={handleChange('stableWork')} defaultChecked />}
                  label='Tengo un trabajo estable'
                />
                <FormControlLabel
                  control={<Checkbox onChange={handleChange('noDebts')} defaultChecked />}
                  label='No registro deudas en el sistema bancario Argentino'
                />
                <FormControlLabel
                  control={<Checkbox onChange={handleChange('paymentCapacity')} defaultChecked />}
                  label='Puedo dedicarle al menos un 20% de mi salario a pagar la cuota del credito o tengo otras formas de demostrar caoaacidad de pago.'
                />
                <FormControlLabel
                  control={<Checkbox onChange={handleChange('notOver50')} defaultChecked />}
                  label='No tengo mas de 50 años'
                />
                <FormControlLabel
                  control={<Checkbox onChange={handleChange('minimumBudget')} defaultChecked />}
                  label='Tengo disponible un monto minimo para cubrir gastos operativos'
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12} className='flex '>
              <Button type='submit' disabled={!allowed} variant='contained' size='large' onClick={handleClick}>
                Confirmar
              </Button>
              {!allowed && (
                <FormHelperText className='text-warning' style={{ color: 'red', fontSize: '1em' }}>
                  Exponerte a un credito podria representar un riesgo muy grande.
                  <br></br>Te recomendamos revisar los puntos de arriba con especialistas antes de continuar.
                </FormHelperText>
              )}
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default RiskForm
