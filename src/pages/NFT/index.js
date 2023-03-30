// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports


// ** Custom Components Imports

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// **  Components Imports

import NFTImage from 'src/views/NFT/nft-image'
import NFTDescr from 'src/views/NFT/nft-namedesc'
import Twitter from 'src/views/NFT/CardTwitter'



const NFT = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4} lg={5}>
          <NFTImage />
        </Grid>
        <Grid  item xs={12} md={4} lg={6} > 
          <NFTDescr />
          <Twitter /> 
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default NFT
