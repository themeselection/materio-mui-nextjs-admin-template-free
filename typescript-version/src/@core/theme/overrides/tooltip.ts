// MUI Imports
import type { Theme } from '@mui/material/styles'

const tooltip: Theme['components'] = {
  MuiTooltip: {
    styleOverrides: {
      popper: {
        '&[data-popper-placement*="bottom"] .MuiTooltip-tooltip': {
          marginTop: '6px !important'
        },
        '&[data-popper-placement*="top"] .MuiTooltip-tooltip': {
          marginBottom: '6px !important'
        },
        '&[data-popper-placement*="left"] .MuiTooltip-tooltip': {
          marginRight: '6px !important'
        },
        '&[data-popper-placement*="right"] .MuiTooltip-tooltip': {
          marginLeft: '6px !important'
        }
      }
    }
  }
}

export default tooltip
