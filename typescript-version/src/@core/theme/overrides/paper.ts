// MUI Imports
import type { Theme } from '@mui/material/styles'

const paper: Theme['components'] = {
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none'
      }
    }
  }
}

export default paper
