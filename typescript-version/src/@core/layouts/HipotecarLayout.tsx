// ** React Imports
import { Dispatch, ReactChildren, SetStateAction, createContext, useContext, useEffect, useState } from 'react'

// ** MUI Imports
import Fab from '@mui/material/Fab'
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

// ** Icons Imports
import ArrowUp from 'mdi-material-ui/ArrowUp'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'

// ** Type Import
import { LayoutProps } from 'src/@core/layouts/types'

// ** Components
import AppBar from './components/vertical/appBar'
import Navigation from './components/vertical/navigation'
import Footer from './components/shared-components/footer'
import ScrollToTop from 'src/@core/components/scroll-to-top'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Step, StepConnector, StepIcon, StepLabel, Stepper, Typography } from '@mui/material'
import ProgressBar from './components/vertical/navigation/ProgressBar'
import { CreditType, Province } from 'src/configs/constants'
import { Credit, banksCsvUrl, creditsCsvUrl, loadDataFromCSV, provincesCsvUrl } from 'src/configs/constants'
import { useAsync } from 'react-async'
import { set } from 'nprogress'
import { PreferencesFormState } from 'src/views/form-layouts/custom/PreferencesForm'
import { getDolarMep } from '../utils/misc'

const VerticalLayoutWrapper = styled('div')({
  height: '100%',
  display: 'flex'
})

const MainContentWrapper = styled(Box)<BoxProps>({
  flexGrow: 1,
  minWidth: 0,
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column'
})

const ContentWrapper = styled('main')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  padding: theme.spacing(6),
  transition: 'padding .25s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}))

export type UserData = {
  name?: string
  riskAssesmentPassed?: boolean
  email?: string
} & Partial<PreferencesFormState>

export type ContextType = {
  data: {
    loaded: boolean
    user: UserData
    credits: Credit[]
    provinces: string[]
    banks: string[]
    dolar?: number
  }
  setData: Dispatch<
    SetStateAction<{
      user: UserData
      credits: any[]
      provinces: any
      banks: any
      loaded: boolean
      dolar?: number
    }>
  >
}
const DataContext = createContext<ContextType | null>(null)

export const useData = () => useContext(DataContext)

export const DataProvider = ({ children }: { children: any }) => {
  const [data, setData] = useState<{
    loaded: boolean
    user: UserData
    credits: Credit[]
    provinces: string[]
    banks: string[]
    dolar?: number
  }>({
    loaded: false,
    user: {},
    credits: [],
    provinces: [],
    banks: [],
    dolar: undefined
  })

  // Effect to load data from localStorage when the component mounts
  useEffect(() => {
    const savedData = localStorage.getItem('userData')
    if (savedData) {
      setData({ ...data, user: JSON.parse(savedData) })
    } else {
      setData({ ...data, loaded: true })
    }
  }, [])

  useEffect(() => {
    if (!data.loaded) {
      if (data.user && Object.keys(data.user).length) {
        // First time
        setData({ ...data, loaded: true })
      }
    }
  }, [data.user])

  useEffect(() => {
    const fetchData = async () => {
      const promises: Promise<any>[] = []

      if (data.credits.length === 0) {
        promises.push(loadDataFromCSV<Credit>(creditsCsvUrl))
      } else {
        promises.push(Promise.resolve(data.credits))
      }

      if (data.provinces.length === 0) {
        promises.push(loadDataFromCSV<{ Provincia: string }>(provincesCsvUrl))
      } else {
        promises.push(Promise.resolve(data.provinces))
      }

      if (data.banks.length === 0) {
        promises.push(loadDataFromCSV<{ Banco: string }>(banksCsvUrl))
      } else {
        promises.push(Promise.resolve(data.banks))
      }

      if (!data.dolar) {
        promises.push(getDolarMep())
      } else {
        promises.push(Promise.resolve(data.dolar))
      }

      const [loadedCredits, loadedProvinces, loadedBanks, dolar] = await Promise.all(promises)

      const provinceNames = Array.isArray(loadedProvinces) ? loadedProvinces.map(p => p.Provincia) : []
      const bankNames = Array.isArray(loadedBanks) ? loadedBanks.map(b => b.Banco) : []

      setData(prevData => ({
        ...prevData,
        credits: data.credits.length === 0 ? loadedCredits : prevData.credits,
        provinces: data.provinces.length === 0 ? provinceNames : prevData.provinces,
        banks: data.banks.length === 0 ? bankNames : prevData.banks,
        dolar: data.dolar === undefined ? dolar : prevData.dolar
      }))
    }

    fetchData()

    // Adding an empty dependency array ensures this effect only runs once on mount.
  }, [])

  useEffect(() => {
    if (!data.user || !Object.keys(data.user).length) return

    // Save the data to localStorage
    localStorage.setItem('userData', JSON.stringify(data.user))
  }, [data.user]) // Only re-run the effect if data changes

  return <DataContext.Provider value={{ data, setData }}>{children}</DataContext.Provider>
}

const HypotecarLayout = (props: LayoutProps) => {
  // ** Props
  const { settings, children, scrollToTop } = props

  // ** Vars
  const { contentWidth } = settings
  const navWidth = themeConfig.navigationSize

  // ** States
  const [navVisible, setNavVisible] = useState<boolean>(false)

  // ** Toggle Functions
  const toggleNavVisibility = () => setNavVisible(!navVisible)

  return (
    <>
      <VerticalLayoutWrapper className='layout-wrapper'>
        {/* Navigation Menu */}

        <DataProvider>
          <MainContentWrapper className='layout-content-wrapper'>
            {/* Content */}
            <ContentWrapper
              className='layout-page-content'
              sx={{
                ...(contentWidth === 'boxed' && {
                  mx: 'auto',
                  '@media (min-width:1440px)': { maxWidth: 1440, paddingLeft: '8em', paddingRight: '8em' },
                  '@media (min-width:1200px)': { maxWidth: '100%' }
                })
              }}
            >
              <Typography variant='h3' width='100%' sx={{ fontSize: '20px' }} style={{ textAlign: 'center' }}>
                <img src='/images/logo.png' width='20em' /> Mi Credito Hipotecario{' '}
                <img src='/images/logo.png' width='20em' />
              </Typography>
              <Typography
                variant='h6'
                width='100%'
                sx={{ fontSize: '15px' }}
                style={{ textAlign: 'center', opacity: 0.5 }}
              >
                Tu aliado para surfear la ola de creditos
              </Typography>
              <ProgressBar></ProgressBar>
              {children}
            </ContentWrapper>

            {/* Footer Component */}
            <Footer {...props} />

            {/* Portal for React Datepicker */}
            <DatePickerWrapper sx={{ zIndex: 11 }}>
              <Box id='react-datepicker-portal'></Box>
            </DatePickerWrapper>
          </MainContentWrapper>
        </DataProvider>
      </VerticalLayoutWrapper>

      {/* Scroll to top button */}
      {scrollToTop ? (
        scrollToTop(props)
      ) : (
        <ScrollToTop className='mui-fixed'>
          <Fab color='primary' size='small' aria-label='scroll back to top'>
            <ArrowUp />
          </Fab>
        </ScrollToTop>
      )}
    </>
  )
}

export default HypotecarLayout
