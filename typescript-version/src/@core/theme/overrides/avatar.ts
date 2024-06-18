// MUI Imports
import type { Theme } from '@mui/material/styles'

const avatar: Theme['components'] = {
  MuiAvatarGroup: {
    styleOverrides: {
      root: ({ theme }) => ({
        justifyContent: 'flex-end',
        '& .MuiAvatar-root': {
          borderColor: 'var(--mui-palette-background-paper)'
        },
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
  },
  MuiAvatar: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: 'var(--mui-palette-text-primary)',
        fontSize: theme.typography.body1.fontSize,
        lineHeight: 1.2
      })
    }
  }
}

export default avatar
