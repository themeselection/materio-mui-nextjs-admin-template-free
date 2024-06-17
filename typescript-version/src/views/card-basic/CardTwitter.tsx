// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'

const CardTwitter = () => {
  return (
    <Card className='bg-[#1d9bf0]'>
      <CardContent>
        <div className='flex items-center gap-2 mbe-4'>
          <i className='ri-twitter-fill text-3xl text-white' />
          <Typography variant='h5' className='text-white'>
            Twitter Card
          </Typography>
        </div>
        <Typography className='mbe-4 text-white'>
          Turns out semicolon-less style is easier and safer in TS because most gotcha edge cases are type invalid as
          well.
        </Typography>
        <div className='flex align-center justify-between flex-wrap gap-x-4 gap-y-2'>
          <div className='flex items-center gap-2.5'>
            <Avatar src='/images/avatars/6.png' />
            <Typography className='text-white'>Mary Vaughn</Typography>
          </div>
          <div className='flex items-center gap-1.5'>
            <i className='ri-thumb-up-fill text-xl text-white' />
            <Typography variant='body2' className='text-white'>
              1.6k
            </Typography>
            <i className='ri-share-line text-xl text-white' />
            <Typography variant='body2' className='text-white'>
              98
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CardTwitter
