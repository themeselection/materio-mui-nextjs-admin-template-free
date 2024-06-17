// MUI Imports
import type { Theme } from '@mui/material/styles'

const accordion = (): Theme['components'] => ({
  MuiAccordionSummary: {
    defaultProps: {
      expandIcon: <i className='ri-arrow-down-s-line' />
    }
  }
})

export default accordion
