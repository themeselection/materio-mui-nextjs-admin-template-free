// MUI Imports
import Tooltip from '@mui/material/Tooltip'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'

// Third-party Imports
import classnames from 'classnames'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Style Imports
import styles from './styles.module.css'

const TooltipContent = () => {
  return (
    <Card>
      <a href='https://themeselection.com/item/materio-mui-nextjs-admin-template' target='_blank' className='flex'>
        <img
          src='https://cdn.jsdelivr.net/gh/themeselection/ts-assets/materio/materio-mui-nextjs-admin-template/banner/banner.png'
          alt='Upgrade to Pro'
          className='w-full'
        />
      </a>
      <CardHeader title={`${themeConfig.templateName} - MUI Next.js Admin Template`} />
      <CardContent>
        <Typography color='textSecondary' className='mbe-4'>
          {`${themeConfig.templateName} Admin is the most developer friendly & highly customizable Admin Dashboard Template based on MUI and Next.js.`}
        </Typography>
        <Typography color='textSecondary'>Click on below button to explore the PRO version.</Typography>
      </CardContent>
      <CardActions>
        <Button variant='contained' href={process.env.NEXT_PUBLIC_PRO_URL as string} target='_blank'>
          Demo
        </Button>
        <Button
          variant='outlined'
          href='https://themeselection.com/item/materio-mui-nextjs-admin-template'
          target='_blank'
          className='mis-4'
        >
          Download
        </Button>
      </CardActions>
    </Card>
  )
}

const UpgradeToProButton = () => {
  return (
    <div className={classnames(styles.wrapper, 'mui-fixed')}>
      <Tooltip
        title={<TooltipContent />}
        placement='top-end'
        slotProps={{ tooltip: { style: { padding: 0, backgroundColor: 'transparent', maxInlineSize: 400 } } }}
      >
        <a
          className={styles.button}
          role='button'
          href='https://themeselection.com/item/materio-mui-nextjs-admin-template'
          target='_blank'
        >
          Upgrade to Pro
          <span className={styles.buttonInner} />
        </a>
      </Tooltip>
    </div>
  )
}

export default UpgradeToProButton
