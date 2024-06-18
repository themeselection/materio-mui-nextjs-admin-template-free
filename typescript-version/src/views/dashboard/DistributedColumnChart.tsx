'use client'

// Next Imports
import dynamic from 'next/dynamic'

//MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import type { ApexOptions } from 'apexcharts'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

// Vars
const series = [
  {
    name: '2022',
    data: [45, 85, 65, 50, 70]
  }
]

const DistributedColumnChart = () => {
  // Hooks
  const theme = useTheme()

  // Vars
  const primaryColor = 'var(--mui-palette-primary-main)'
  const errorColor = 'var(--mui-palette-error-main)'
  const trackBgColor = 'var(--mui-palette-customColors-trackBg)'

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      stacked: false,
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    tooltip: {
      x: { show: false }
    },
    grid: {
      show: false,
      padding: {
        top: -10,
        left: -3,
        right: -2,
        bottom: 5
      }
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    colors: [errorColor, primaryColor, errorColor, primaryColor, primaryColor],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '24%',
        borderRadius: 4,
        borderRadiusApplication: 'around',
        borderRadiusWhenStacked: 'all',
        distributed: true,
        colors: {
          backgroundBarRadius: 5,
          backgroundBarColors: [trackBgColor, trackBgColor, trackBgColor, trackBgColor, trackBgColor]
        }
      }
    },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: { show: false },
    responsive: [
      {
        breakpoint: 900,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '18%'
            }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '12%'
            }
          }
        }
      }
    ]
  }

  return (
    <Card>
      <CardContent>
        <Typography variant='h4'>2,856</Typography>
        <AppReactApexCharts type='bar' height={88} width='100%' options={options} series={series} />
        <Typography color='text.primary' className='font-medium text-center'>
          Sessions
        </Typography>
      </CardContent>
    </Card>
  )
}

export default DistributedColumnChart
