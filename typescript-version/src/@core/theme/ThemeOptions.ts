// ** MUI Theme Provider
import { deepmerge } from '@mui/utils'
import { ThemeOptions } from '@mui/material'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Theme Override Imports
import palette from './palette'
import spacing from './spacing'
import shadows from './shadows'
import breakpoints from './breakpoints'

const themeOptions = (settings: Settings): ThemeOptions => {
  // ** Vars
  const { mode, themeColor } = settings

  const themeConfig = {
    palette: palette(mode, themeColor),
    typography: {
      fontFamily: [
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
    },
    shadows: shadows(mode),
    ...spacing,
    breakpoints: breakpoints(),
    shape: {
      borderRadius: 6
    },
    mixins: {
      toolbar: {
        minHeight: 64
      }
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            ...(mode === 'light'
              ? {
                  scrollbarColor: '#d1d1d1',
                  '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                    width: 8,
                    height: 8

                    //backgroundColor: 'transparent'
                  },
                  '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                    borderRadius: 8,
                    backgroundColor: '#d1d1d1',
                    minHeight: 24
                  },
                  '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
                    backgroundColor: '#a7a7a7'
                  },
                  '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
                    backgroundColor: '#a7a7a7'
                  },
                  '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: '#a7a7a7'
                  },
                  '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
                    backgroundColor: 'transparent'
                  }
                }
              : {
                  scrollbarColor: '#d1d1d1',
                  '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                    width: 8,
                    height: 8
                  },
                  '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                    borderRadius: 8,
                    backgroundColor: '#d1d1d1',
                    minHeight: 24
                  },
                  '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
                    backgroundColor: '#a7a7a7'
                  },
                  '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
                    backgroundColor: '#a7a7a7'
                  },
                  '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: '#a7a7a7'
                  },
                  '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
                    backgroundColor: 'transparent'
                  }
                })
          }
        }
      }
    }
  }

  return deepmerge(themeConfig, {
    palette: {
      primary: {
        ...themeConfig.palette[themeColor]
      }
    }
  })
}

export default themeOptions
