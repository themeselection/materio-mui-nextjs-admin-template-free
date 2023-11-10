// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'

// ** Custom Components Imports
import ETFPieChart from './ETFPieChart'

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 100},
  { field: 'ticker', headerName: 'Ticker', width: 10},
  { field: 'weight', headerName: 'Weight', width: 10},
  {field: 'YTD', headerName: 'YTD', width: 10},
]



const ETFCard = ({ name, ticker,size, client, contactPoint, salesIC, aum, since, series, stockRows}: { name: string; ticker: string,
  size:string, client:string, contactPoint:string, salesIC:string, aum:string,since:string,series:number[], stockRows:GridColDef[]}) => {

  if (size === undefined) {
    size = '0.7rem'
  }
  if( client===undefined){
    client='ABC Co. Ltd'
  }
  if(ticker===undefined){
    ticker='JPEF'
  }
  if(name===undefined){
    name='JPMorgan Equity Focus ETF'
  }
  if (contactPoint===undefined){
    contactPoint='John Lee'
  }
  if (salesIC===undefined){
    salesIC='A.Z.'
  }
  if (aum===undefined){
    aum='$100M'
  }
  if (since===undefined){
    since='1999'
  }

  if(stockRows===undefined){
    stockRows=[
      { id: 1, name: 'Apple', ticker: 'AAPL', weight: '5.00%', YTD: '1.00%' },
      { id: 2, name: 'Microsoft', ticker: 'MSFT', weight: '4.00%', YTD: '2.00%' },
      { id: 3, name: 'Amazon', ticker: 'AMZN', weight: '3.00%', YTD: '3.00%' },
      { id: 4, name: 'Facebook', ticker: 'FB', weight: '2.00%', YTD: '4.00%' },
      { id: 5, name: 'Alphabet', ticker: 'GOOG', weight: '1.00%', YTD: '5.00%' },
    ]
  }

  return (
    <Grid sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', ml: 4, mt: 4 }}>
        <Box sx={{ width: '30%', display: 'flex', flexDirection: 'row' }}>
          <Typography sx={{ fontWeight: 600, fontSize: size, color: '#0297DB', ml:2 }}>Client</Typography>
        </Box>
        <Box sx={{ width: '20%', display: 'flex', flexDirection: 'row', ml: 2 }}>
          <Typography sx={{ fontWeight: 600, fontSize: size, color: '#0297DB' }}>Contact Point</Typography>
        </Box>
        <Box sx={{ width: '20%', display: 'flex', flexDirection: 'row', ml: 2 }}>
          <Typography sx={{ fontWeight: 600, fontSize: size, color: '#0297DB' }}>Sales IC</Typography>
        </Box>
        <Box sx={{ width: '20%', display: 'flex', flexDirection: 'row', ml: 2 }}>
          <Typography sx={{ fontWeight: 600, fontSize: size, color: '#0297DB' }}>AUM</Typography>
        </Box>
        <Box sx={{ width: '20%', display: 'flex', flexDirection: 'row', ml: 2 }}>
          <Typography sx={{ fontWeight: 600, fontSize: size, color: '#0297DB' }}>Since</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', ml: 4 }}>
        <Box sx={{ width: '30%', display: 'flex', flexDirection: 'row' , ml:2, mt: 1}}>
          <Typography sx={{ fontWeight: 600, fontSize: size }}>{client}</Typography>
        </Box>
        <Box sx={{ width: '20%', display: 'flex', flexDirection: 'row', ml: 2, mt: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: size }}>{contactPoint}</Typography>
        </Box>
        <Box sx={{ width: '20%', display: 'flex', flexDirection: 'row', ml: 2, mt: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: size }}>{salesIC}</Typography>
        </Box>
        <Box sx={{ width: '20%', display: 'flex', flexDirection: 'row', ml: 2, mt: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: size }}>{aum}</Typography>
        </Box>
        <Box sx={{ width: '20%', display: 'flex', flexDirection: 'row', ml: 2, mt: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: size }}>{since}</Typography>
        </Box>
      </Box>
      <Grid container sx={{ mt: 4 }}>
        <Grid item xs={6}>
          <Typography sx={{ fontWeight: 600, fontSize: '1.2rem', ml: 4, color: '#0297DB' }}>{ticker}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', ml: 4, color: '#7098DB' }}>{name}</Typography>
        </Grid>
      </Grid>
      <Card>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card>
              <ETFPieChart series={series} />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <DataGrid rows={stockRows} columns={columns} pageSize={1} sx={{fontSize:'0.5rem'}} />
            </Card>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  )
}

export default ETFCard
