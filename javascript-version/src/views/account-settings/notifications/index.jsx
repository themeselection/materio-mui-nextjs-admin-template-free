// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

// Component Imports
import Link from '@components/Link'
import Form from '@components/Form'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Vars
const tableData = [
  {
    app: true,
    email: true,
    browser: true,
    type: 'あなた向けの新着'
  },
  {
    app: true,
    email: true,
    browser: true,
    type: 'アカウントのアクティビティ'
  },
  {
    app: false,
    email: true,
    browser: true,
    type: '新しいブラウザでのサインイン'
  },
  {
    app: false,
    email: true,
    browser: false,
    type: '新しいデバイスがリンクされました'
  }
]

const Notifications = () => {
  return (
    <Card>
      <CardHeader
        title='最近のデバイス'
        subheader={
          <>
            通知を表示するにはブラウザの許可が必要です。
            <Link className='text-primary'> 許可をリクエスト</Link>
          </>
        }
      />
      <Form>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>種類</th>
                <th>メール</th>
                <th>ブラウザ</th>
                <th>アプリ</th>
              </tr>
            </thead>
            <tbody className='border-be'>
              {tableData.map((data, index) => (
                <tr key={index}>
                  <td>
                    <Typography color='text.primary'>{data.type}</Typography>
                  </td>
                  <td>
                    <Checkbox defaultChecked={data.email} />
                  </td>
                  <td>
                    <Checkbox defaultChecked={data.browser} />
                  </td>
                  <td>
                    <Checkbox defaultChecked={data.app} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CardContent>
          <Typography className='mbe-6 font-medium'>通知を送信するタイミング</Typography>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6} md={4}>
              <Select fullWidth defaultValue='online'>
                <MenuItem value='online'>オンラインのときのみ</MenuItem>
                <MenuItem value='anytime'>常に</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} className='flex gap-4 flex-wrap'>
              <Button variant='contained' type='submit'>
                変更を保存
              </Button>
              <Button variant='outlined' color='secondary' type='reset'>
                リセット
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Form>
    </Card>
  )
}

export default Notifications
