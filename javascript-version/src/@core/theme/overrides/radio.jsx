// React Imports
import React from 'react'

const IconChecked = () => {
  return (
    <svg width='1em' height='1em' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M12 18.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Z'
        fill='var(--mui-palette-common-white)'
        stroke='currentColor'
        strokeWidth='5'
      />
    </svg>
  )
}

const UncheckedIcon = () => {
  return (
    <svg width='1em' height='1em' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z' stroke='var(--mui-palette-text-secondary)' strokeWidth='2' />
    </svg>
  )
}

const radio = {
  MuiRadio: {
    defaultProps: {
      icon: <UncheckedIcon />,
      checkedIcon: <IconChecked />
    },
    styleOverrides: {
      root: ({ theme, ownerState }) => ({
        ...(ownerState.size === 'small'
          ? {
              padding: theme.spacing(1),
              '& svg': {
                fontSize: '1.25rem'
              }
            }
          : {
              padding: theme.spacing(1.5),
              '& svg': {
                fontSize: '1.5rem'
              }
            }),
        '&.Mui-checked:not(.Mui-disabled) svg': {
          filter: 'drop-shadow(var(--mui-customShadows-xs))'
        },
        '&.Mui-disabled': {
          opacity: 0.45,
          '&:not(.Mui-checked)': {
            color: 'var(--mui-palette-text-secondary)'
          },
          '&.Mui-checked.MuiRadio-colorPrimary': {
            color: 'var(--mui-palette-primary-main)'
          },
          '&.Mui-checked.MuiRadio-colorSecondary': {
            color: 'var(--mui-palette-secondary-main)'
          },
          '&.Mui-checked.MuiRadio-colorError': {
            color: 'var(--mui-palette-error-main)'
          },
          '&.Mui-checked.MuiRadio-colorWarning': {
            color: 'var(--mui-palette-warning-main)'
          },
          '&.Mui-checked.MuiRadio-colorInfo': {
            color: 'var(--mui-palette-info-main)'
          },
          '&.Mui-checked.MuiRadio-colorSuccess': {
            color: 'var(--mui-palette-success-main)'
          }
        }
      })
    }
  }
}

export default radio
