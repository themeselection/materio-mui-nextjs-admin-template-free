// ** MUI Imports
import react, { ChangeEvent, useState } from 'react'
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
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { ArrowDownDropCircle, ArrowUpDropCircle } from 'mdi-material-ui'

import UserPortfolio from 'src/views/dashboard/UserPortfolio'
import ReccETF from 'src/views/dashboard/ReccETF'
// import RichTextInput from 'src/views/dashboard/RichTextInput'

const columns: GridColDef[] = [
  { field: 'from', headerName: 'From', width: 130 },
  { field: 'topic', headerName: 'Topic', width: 400, editable: true },
  { field: 'received', headerName: 'received', width: 180, editable: true }
]

const AccountSettings = () => {
  const [openNewCommu, togOpenNewCommu] = useState<any>(false)
  const [commu, setCommu] = useState<any>({ topic: '', sentBy: '', content: '' })
  const [rows, setRows] = useState<any>([
    {
      id: 0,
      from: Math.random() < 0.5 ? 'Yigit Sen' : 'Betty Lin',
      topic: Math.random() < 0.5 ? 'Touch Ups on Previous Meetings' : 'Meeting Summary',
      received: `${new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        .toISOString()
        .slice(0, 10)}`
    },
    {
      id: 1,
      from: Math.random() < 0.5 ? 'Yigit Sen' : 'Betty Lin',
      topic: Math.random() < 0.5 ? 'Touch Ups on Previous Meetings' : 'Meeting Summary',
      received: `${new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        .toISOString()
        .slice(0, 10)}`
    },
    {
      id: 2,
      from: Math.random() < 0.5 ? 'Yigit Sen' : 'Betty Lin',
      topic: Math.random() < 0.5 ? 'Touch Ups on Previous Meetings' : 'Meeting Summary',
      received: `${new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        .toISOString()
        .slice(0, 10)}`
    },
    {
      id: 3,
      from: Math.random() < 0.5 ? 'Yigit Sen' : 'Betty Lin',
      topic: Math.random() < 0.5 ? 'Touch Ups on Previous Meetings' : 'Meeting Summary',
      received: `${new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        .toISOString()
        .slice(0, 10)}`
    },
    {
      id: 4,
      from: Math.random() < 0.5 ? 'Yigit Sen' : 'Betty Lin',
      topic: Math.random() < 0.5 ? 'Touch Ups on Previous Meetings' : 'Meeting Summary',
      received: `${new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        .toISOString()
        .slice(0, 10)}`
    },
    {
      id: 5,
      from: Math.random() < 0.5 ? 'Yigit Sen' : 'Betty Lin',
      topic: Math.random() < 0.5 ? 'Touch Ups on Previous Meetings' : 'Meeting Summary',
      received: `${new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        .toISOString()
        .slice(0, 10)}`
    },
    {
      id: 6,
      from: Math.random() < 0.5 ? 'Yigit Sen' : 'Betty Lin',
      topic: Math.random() < 0.5 ? 'Touch Ups on Previous Meetings' : 'Meeting Summary',
      received: `${new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        .toISOString()
        .slice(0, 10)}`
    },
    {
      id: 7,
      from: Math.random() < 0.5 ? 'Yigit Sen' : 'Betty Lin',
      topic: Math.random() < 0.5 ? 'Touch Ups on Previous Meetings' : 'Meeting Summary',
      received: `${new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        .toISOString()
        .slice(0, 10)}`
    },
    {
      id: 8,
      from: Math.random() < 0.5 ? 'Yigit Sen' : 'Betty Lin',
      topic: Math.random() < 0.5 ? 'Touch Ups on Previous Meetings' : 'Meeting Summary',
      received: `${new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        .toISOString()
        .slice(0, 10)}`
    }
  ])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Card>
          {/* 2 Rows of Client Info */}
          <Card sx={{ mb: 4 }}>
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
            <Box sx={{ display: 'flex', flexDirection: 'row', ml: 4, mb: 4 }}>
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
            {/* New Conversation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 5, alignItem: 'center' }}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', ml: 4, color: '#0297DB', mt: 2 }}>
                Recent Communications
              </Typography>
              <Button
                onClick={() => togOpenNewCommu(!openNewCommu)}
                sx={{ mr: 4 }}
                variant='contained'
                size='small'
                // startIcon={<ArrowDownDropCircle />}
              >
                <Typography sx={{ fontSize: '0.875rem', color: 'white', mr: 3 }}>New Conversation </Typography>
                {openNewCommu ? <ArrowUpDropCircle /> : <ArrowDownDropCircle />}
              </Button>
            </Box>
            {openNewCommu && (
              <form
                noValidate
                autoComplete='off'
                onSubmit={e => {
                  e.preventDefault()
                  console.log(commu)
                  setRows([
                    ...rows,
                    {
                      id: rows.length,
                      from: commu.sentBy,
                      topic: commu.topic,
                      received: new Date().toISOString().slice(0, 10)
                    }
                  ])
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'row', mx: 6, my: 4, gap: 10 }}>
                  <TextField
                    label='Topic'
                    id='topic'
                    sx={{ flexGrow: 1 }}
                    value={commu?.topic}
                    onChange={e => setCommu({ ...commu, topic: e.target.value })}
                  />
                  <FormControl sx={{ mr: 10 }} id='sentBy'>
                    <InputLabel id='sentBy-label'>Sent by</InputLabel>
                    <Select
                      label='Sent By'
                      labelId='sentBy-label'
                      defaultValue=''
                      value={commu?.sentBy}
                      onChange={e => setCommu({ ...commu, sentBy: e.target.value })}
                    >
                      <MenuItem value=''>Select Sender</MenuItem>
                      <MenuItem value='Betty Lin'>Betty Lin</MenuItem>
                      <MenuItem value='Yigit Sen'>Yigit Sen</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', m: 6 }}>
                  <TextField
                    fullWidth
                    rows={10}
                    multiline
                    label='Main Content'
                    placeholder='Input your communication content here'
                    id='content'
                    value={commu?.content}
                    onChange={e => setCommu({ ...commu, content: e.target.value })}
                  />
                </Box>

                {/* Submit / Cancel */}
                <Box sx={{ display: 'flex', gap: 3, mb: 7, ml: 6 }}>
                  <Button size='large' variant='contained' type='submit'>
                    Submit
                  </Button>
                  <Button
                    size='large'
                    variant='outlined'
                    onClick={() => setCommu({ topic: '', sentBy: '', content: '' })}
                  >
                    Cancel
                  </Button>
                </Box>
              </form>
            )}
          </Card>

          {/* Communication Log */}
          <Card>
            <DataGrid rows={rows} columns={columns} checkboxSelection sx={{ mt: 4 }} />
          </Card>
        </Card>

        {/* Portfolio */}
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
