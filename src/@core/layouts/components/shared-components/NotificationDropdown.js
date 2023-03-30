// ** React Imports
import { useState, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiMenu from '@mui/material/Menu'
import MuiAvatar from '@mui/material/Avatar'
import MuiMenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import BellOutline from 'mdi-material-ui/BellOutline'

// ** Third Party Components
import PerfectScrollbarComponent from 'react-perfect-scrollbar'

// ** Styled Menu component
const Menu = styled(MuiMenu)(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
    overflow: 'hidden',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0
  }
}))

// ** Styled MenuItem component
const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`
}))

const styles = {
  maxHeight: 349,
  '& .MuiMenuItem-root:last-of-type': {
    border: 0
  }
}

// ** Styled PerfectScrollbar component
const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  ...styles
})

// ** Styled Avatar component
const Avatar = styled(MuiAvatar)({
  width: '2.375rem',
  height: '2.375rem',
  fontSize: '1.125rem'
})

// ** Styled component for the title in MenuItems
const MenuItemTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  flex: '1 1 100%',
  overflow: 'hidden',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  marginBottom: theme.spacing(0.75)
}))

// ** Styled component for the subtitle in MenuItems
const MenuItemSubtitle = styled(Typography)({
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

const NotificationDropdown = () => {
  // ** States
  const [anchorEl, setAnchorEl] = useState(null)

  // ** Hook
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  const ScrollWrapper = ({ children }) => {
    if (hidden) {
      return <Box sx={{ ...styles, overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
    } else {
      return (
        <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
      )
    }
  }

  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        <BellOutline />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem disableRipple>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography sx={{ fontWeight: 600 }}>Notifications</Typography>
            <Chip
              size='small'
              label='8 New'
              color='primary'
              sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500, borderRadius: '10px' }}
            />
          </Box>
        </MenuItem>
        <ScrollWrapper>
          <MenuItem onClick={handleDropdownClose}>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
              <Avatar alt='Flora' src='/images/avatars/4.png' />
              <Box sx={{ mx: 4, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
                <MenuItemTitle>Congratulazioni Francesca! 🎉</MenuItemTitle>
                <MenuItemSubtitle variant='body2'>Hai vinto "miglior dipendente del mese"</MenuItemSubtitle>
              </Box>
              <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                Oggi
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleDropdownClose}>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ color: 'common.white', backgroundColor: 'primary.main' }}>VU</Avatar>
              <Box sx={{ mx: 4, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
                <MenuItemTitle>Nuovo cliente registrato.</MenuItemTitle>
                <MenuItemSubtitle variant='body2'>5 ore fa</MenuItemSubtitle>
              </Box>
              <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                Ieri
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleDropdownClose}>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
              <Avatar alt='message' src='/images/avatars/5.png' />
              <Box sx={{ mx: 4, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
                <MenuItemTitle>Hai ricevuto un messaggio 👋🏻</MenuItemTitle>
                <MenuItemSubtitle variant='body2'>Hai 10 messaggi non letti</MenuItemSubtitle>
              </Box>
              <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                11 Mar
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleDropdownClose}>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
              <img width={38} height={38} alt='paypal' src='/images/misc/paypal.png' />
              <Box sx={{ mx: 4, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
                <MenuItemTitle>Paypal</MenuItemTitle>
                <MenuItemSubtitle variant='body2'>Pagamento Ricevuto</MenuItemSubtitle>
              </Box>
              <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                25 Feb
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleDropdownClose}>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
              <Avatar alt='order' src='/images/avatars/3.png' />
              <Box sx={{ mx: 4, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
                <MenuItemTitle>Revisiona Ordine 📦</MenuItemTitle>
                <MenuItemSubtitle variant='body2'>Nuovo ordine revisionato da Daniele</MenuItemSubtitle>
              </Box>
              <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                19 Feb
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleDropdownClose}>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
              <img width={38} height={38} alt='chart' src='/images/misc/chart.png' />
              <Box sx={{ mx: 4, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
                <MenuItemTitle>Rapportino di costo generato</MenuItemTitle>
                <MenuItemSubtitle variant='body2'>25 ore fa</MenuItemSubtitle>
              </Box>
              <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                27 Gen
              </Typography>
            </Box>
          </MenuItem>
        </ScrollWrapper>
        <MenuItem
          disableRipple
          sx={{ py: 3.5, borderBottom: 0, borderTop: theme => `1px solid ${theme.palette.divider}` }}
        >
          <Button fullWidth variant='contained' onClick={handleDropdownClose}>
            Leggi tutte le Notifiche
          </Button>
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default NotificationDropdown
