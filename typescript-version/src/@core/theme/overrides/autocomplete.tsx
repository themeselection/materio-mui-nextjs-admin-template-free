// React Imports
import React from 'react'

// MUI Imports
import type { Theme } from '@mui/material/styles'

// Type Imports
import type { Skin } from '@core/types'

const autocomplete = (skin: Skin): Theme['components'] => ({
  MuiAutocomplete: {
    defaultProps: {
      ...(skin === 'bordered' && {
        slotProps: {
          paper: {
            variant: 'outlined'
          }
        }
      }),
      ChipProps: {
        size: 'small'
      },
      popupIcon: <i className='ri-arrow-down-s-line' />
    },
    styleOverrides: {
      root: {
        '& .MuiButtonBase-root.Mui-disabled i, & .MuiButtonBase-root.Mui-disabled svg': {
          color: 'var(--mui-palette-action-disabled)'
        },
        '& .MuiOutlinedInput-input': {
          height: '1.4375em'
        }
      },
      input: {
        '& + .MuiAutocomplete-endAdornment': {
          right: '1rem',
          '& i, & svg': {
            fontSize: '1.5rem',
            color: 'var(--mui-palette-text-primary)'
          },
          '& .MuiAutocomplete-clearIndicator': {
            padding: 2
          }
        },
        '&.MuiInputBase-inputSizeSmall + .MuiAutocomplete-endAdornment': {
          '& i, & svg': {
            fontSize: '1.375rem'
          }
        }
      },
      paper: {
        ...(skin !== 'bordered' && {
          boxShadow: 'var(--mui-customShadows-lg)',
          marginBlockStart: '0.125rem'
        })
      },
      listbox: ({ theme }) => ({
        '& .MuiAutocomplete-option': {
          padding: theme.spacing(2, 5),
          '&[aria-selected="true"]': {
            backgroundColor: 'var(--mui-palette-primary-lightOpacity)',
            color: 'var(--mui-palette-primary-main)',
            '&.Mui-focused, &.Mui-focusVisible': {
              backgroundColor: 'var(--mui-palette-primary-mainOpacity)'
            }
          }
        },
        '& .MuiAutocomplete-option.Mui-focusVisible': {
          backgroundColor: 'var(--mui-palette-action-hover)'
        }
      })
    }
  }
})

export default autocomplete
