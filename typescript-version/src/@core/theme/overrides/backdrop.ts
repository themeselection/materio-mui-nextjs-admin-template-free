// MUI Imports
import type { Theme } from '@mui/material/styles'

const backdrop: Theme['components'] = {
  MuiBackdrop: {
    styleOverrides: {
      root: {
        '&:not(.MuiBackdrop-invisible)': {
          backgroundColor: 'var(--backdrop-color)'
        }
      }
    }
  }
}

export default backdrop
