// MUI Imports
import type { Theme } from '@mui/material'

// Type Imports
import type { Skin } from '@core/types'

const drawer = (skin: Skin): Theme['components'] => ({
  MuiDrawer: {
    defaultProps: {
      ...(skin === 'bordered' && {
        PaperProps: {
          elevation: 0
        }
      })
    },
    styleOverrides: {
      paper: {
        ...(skin !== 'bordered' && {
          boxShadow: 'var(--mui-customShadows-lg)'
        })
      }
    }
  }
})

export default drawer
