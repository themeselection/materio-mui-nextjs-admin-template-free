// ** MUI Imports
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
import CardHeader from '@mui/material/CardHeader'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

interface RowType {
  col1: string
  col2: string
  col3: string
  col4: string
  col5: string
  col6: string
  col7: string
  col8: string
  col9: string
}

interface StatusObj {
  [key: string]: {
    color: ThemeColor
  }
}

const rows: RowType[] = [
  {
    col1: 'Securities',
    col2: 'Equities',
    col3: '52.26%',
    col4: 'FX',
    col5: '35.7%',
    col6: 'FI',
    col7: '8%',
    col8: 'Others',
    col9: '0.7%'
  },
  {
    col1: 'Location',
    col2: 'US',
    col3: '52.26%',
    col4: 'EU  ',
    col5: '35.7%',
    col6: 'EM',
    col7: '8%',
    col8: 'Others',
    col9: '0.7%'
  },
  {
    col1: 'Industries',
    col2: 'Tech',
    col3: '52.26%',
    col4: 'Consumers',
    col5: '35.7%',
    col6: 'Cash',
    col7: '8%',
    col8: 'Others',
    col9: '0.7%'
  }
]

const statusObj: StatusObj = {
  applied: { color: 'info' },
  rejected: { color: 'error' },
  current: { color: 'primary' },
  resigned: { color: 'warning' },
  professional: { color: 'success' }
}

const PortfolioTable = () => {
  return (
    <Card>
      <CardHeader
          title='Portfolio'
          sx={{ pt: 5.5, alignItems: 'center', '& .MuiCardHeader-action': { mt: 0.6 } }}
          action={<Typography variant='caption'>View All</Typography>}
          titleTypographyProps={{
            variant: 'h6',
            sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' }
          }}
        />
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableBody>
            {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600,color: '#0297DB' }}>{row.col1}</Typography>
                  </TableCell>
                  <TableCell align='left'><Typography sx={{ color: '#0297DB' }}>{row.col2}</Typography></TableCell>
                  <TableCell align='left'><Typography sx={{ color: 'black' }}>{row.col3}</Typography></TableCell>
                  <TableCell align='left'><Typography sx={{ color: '#0297DB' }}>{row.col4}</Typography></TableCell>
                  <TableCell align='left'><Typography sx={{ color: 'black' }}>{row.col5}</Typography></TableCell>
                  <TableCell align='left'><Typography sx={{ color: '#0297DB' }}>{row.col6}</Typography></TableCell>
                  <TableCell align='left'><Typography sx={{ color: 'black' }}>{row.col7}</Typography></TableCell>
                  <TableCell align='left'><Typography sx={{ color: '#0297DB' }}>{row.col8}</Typography></TableCell>
                  <TableCell align='left'><Typography sx={{ color: 'black' }}>{row.col9}</Typography></TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

export default PortfolioTable
