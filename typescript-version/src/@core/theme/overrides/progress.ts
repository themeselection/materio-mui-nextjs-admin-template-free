// MUI Imports
import type { Theme } from '@mui/material/styles'

const progress: Theme['components'] = {
  MuiLinearProgress: {
    styleOverrides: {
      root: ({ theme }) => ({
        height: 6,
        borderRadius: theme.shape.borderRadius,
        '& .MuiLinearProgress-bar': {
          borderRadius: theme.shape.borderRadius
        }
      })
    }
  }
}

export default progress
