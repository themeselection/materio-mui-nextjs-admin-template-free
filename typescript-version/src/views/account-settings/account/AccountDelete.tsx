// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'

const AccountDelete = () => {
  return (
    <Card>
      <CardHeader title='Delete Account' />
      <CardContent className='flex flex-col items-start gap-6'>
        <FormControlLabel control={<Checkbox />} label='I confirm my account deactivation' />
        <Button variant='contained' color='error' type='submit'>
          Deactivate Account
        </Button>
      </CardContent>
    </Card>
  )
}

export default AccountDelete
