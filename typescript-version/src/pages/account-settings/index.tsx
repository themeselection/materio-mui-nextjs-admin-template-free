// ** MUI Imports
import react, { useState } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import CardHeader from '@mui/material/CardHeader'
import Fab from '@mui/material/Fab'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { DotsVertical, ArrowDownDropCircle } from 'mdi-material-ui'

import UserPortfolio from 'src/views/dashboard/UserPortfolio'
import ReccETF from 'src/views/dashboard/ReccETF'

const columns: GridColDef[] = [
  { field: 'from', headerName: 'From', width: 130 },
  { field: 'subject', headerName: 'Subject', width: 400, editable: true },
  { field: 'Received', headerName: 'Received', width: 180, editable: true }
]
const rows = [
  {
    id: 0,
    from: Math.random() < 0.5 ? 'Yigit Sen' : 'Betty Lin',
    subject: Math.random() < 0.5 ? 'Touch Ups on Previous Meetings' : 'Meeting Summary',
    Received: `${new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      .toISOString()
      .slice(0, 10)}`
  },
  {
    id: 1,
    from: Math.random() < 0.5 ? 'Yigit Sen' : 'Betty Lin',
    subject: Math.random() < 0.5 ? 'Touch Ups on Previous Meetings' : 'Meeting Summary',
    Received: `${new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      .toISOString()
      .slice(0, 10)}`
  },
  {
    id: 2,
    from: Math.random() < 0.5 ? 'Yigit Sen' : 'Betty Lin',
    subject: Math.random() < 0.5 ? 'Touch Ups on Previous Meetings' : 'Meeting Summary',
    Received: `${new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      .toISOString()
      .slice(0, 10)}`
  },
  {
    id: 3,
    from: Math.random() < 0.5 ? 'Yigit Sen' : 'Betty Lin',
    subject: Math.random() < 0.5 ? 'Touch Ups on Previous Meetings' : 'Meeting Summary',
    Received: `${new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      .toISOString()
      .slice(0, 10)}`
  },
  {
    id: 4,
    from: Math.random() < 0.5 ? 'Yigit Sen' : 'Betty Lin',
    subject: Math.random() < 0.5 ? 'Touch Ups on Previous Meetings' : 'Meeting Summary',
    Received: `${new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      .toISOString()
      .slice(0, 10)}`
  },
  {
    id: 5,
    from: Math.random() < 0.5 ? 'Yigit Sen' : 'Betty Lin',
    subject: Math.random() < 0.5 ? 'Touch Ups on Previous Meetings' : 'Meeting Summary',
    Received: `${new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      .toISOString()
      .slice(0, 10)}`
  },
  {
    id: 6,
    from: Math.random() < 0.5 ? 'Yigit Sen' : 'Betty Lin',
    subject: Math.random() < 0.5 ? 'Touch Ups on Previous Meetings' : 'Meeting Summary',
    Received: `${new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      .toISOString()
      .slice(0, 10)}`
  },
  {
    id: 7,
    from: Math.random() < 0.5 ? 'Yigit Sen' : 'Betty Lin',
    subject: Math.random() < 0.5 ? 'Touch Ups on Previous Meetings' : 'Meeting Summary',
    Received: `${new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      .toISOString()
      .slice(0, 10)}`
  },
  {
    id: 8,
    from: Math.random() < 0.5 ? 'Yigit Sen' : 'Betty Lin',
    subject: Math.random() < 0.5 ? 'Touch Ups on Previous Meetings' : 'Meeting Summary',
    Received: `${new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      .toISOString()
      .slice(0, 10)}`
  }
]

const AccountSettings = () => {
  type Bool = typeof Boolean
  const [openNewCommu, togOpenNewCommu] = useState<Bool>(false)

  const handleClick = () => togOpenNewCommu(!openNewCommu)
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Card>
          {/* 2 Rows of Client Info */}
          <Card>
            {/* Client info Row 1 */}
            <Box sx={{ display: 'flex', flexDirection: 'row', ml: 4, mt: 4 }}>
              <Box sx={{ width: '30%', display: 'flex', flexDirection: 'row' }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#0297DB' }}>Client</Typography>
              </Box>
              <Box sx={{ width: '20%', display: 'flex', flexDirection: 'row', ml: 2 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#0297DB' }}>Contact Point</Typography>
              </Box>
              <Box sx={{ width: '20%', display: 'flex', flexDirection: 'row', ml: 2 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#0297DB' }}>Sales IC</Typography>
              </Box>
              <Box sx={{ width: '20%', display: 'flex', flexDirection: 'row', ml: 2 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#0297DB' }}>AUM</Typography>
              </Box>
              <Box sx={{ width: '20%', display: 'flex', flexDirection: 'row', ml: 2 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#0297DB' }}>Since</Typography>
              </Box>
            </Box>

            {/* Client info Row 2 */}
            <Box sx={{ display: 'flex', flexDirection: 'row', ml: 4 }}>
              <Box sx={{ width: '30%', display: 'flex', flexDirection: 'row' }}>
                <Typography sx={{ fontWeight: 600, fontSize: '1.5rem' }}>ABC Co. Ltd</Typography>
              </Box>
              <Box sx={{ width: '20%', display: 'flex', flexDirection: 'row', ml: 2, mt: 2 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>John Lee</Typography>
              </Box>
              <Box sx={{ width: '20%', display: 'flex', flexDirection: 'row', ml: 2, mt: 2 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>A.Z.</Typography>
              </Box>
              <Box sx={{ width: '20%', display: 'flex', flexDirection: 'row', ml: 2, mt: 2 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>$100M</Typography>
              </Box>
              <Box sx={{ width: '20%', display: 'flex', flexDirection: 'row', ml: 2, mt: 2 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>1999</Typography>
              </Box>
            </Box>
          </Card>

          <Card sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', ml: 4, color: '#0297DB', mt: 2 }}>
              Recent Communications
            </Typography>
            <Button onClick={() => handleClick()}>
              <Typography sx={{ fontSize: '0.875rem', color: 'white' }}>New Conversation</Typography>
              <ArrowDownDropCircle />
            </Button>
          </Card>
          <Card>
            <DataGrid rows={rows} columns={columns} checkboxSelection sx={{ mt: 4 }} />
          </Card>
        </Card>
        <h1></h1>
        <Grid item xs={12} md={12} lg={12}>
          <UserPortfolio />
        </Grid>
      </Grid>
      {/* Right side pie charts*/}
      <Grid item xs={12} md={4}>
        <ReccETF />
      </Grid>
    </Grid>
  )
}

export default AccountSettings
