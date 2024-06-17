// MUI Imports
import type { Theme } from '@mui/material/styles'

const avatar: Theme['components'] = {
  MuiAvatarGroup: {
    styleOverrides: {
      root: ({ theme }) => ({
        justifyContent: 'flex-end',
        '&.pull-up .MuiAvatar-root': {
          cursor: 'pointer',
          transition: theme.transitions.create(['box-shadow', 'transform'], {
            easing: 'ease',
            duration: theme.transitions.duration.shorter
          }),
          '&:hover': {
            zIndex: 2,
            boxShadow: 'var(--mui-customShadows-md)',
            transform: 'translateY(-5px)'
          }
        }
      })
    }
  }
}

export default avatar
