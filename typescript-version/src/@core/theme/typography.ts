// MUI Imports
import type { Theme } from '@mui/material/styles'

const typography = (fontFamily: string): Theme['typography'] =>
  ({
    fontFamily:
      typeof fontFamily === 'undefined' || fontFamily === ''
        ? [
            'Inter',
            'sans-serif',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"'
          ].join(',')
        : fontFamily,
    fontSize: 13.125,
    h1: {
      fontSize: '2.875rem',
      fontWeight: 500,
      lineHeight: 1.478261
    },
    h2: {
      fontSize: '2.375rem',
      fontWeight: 500,
      lineHeight: 1.47368421
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.5
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.58334
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.5556
    },
    h6: {
      fontSize: '0.9375rem',
      fontWeight: 500,
      lineHeight: 1.46667
    },
    subtitle1: {
      fontSize: '0.9375rem',
      lineHeight: 1.46667
    },
    subtitle2: {
      fontSize: '0.8125rem',
      fontWeight: 400,
      lineHeight: 1.53846154
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.46667
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.53846154
    },
    button: {
      fontSize: '0.9375rem',
      lineHeight: 1.46667,
      textTransform: 'none'
    },
    caption: {
      fontSize: '0.8125rem',
      lineHeight: 1.38462,
      letterSpacing: '0.4px'
    },
    overline: {
      fontSize: '0.75rem',
      lineHeight: 1.16667,
      letterSpacing: '0.8px'
    }
  }) as Theme['typography']

export default typography
