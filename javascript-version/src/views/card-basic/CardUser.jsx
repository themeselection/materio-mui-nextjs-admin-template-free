// MUI Imports
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import AvatarGroup from '@mui/material/AvatarGroup'

const CardUser = () => {
  return (
    <Card>
      <CardMedia image='/images/cards/2.png' className='bs-[180px]' />
      <CardContent className='relative'>
        <Avatar
          src='/images/avatars/3.png'
          alt='Robert Meyer'
          className='is-[78px] bs-[78px] border-[5px] border-backgroundPaper absolute start-[11px] block-start-[-39px]'
        />
        <div className='flex justify-between items-center flex-wrap gap-x-4 gap-y-2 mbe-5 mbs-[30px]'>
          <div className='flex flex-col items-start'>
            <Typography variant='h5'>Robert Meyer</Typography>
            <Typography variant='body2'>London, UK</Typography>
          </div>
          <Button variant='contained'>Send Request</Button>
        </div>
        <div className='flex justify-between items-center flex-wrap gap-x-4 gap-y-2'>
          <Typography variant='subtitle2' color='text.disabled'>
            18 mutual friends
          </Typography>
          <AvatarGroup max={4}>
            <Avatar src='/images/avatars/1.png' />
            <Avatar src='/images/avatars/5.png' />
            <Avatar src='/images/avatars/4.png' />
            <Avatar src='/images/avatars/6.png' />
            <Avatar src='/images/avatars/7.png' />
            <Avatar src='/images/avatars/8.png' />
          </AvatarGroup>
        </div>
      </CardContent>
    </Card>
  )
}

export default CardUser
