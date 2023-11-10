// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import MuiDivider, { DividerProps } from '@mui/material/Divider'

//Table component
import PortfolioTable from './PortfolioTable'

interface DataType {
  title: string
  amount: string
  subtitle: string
  currentVal: string
}

const depositData = [
  
  {
    amount: '+0.44',
    title: 'Equity Income Premium ETF',
    subtitle: 'JEPI',
    currentVal:'$99M'
  },
  {
    amount: '+$0.68',
    title: 'Global Security Equity',
    subtitle: 'JGLO',
    currentVal:'$1M'
  }
]



const UserPortfolio = () => {
  return (
    <Card>
    <Grid>
    <PortfolioTable/>
    <h1></h1>
    <Card sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: ['column', 'column', 'row'] }}>
      <Box sx={{ width: '100%' }}>
        <CardHeader
          title='ETF Holdings'
          sx={{ pt: 5.5, alignItems: 'center', '& .MuiCardHeader-action': { mt: 0.6 } }}
          action={<Typography variant='caption'>View All</Typography>}
          titleTypographyProps={{
            variant: 'h6',
            sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' }
          }}
        />
        <CardContent sx={{ pb: theme => `${theme.spacing(5.5)} !important` }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 6
            }}
          >
            <Box
              sx={{
                ml: 4,
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ width: '20%', display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Ticker</Typography>
              </Box>
              <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>ETF</Typography>
              </Box>
              <Box sx={{ width: '20%', display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Current Value</Typography>
              </Box>
              <Typography variant='subtitle2' sx={{ width: '20%', textAlign: 'right' }}>
                % Change
              </Typography>
            </Box>
          </Box>
          {depositData.map((item: DataType, index: number) => {
            return (
              <Box
                key={item.title}
                sx={{ display: 'flex', alignItems: 'center', mb: index !== depositData.length - 1 ? 6 : 0 }}
              >
                <Box
                  sx={{
                    ml: 4,
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  
                  <Box sx={{ width: '20%', display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.subtitle}</Typography>
                  </Box>
                  <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color:'#0297DB'}}>{item.title}</Typography>
                  </Box>
                  <Box sx={{ width: '20%', display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontSize: '0.875rem' }}>{item.currentVal}</Typography>
                  </Box>
                  <Typography variant='subtitle2' sx={{ fontWeight: 600, color: 'success.main', width: '20%', textAlign: 'right' }}>
                    {item.amount}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </CardContent>
      </Box>
    </Card>
    </Grid>
    </Card>
  )
}

export default UserPortfolio
