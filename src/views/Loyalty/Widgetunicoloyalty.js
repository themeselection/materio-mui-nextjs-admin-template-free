// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Button from '@mui/material/Button'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import VisualizzaSaldo from 'src/views/Loyalty/Saldo'
import AggiungiPunti from 'src/views/Loyalty/AggiungiPunti'
import RimuoviPunti from 'src/views/Loyalty/RimuoviPunti'

const Widgetunicoloyalty = () => {
  // ** State
  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Card>
      <TabContext value={value}>
        <TabList centered onChange={handleChange} aria-label='card navigation example'>
          <Tab value='1' label='Visualizza Saldo' />
          <Tab value='2' label='Aggiungi Punti' />
          <Tab value='3' label='Rimuovi Punti' />
        </TabList>
        <CardContent sx={{ textAlign: 'center' }}>
          <TabPanel value='1' sx={{ p: 0 }}>           
              <VisualizzaSaldo />
          </TabPanel>
          <TabPanel value='2' sx={{ p: 0 }}>
            <AggiungiPunti />
          </TabPanel>
          <TabPanel value='3' sx={{ p: 0 }}>
            <RimuoviPunti />
          </TabPanel>
        </CardContent>
      </TabContext>
    </Card>
  )
}

export default Widgetunicoloyalty
