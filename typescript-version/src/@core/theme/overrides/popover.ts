// MUI Imports
import type { Theme } from '@mui/material/styles'

// Type Imports
import type { Skin } from '@core/types'

const popover = (skin: Skin): Theme['components'] => ({
  MuiPopover: {
    styleOverrides: {
      paper: {
        ...(skin === 'bordered'
          ? { boxShadow: 'none', border: '1px solid var(--mui-palette-divider)' }
          : {
              boxShadow: 'var(--mui-customShadows-sm)'
            })
      }
    }
  }
})

export default popover
