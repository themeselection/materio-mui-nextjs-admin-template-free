// MUI Imports
import type { Theme } from '@mui/material/styles'

const tabs: Theme['components'] = {
  MuiTabs: {
    styleOverrides: {
      root: ({ theme, ownerState }) => ({
        '& ~ .MuiTabPanel-root': {
          ...(ownerState.orientation === 'horizontal'
            ? {
                paddingBlockStart: theme.spacing(6)
              }
            : {
                paddingInlineStart: theme.spacing(6)
              })
        }
      }),
      vertical: {
        minWidth: 130,
        '& .MuiTab-root': {
          minWidth: 130
        }
      }
    }
  },
  MuiTabPanel: {
    styleOverrides: {
      root: {
        padding: 0
      }
    }
  }
}

export default tabs
