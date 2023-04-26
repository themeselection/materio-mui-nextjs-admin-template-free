// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Private Route
import PrivateRoute from 'src/pages/privateRoute';


// ** Custom Components Imports


// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// **  Components Imports
import Trophy from 'src/views/dashboard/Trophy'
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import WidgetUnico from 'src/views/Loyalty/Widgetunicoloyalty'
import CreaTessera from 'src/views/Loyalty/CreaTessera'
import Table from 'src/views/Loyalty/Table'



const Loyalty = () => {
  return (
    <PrivateRoute>
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <Trophy />
        </Grid>
        <Grid item xs={12} md={8}>
          <StatisticsCard />
        </Grid>
        <Grid  item xs={12} md={4} lg={8}  >
          <WidgetUnico />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <CreaTessera />
        </Grid>
        <Grid item xs={12} md={4} lg={12}>
          <Table />
        </Grid>
      </Grid>
    </ApexChartWrapper>
    </PrivateRoute>
  )
}

export default Loyalty
