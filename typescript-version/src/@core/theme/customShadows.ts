// MUI Imports
import type { Theme } from '@mui/material/styles'

// Type Imports
import type { SystemMode } from '@core/types'

const customShadows = (mode: SystemMode): Theme['customShadows'] => {
  return {
    xs: `0px 2px 4px rgb(var(--mui-mainColorChannels-${mode}Shadow) / ${mode === 'light' ? 0.16 : 0.2})`,
    sm: `0px 3px 6px rgb(var(--mui-mainColorChannels-${mode}Shadow) / ${mode === 'light' ? 0.18 : 0.22})`,
    md: `0px 4px 10px rgb(var(--mui-mainColorChannels-${mode}Shadow) / ${mode === 'light' ? 0.2 : 0.24})`,
    lg: `0px 6px 16px rgb(var(--mui-mainColorChannels-${mode}Shadow) / ${mode === 'light' ? 0.22 : 0.26})`,
    xl: `0px 8px 28px rgb(var(--mui-mainColorChannels-${mode}Shadow) / ${mode === 'light' ? 0.24 : 0.28})`
  }
}

export default customShadows
