// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

const CardSupport = () => {
  return (
    <Card>
      <CardContent className='flex flex-col items-center text-center'>
        <Avatar className='mbe-2 is-[56px] bs-[56px]'>
          <i className='ri-question-line text-[32px]' />
        </Avatar>
        <Typography variant='h5' className='mbe-2'>
          Support
        </Typography>
        <Typography className='mbe-4'>
          According to us blisters are a very common thing and we come across them very often in our daily lives. It is
          a very common occurrence like cold or fever depending upon your lifestyle.
        </Typography>
        <Button variant='contained'>Contact Now</Button>
      </CardContent>
    </Card>
  )
}

export default CardSupport
