// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'

const CardInfluencingInfluencer = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant='h5' className='mbe-2'>
          Influencing Influencer
        </Typography>
        <Typography className='mbe-4' color='text.secondary'>
          Computers have become ubiquitous in almost every facet of our lives. At work, desk jockeys spend hours in
          front of their desktops, while delivery people scan bar codes with handhelds and workers in the field stay in
          touch.
        </Typography>
        <Typography color='text.secondary'>
          If you&#39;re in the market for new desktops, notebooks, or PDAs, there are a myriad of choices. Here&#39;s a
          rundown of some of the best systems available.
        </Typography>
      </CardContent>
      <CardActions className='card-actions-dense'>
        <Button>Read More</Button>
      </CardActions>
    </Card>
  )
}

export default CardInfluencingInfluencer
