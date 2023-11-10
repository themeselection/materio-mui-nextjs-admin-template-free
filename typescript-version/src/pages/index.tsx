// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports
import Poll from 'mdi-material-ui/Poll'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table'
import Trophy from 'src/views/dashboard/Trophy'
import TotalEarning from 'src/views/dashboard/TotalEarning'
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import WeeklyOverview from 'src/views/dashboard/WeeklyOverview'
import DepositWithdraw from 'src/views/dashboard/DepositWithdraw'
import SalesByCountries from 'src/views/dashboard/SalesByCountries'

import React, { useState, ChangeEvent, KeyboardEvent } from 'react'

import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Magnify from 'mdi-material-ui/Magnify'
import ETFCard from 'src/views/dashboard/ETFCard'
import { Robot } from 'mdi-material-ui'

const Dashboard = () => {
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([]) // <-- set an empty array for the search results
  const [secondOrder, setSecondOrder] = useState(true)
  const [endpoint, setEndPoint] = useState(`http://127.0.0.1:8080/search_vector?request=`)

  // const endpoint = `http://http://127.0.0.1:8080/search_vector?request=`
  const handleSearch = async () => {
    if (searchText === '') {
      console.log('Search Text not updated')
      return
    }
    try {
      // Send the searchText to the API endpoint
      console.log('I have run')
      console.log(searchText)
      console.log(endpoint)
      
      
      const response = await fetch(endpoint+encodeURI(searchText), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Request-Method': 'GET'
        }
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      console.log(data)
      setSearchResults(data['results'])
    } catch (error) {
      // Handle any errors
      console.error(error)
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 100 },
    { field: 'ticker', headerName: 'Ticker', width: 10 },
    { field: 'weight', headerName: 'Weight', width: 10 },
    { field: 'YTD', headerName: 'YTD', width: 10 }
  ]

  const switchOrder = () => {
    setSecondOrder(!secondOrder)
    if (secondOrder) {
      setEndPoint(`http://127.0.0.1:8080/search_data?request=`);
    }
    else {
      setEndPoint(`http://127.0.0.1:8080/search_vector?request=`)
    }
  }

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={8}>
          <TextField
            value={searchText}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            size='small'
            sx={{ '& .MuiOutlinedInput-root': { width: '300%', borderRadius: 4, mr: 8, backgroundColor: 'white' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Magnify fontSize='small' onClick={handleSearch} />
                </InputAdornment>
              )
              ,
              endAdornment: (
                <InputAdornment position='end'>
                  <Robot fontSize='small' onClick={switchOrder} sx={{color:secondOrder ? "green":"red"}}/>
                </InputAdornment>
              )
            }}
          />
        </Grid>
        {/** based on the search results, we can render the results by generating a list of ETFCard components */}
        {searchResults.map((result: any) => (
          <Grid item xs={12} md={8} key={result.id}>
            <ETFCard
              name={result['ETF Name']}
              ticker={result['ETF Name']}
              stockRows={result['Shorter_Top']?.map((name: string, index: number) => ({
                id: `${result.id}-${index + 1}`,
                name: name,
                ticker: '',
                weight: ' ',
                YTD: ' '
              }))}
            />
          </Grid>
        ))}
      </Grid>
    </ApexChartWrapper>
  )
}

export default Dashboard
