'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import DisplaySettings from './display'

const AccountSettings = ({ tabContentList }) => {
  // States
  const [activeTab, setActiveTab] = useState('account')

  const handleChange = (event, value) => {
    setActiveTab(value)
  }

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TabList onChange={handleChange} variant='scrollable'>
            <Tab label='アカウント' icon={<i className='ri-user-3-line' />} iconPosition='start' value='account' />
            <Tab label='表示設定' icon={<i className='ri-eye-line' />} iconPosition='start' value='display' />
            <Tab
              label='通知'
              icon={<i className='ri-notification-3-line' />}
              iconPosition='start'
              value='notifications'
              disabled
            />
            <Tab label='連携' icon={<i className='ri-link' />} iconPosition='start' value='connections' disabled />
          </TabList>
          <Typography variant='body2' color='text.secondary' sx={{ mt: 2 }}>
            「通知」「連携」タブは現在未実装のため、利用できません。
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TabPanel value={activeTab} className='p-0'>
            {activeTab === 'display' ? <DisplaySettings /> : tabContentList[activeTab]}
          </TabPanel>
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default AccountSettings
