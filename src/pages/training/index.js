// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports


// ** Custom Components Imports


// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// **  Components Imports
import Trophy from 'src/views/training/Trophy'
import StatisticsCard from 'src/views/training/StatisticsCard'
import Badge1 from 'src/views/training/Badge1'
import Badge2 from 'src/views/training/Badge2'
import Badge3 from 'src/views/training/Badge3'
import Badge4 from 'src/views/training/Badge4'
import Badge5 from 'src/views/training/Badge5'
import Badge6 from 'src/views/training/Badge6'
import Badge7 from 'src/views/training/Badge7'
import Badge8 from 'src/views/training/Badge8'
import Badge9 from 'src/views/training/Badge9'



const training = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <Trophy />
        </Grid>
        <Grid item xs={12} md={8}>
          <StatisticsCard />
        </Grid>
        <Grid item xs={12} md={4}>
          <Badge1 />
        </Grid>
        <Grid item xs={12} md={4}>
          <Badge2 />
        </Grid>
        <Grid item xs={12} md={4}>
          <Badge3 />
        </Grid>
        <Grid item xs={12} md={4}>
          <Badge4 />
        </Grid>
        <Grid item xs={12} md={4}>
          <Badge5 />
        </Grid>
        <Grid item xs={12} md={4}>
          <Badge6 />
        </Grid>
        <Grid item xs={12} md={4}>
          <Badge7 />
        </Grid>
        <Grid item xs={12} md={4}>
          <Badge8 />
        </Grid>
        <Grid item xs={12} md={4}>
          <Badge9 />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default training
