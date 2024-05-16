// ** React Imports
import { ChangeEvent, MouseEvent, useState, SyntheticEvent, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Link
} from '@mui/material'
import { useRouter } from 'next/router'
import {
  ArrowDown,
  ArrowDownBoldOutline,
  ExpandAll,
  ExpandAllOutline,
  TimerOutline,
  WalletOutline
} from 'mdi-material-ui'
import { Credit } from 'src/configs/constants'
import { UserData, useData } from 'src/@core/layouts/HipotecarLayout'
import { parseMoney } from 'src/@core/utils/string'
import {
  CreditEvaluationResult,
  calcularAdelanto,
  calcularCuotaMensual,
  getCompatibleCredits
} from 'src/@core/utils/misc'
import { useAsync } from 'react-async'
import { SubmitUserBody } from 'src/pages/api/users'
import { set } from 'nprogress'

type ComparisonTableState = {
  budget: number
  duration: number
}

const ComparisonForm = () => {
  const router = useRouter()
  const context = useData()

  const [saving, setSaving] = useState<boolean>(false)
  const [saved, setSaved] = useState<boolean>(false)

  const handleClick = () => {
    setSaving(true)

    // Set Email
    context?.setData({ ...context.data, user: { ...context.data.user, email } })

    if (!context?.data.user) {
      return
    }

    const body: SubmitUserBody = {
      data: context?.data.user,
      compatibleCredits: compatibleCreditsResults.creditosCompatibles
    }

    fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(resp => {
        if (resp.ok) {
          console.log('Saved successfully.')
        } else {
          console.error('Error:', resp.statusText)
        }
        setSaving(false)
        setSaved(true)
      })
      .catch(e => {
        console.error('Error:', e)
        setSaving(false)
        setSaved(false)
      })
  }

  const [compatibleCreditsResults, setCompatibleCreditsResult] = useState<CreditEvaluationResult>({
    creditosCompatibles: [],
    razonesDeLosRestantes: []
  })

  useEffect(() => {
    const compatibleCredits = getCompatibleCredits(context?.data.credits ?? [], context?.data.user ?? {})
    setCompatibleCreditsResult(compatibleCredits)
  }, [context?.data.user, context?.data.credits])

  const handleChange = (prop: keyof UserData) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
    context?.setData({ ...context.data, user: { ...context.data.user, [prop]: event.target.value } })
  }

  const [values, setValues] = useState<ComparisonTableState>({
    budget: 0,
    duration: 20
  })

  useEffect(() => {
    const updatedValues: ComparisonTableState = { ...values }

    Object.keys(values).forEach(key => {
      const val = values[key as keyof ComparisonTableState]
      const newVal = context?.data.user[key as keyof ComparisonTableState]

      // If it is already set, avoid
      if ((Array.isArray(val) && val.length) || (!Array.isArray(val) && val)) return

      // If no new value, avoid
      if (!context || (Array.isArray(newVal) && !newVal.length) || (!Array.isArray(newVal) && !newVal)) return

      updatedValues[key as keyof ComparisonTableState] = newVal as never
    })

    setValues(updatedValues)
  }, [context?.data.user])

  const defaultEmail = 'leo@messi.com'
  const [email, setEmail] = useState<string>(defaultEmail)
  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
    context?.setData({ ...context.data, user: { ...context.data.user, email: event.target.value } })
  }
  useEffect(() => {
    if (email != defaultEmail) return
    if (!context?.data.user.email) return
    setEmail(context?.data.user.email)
  }, [context?.data.user.email])

  return (
    <Card>
      <CardHeader
        title='Tus resultados'
        titleTypographyProps={{ variant: 'h6' }}
        subheader='En base a tus preferencias y la oferta disponible.'
      />
      <CardContent>
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type='number'
                    value={values.budget}
                    label={`Presupuesto del inmueble en ARS ${
                      context?.data.dolar && values.budget
                        ? `(${parseMoney(values.budget / context?.data.dolar, 'USD')} )`
                        : ''
                    }`}
                    onChange={handleChange('budget')}
                    placeholder='$100000000'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <WalletOutline />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Años'
                    value={values.duration}
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
              </Grid>
              <TableContainer>
                <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
                  <TableHead>
                    <TableRow>
                      {/* Image */}
                      <TableCell></TableCell>
                      <TableCell>Creditos Recomendados</TableCell>
                      <TableCell>Cuota</TableCell>
                      <TableCell>Adelanto</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {compatibleCreditsResults.creditosCompatibles.map((row: Credit, index) => (
                      <TableRow
                        hover={row.Link.length > 0}
                        key={index}
                        style={{ opacity: index === 0 ? 1 : 0.5 }}
                        sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
                      >
                        <TableCell width={30}>
                          <img
                            src={`/images/banks/${row.Banco}.png`}
                            alt={row.Nombre}
                            className='object-contain	'
                            height={40}
                          />
                        </TableCell>
                        <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>
                              {row.Nombre}
                              {index === 0 && (
                                <Typography variant='caption'>
                                  <Chip label='Cuota mas baja' size='small' color='primary' />
                                </Typography>
                              )}
                            </Typography>
                            <Typography variant='caption'>Banco {row.Banco}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Grid container>
                            <Grid item xs={12} color='blueviolet'>
                              {context?.data.user.budget &&
                                context.data.user.duration &&
                                parseMoney(
                                  calcularCuotaMensual(context.data.user.budget, row.Tasa, context.data.user.duration)
                                )}

                              {row['Tasa especial por tiempo definido'] &&
                                context?.data.user.budget &&
                                context.data.user.duration && (
                                  <Typography>
                                    {parseMoney(
                                      calcularCuotaMensual(
                                        context.data.user.budget,
                                        row['Tasa especial por tiempo definido'],
                                        context.data.user.duration
                                      )
                                    )}{' '}
                                    por {row['Duracion Tasa Especial en Meses']} meses
                                  </Typography>
                                )}
                            </Grid>
                            <Grid item xs={12} color='green'>
                              {context?.data.user.budget &&
                                context.data.user.duration &&
                                context.data.dolar &&
                                parseMoney(
                                  calcularCuotaMensual(context.data.user.budget, row.Tasa, context.data.user.duration) /
                                    context.data.dolar,
                                  'USD'
                                )}{' '}
                              {row['Tasa especial por tiempo definido'] &&
                                context?.data.user.budget &&
                                context.data.user.duration &&
                                context.data.dolar && (
                                  <Typography>
                                    {parseMoney(
                                      calcularCuotaMensual(
                                        context.data.user.budget,
                                        row['Tasa especial por tiempo definido'],
                                        context.data.user.duration
                                      ) / context.data.dolar,
                                      'USD'
                                    )}{' '}
                                    por {row['Duracion Tasa Especial en Meses']} meses
                                  </Typography>
                                )}
                            </Grid>
                          </Grid>
                        </TableCell>
                        <TableCell>
                          <Grid container>
                            <Grid item xs={12} color='blueviolet'>
                              {context?.data.user.budget &&
                                parseMoney(calcularAdelanto(context.data.user.budget, row['% Maximo de Financiacion']))}
                            </Grid>
                            <Grid item xs={12} color='green'>
                              {context?.data.user.budget &&
                                context.data.dolar &&
                                parseMoney(
                                  calcularAdelanto(context.data.user.budget, row['% Maximo de Financiacion']) /
                                    context.data.dolar,
                                  'USD'
                                )}{' '}
                            </Grid>
                          </Grid>
                        </TableCell>

                        <TableCell>
                          {row.Link.length > 0 && (
                            <Link href={row.Link} target='_blank'>
                              Ir al sitio del banco
                            </Link>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {compatibleCreditsResults.razonesDeLosRestantes.length > 0 && (
                <Accordion style={{ width: '100%' }}>
                  <AccordionSummary expandIcon={<ArrowDown />} aria-controls='panel1-content' id='panel1-header'>
                    Por que los demas creditos no aparecen?
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableRow>
                      <TableCell colSpan={4}>
                        {compatibleCreditsResults.razonesDeLosRestantes.map((r, i) => (
                          <Typography key={i} align='center' variant='caption'>
                            {r}
                            <br></br>
                          </Typography>
                        ))}
                      </TableCell>
                    </TableRow>
                  </AccordionDetails>
                </Accordion>
              )}
            </Grid>

            <Grid container spacing={2} margin={4}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  style={{ width: '100%', height: '100%' }}
                  type='email'
                  label='Email'
                  placeholder='leomessi@gmail.com'
                  value={email}
                  onChange={handleEmailChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  type='submit'
                  variant='outlined'
                  onClick={handleClick}
                  disabled={saving || saved}
                  style={{
                    opacity: saving ? 0.5 : 1,
                    width: '100%',
                    height: '100%',
                    fontSize: '.7em',
                    maxHeight: '100%',
                    overflow: 'hidden'
                  }}
                >
                  {saving
                    ? 'Guardando...'
                    : saved
                    ? 'Guardado!'
                    : 'Encender alertas y recibir informacion de creditos alineados con mis intereses'}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default ComparisonForm
