// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Rating from '@mui/material/Rating'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'

const CardVerticalRatings = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant='h5' className='mbe-2'>
          The Best Answers
        </Typography>
        <div className='flex flex-wrap gap-x-2 gap-y-1 mbe-2'>
          <Rating name='read-only' value={4} readOnly />
          <Typography>4 Star | 98 reviews</Typography>
        </div>
        <Typography color='text.secondary' className='mbe-4'>
          If you are looking for a new way to promote your business that won&#39;t cost you more money, maybe printing
          is one of the options you won&#39;t resist.
        </Typography>
        <Typography color='text.secondary'>
          Printing is a widely use process in making printed materials that are used for advertising. It become fast,
          easy and simple.
        </Typography>
      </CardContent>
      <CardActions className='card-actions-dense'>
        <Button>Location</Button>
        <Button>Review</Button>
      </CardActions>
    </Card>
  )
}

export default CardVerticalRatings
