// MUI Imports
import type { Theme } from '@mui/material/styles'

const timeline: Theme['components'] = {
  MuiTimelineConnector: {
    styleOverrides: {
      root: {
        width: 1
      }
    }
  },
  MuiTimelineContent: {
    styleOverrides: {
      root: {
        paddingBottom: '1rem'
      }
    }
  }
}

export default timeline
