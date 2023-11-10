// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

// ** Custom Components Imports
import ETFPieChart from './ETFPieChart'
import { Typography } from '@mui/material'
import ETFCard from './ETFCard'

const ReccETF = () => {
  return (
    <Card>
      <Typography sx={{ fontWeight: 600, fontSize: '1.2rem' , ml:4, mt:4, color:'#0297DB'}}> Consider Recommending</Typography>
      <ETFCard ticker="JPEF" name="JPMorgan Equity Focus ETF"  />
      <ETFCard ticker="JPMB" name ="USD Emerging Market Sovereign Bond" />
    </Card>
  )
}

export default ReccETF
