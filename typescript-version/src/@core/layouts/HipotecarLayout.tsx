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
import { Bank, CreditType, Neighborhood } from 'src/configs/credits'

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
  budget?: number
  neighborhoods?: Neighborhood[]
  duration?: number
  creditType?: CreditType
  banks?: Bank[]
}

export type ContextType = {
  data: UserData
  setData: Dispatch<SetStateAction<{}>>
}
const DataContext = createContext<ContextType | null>(null)

export const useData = () => useContext(DataContext)

export const DataProvider = ({ children }: { children: any }) => {
  const [data, setData] = useState({})

  // Effect to load data from localStorage when the component mounts
  useEffect(() => {
    const savedData = localStorage.getItem('data')
    if (savedData) {
      setData(JSON.parse(savedData))
    }
  }, [])

  useEffect(() => {
    // Save the data to localStorage
    localStorage.setItem('data', JSON.stringify(data))
  }, [data]) // Only re-run the effect if data changes

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
                  '@media (min-width:1440px)': { maxWidth: 1440, padding: '10em' },
                  '@media (min-width:1200px)': { maxWidth: '100%' }
                })
              }}
            >
              <Typography variant="h3" width="100%" style={{textAlign: "center"}}><img src="/images/logo.png" width="40px" /> HipotecAR</Typography>
              <Typography variant="h6" width="100%" style={{textAlign: "center", opacity: 0.5}}>Tu aliado para surfear la ola de creditos</Typography>
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
