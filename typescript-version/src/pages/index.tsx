// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports
import Poll from 'mdi-material-ui/Poll'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table'
import Trophy from 'src/views/dashboard/Trophy'
import TotalEarning from 'src/views/dashboard/TotalEarning'
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import WeeklyOverview from 'src/views/dashboard/WeeklyOverview'
import DepositWithdraw from 'src/views/dashboard/DepositWithdraw'
import SalesByCountries from 'src/views/dashboard/SalesByCountries'
import Card from 'src/@core/theme/overrides/card'
import FormLayoutsBasic from 'src/views/form-layouts/FormLayoutsBasic'
import RiskForm from 'src/views/form-layouts/custom/RiskForm'
import BaseForm from 'src/views/form-layouts/custom/BaseForm'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getActiveStep, stepLinks } from 'src/@core/layouts/components/vertical/navigation/ProgressBar'
import { useData } from 'src/@core/layouts/HipotecarLayout'
import { set } from 'nprogress'

const Dashboard = () => {
  const router = useRouter()
  const context = useData()
  const [redirected, setRedirected] = useState(false)

  useEffect(() => {
    if (redirected) return
    if (!context?.data.loaded) return

    const step = context?.data.user ? getActiveStep(context?.data.user) : 0
    const link = stepLinks[step]

    setRedirected(true)
    router.push(link)
  }, [context?.data.loaded])

  return null
}

export default Dashboard
