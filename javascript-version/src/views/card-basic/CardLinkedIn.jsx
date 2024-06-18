// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'

const CardLinkedIn = () => {
  return (
    <Card className='bg-[#007bb6]'>
      <CardContent>
        <div className='flex items-center gap-2 mbe-4'>
          <i className='ri-linkedin-fill text-3xl text-white' />
          <Typography variant='h5' className='text-white'>
            LinkedIn Card
          </Typography>
        </div>
        <Typography className='mbe-4 text-white'>
          With the Internet spreading like wildfire and reaching every part of our daily life, more and more traffic is
          directed.
        </Typography>
        <div className='flex align-center justify-between flex-wrap gap-x-4 gap-y-2'>
          <div className='flex items-center gap-2.5'>
            <Avatar src='/images/avatars/8.png' />
            <Typography className='text-white'>Anne Burke</Typography>
          </div>
          <div className='flex items-center gap-1.5'>
            <i className='ri-thumb-up-fill text-xl text-white' />
            <Typography variant='body2' className='text-white'>
              1.2k
            </Typography>
            <i className='ri-share-line text-xl text-white' />
            <Typography variant='body2' className='text-white'>
              56
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CardLinkedIn
