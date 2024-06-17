// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'

const CardFacebook = () => {
  return (
    <Card className='bg-[#3b5998]'>
      <CardContent>
        <div className='flex items-center gap-2 mbe-4'>
          <i className='ri-facebook-fill text-3xl text-white' />
          <Typography variant='h5' className='text-white'>
            Facebook Card
          </Typography>
        </div>
        <Typography className='mbe-4 text-white'>
          You&#39;ve read about the importance of being courageous, rebellious and imaginative. These are all vital
          ingredients in an effective.
        </Typography>
        <div className='flex align-center justify-between flex-wrap gap-x-4 gap-y-2'>
          <div className='flex items-center gap-2.5'>
            <Avatar src='/images/avatars/1.png' />
            <Typography className='text-white'>Eugene Clarke</Typography>
          </div>
          <div className='flex items-center gap-1.5'>
            <i className='ri-thumb-up-fill text-xl text-white' />
            <Typography variant='body2' className='text-white'>
              2.5k
            </Typography>
            <i className='ri-share-line text-xl text-white' />
            <Typography variant='body2' className='text-white'>
              124
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CardFacebook
