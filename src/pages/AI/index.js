// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports


// ** Custom Components Imports

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// **  Components Imports

import AIChat from 'src/views/AI/ai-chatbot'



const AI = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4} lg={12}>
          <AIChat />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default AI
