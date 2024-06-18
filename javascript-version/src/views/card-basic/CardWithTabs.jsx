'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

const CardWithTabs = () => {
  // ** State
  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Card>
      <TabContext value={value}>
        <TabList onChange={handleChange} aria-label='card navigation examples'>
          <Tab value='1' label='Item One' />
          <Tab value='2' label='Item Two' />
          <Tab value='3' label='Item Three' />
        </TabList>
        <CardContent>
          <TabPanel value='1'>
            <Typography variant='h5' className='mbe-2'>
              Header One
            </Typography>
            <Typography className='mbe-6'>
              Pudding tiramisu caramels. Gingerbread gummies danish chocolate bar toffee marzipan. Wafer wafer cake
              powder danish oat cake.
            </Typography>
            <Button variant='contained'>Button One</Button>
          </TabPanel>
          <TabPanel value='2'>
            <Typography variant='h5' className='mbe-2'>
              Header Two
            </Typography>
            <Typography className='mbe-6'>
              Dragée chupa chups soufflé cheesecake jelly tootsie roll cupcake marzipan. Carrot cake sweet roll gummi
              bears caramels jelly beans.
            </Typography>
            <Button variant='contained'>Button Two</Button>
          </TabPanel>
          <TabPanel value='3'>
            <Typography variant='h5' className='mbe-2'>
              Header Three
            </Typography>
            <Typography className='mbe-6'>
              Icing cake macaroon macaroon jelly chocolate bar. Chupa chups dessert dessert soufflé chocolate bar
              jujubes gummi bears lollipop.
            </Typography>
            <Button variant='contained'>Button Three</Button>
          </TabPanel>
        </CardContent>
      </TabContext>
    </Card>
  )
}

export default CardWithTabs
