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

const rows = [
  {
    age: 27,
    status: 'attesa',
    date: '09/02/2022',
    name: 'Sally Quinn',
    salary: '$19586.23',
    email: '0x15f549w846r8496d846848',
    designation: 'Mario Rossi'
  },
  {
    age: 61,
    date: '09/12/2022',
    salary: '$23896.35',
    status: 'confermato',
    name: 'Margaret Bowers',
    email: '0x155asd4g165asd486153asd14',
    designation: 'Giorgio Rossi'
  },
  {
    age: 59,
    date: '10/01/2023',
    name: 'Minnie Roy',
    status: 'rifiutato',
    salary: '$18991.67',
    email: '0x546as54das64158s4da6',
    designation: 'Luca Rossi'
  },
  {
    age: 30,
    date: '06/02/2023',
    status: 'utilizzato',
    salary: '$19252.12',
    name: 'Ralph Leonard',
    email: '0x1564asd4685asd1148546adsas5',
    designation: 'Matteo Rossi'
  },
  {
    age: 66,
    status: 'bloccato',
    date: '03/01/2023',
    salary: '$13076.28',
    name: 'Fabrizio Rossi',
    designation: 'Operator',
    email: '0x2as46df658gas6d814fe68asd541gfh4nj'
  },
  {
    age: 33,
    date: '08/02/2023',
    salary: '$10909.52',
    name: 'Eugenio Rossi',
    status: 'confermato',
    email: '0x15as6d45g6as5d48a56sd186s',
    designation: 'Senior Cost Accountant'
  },
  {
    age: 61,
    status: 'attesa',
    date: '06/01/2023',
    salary: '$17803.80',
    name: 'Giacomo Rossi',
    designation: 'Geologist',
    email: '0x56as4dg68sad46ads14gh8dsa658dsa86'
  },
  {
    age: 22,
    date: '12/03/2023',
    salary: '$12336.17',
    name: 'Federica Rossi',
    status: 'confermato',
    designation: 'Cost Accountant',
    email: '0x1saf4656154g46asd5h4d5sa68asd48'
  }
]

const statusObj = {
  bloccato: { color: 'info' },
  rifiutato: { color: 'error' },
  utilizzato: { color: 'primary' },
  attesa: { color: 'warning' },
  confermato: { color: 'success' }
}

const DashboardTable = () => {
  return (
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>ID Wallet</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Valore Token</TableCell>
              <TableCell>Numero Token</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow hover key={row.name} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{row.name}</Typography>
                    <Typography variant='caption'>{row.designation}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.salary}</TableCell>
                <TableCell>{row.age}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    color={statusObj[row.status].color}
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                      '& .MuiChip-label': { fontWeight: 500 }
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

export default DashboardTable
