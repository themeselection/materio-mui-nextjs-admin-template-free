// Type Imports
import type { BreakpointType } from './types'

export const defaultBreakpoints: Record<BreakpointType, string> = {
  xs: '480px',
  sm: '600px',
  md: '900px',
  lg: '1200px',
  xl: '1536px',
  xxl: '1920px',
  always: 'always'
}

export const verticalNavToggleDuration = 300
export const verticalSubMenuToggleDuration = 300
