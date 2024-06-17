// MUI Imports
import type { Theme } from '@mui/material/styles'

const autocomplete: Theme['components'] = {
  MuiAutocomplete: {
    defaultProps: {
      ChipProps: {
        size: 'small'
      }
    }
  }
}

export default autocomplete
