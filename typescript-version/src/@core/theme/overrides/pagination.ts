// MUI Imports
import type { Theme } from '@mui/material/styles'

const pagination: Theme['components'] = {
  MuiPagination: {
    styleOverrides: {
      ul: {
        rowGap: 6
      }
    },
    variants: [
      {
        props: { variant: 'text', color: 'primary' },
        style: {
          '& .MuiPaginationItem-root.Mui-selected.Mui-disabled': {
            backgroundColor: 'var(--mui-palette-primary-main)',
            color: 'var(--mui-palette-primary-contrastText)'
          }
        }
      },
      {
        props: { variant: 'text', color: 'secondary' },
        style: {
          '& .MuiPaginationItem-root.Mui-selected.Mui-disabled': {
            backgroundColor: 'var(--mui-palette-secondary-main)',
            color: 'var(--mui-palette-secondary-contrastText)'
          }
        }
      },
      {
        props: { variant: 'outlined', color: 'standard' },
        style: {
          '& .MuiPaginationItem-root.Mui-selected.Mui-disabled': {
            borderColor: 'var(--mui-palette-action-selected)'
          }
        }
      },
      {
        props: { variant: 'outlined', color: 'primary' },
        style: {
          '& .MuiPaginationItem-root.Mui-selected.Mui-disabled': {
            color: 'var(--mui-palette-primary-main)',
            backgroundColor: 'rgb(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-activatedOpacity))',
            borderColor: 'rgba(var(--mui-palette-primary-mainChannel) / 0.5)'
          }
        }
      },
      {
        props: { variant: 'outlined', color: 'secondary' },
        style: {
          '& .MuiPaginationItem-root.Mui-selected.Mui-disabled': {
            color: 'var(--mui-palette-secondary-main)',
            backgroundColor:
              'rgb(var(--mui-palette-secondary-mainChannel) / var(--mui-palette-action-activatedOpacity))',
            borderColor: 'rgba(var(--mui-palette-secondary-mainChannel) / 0.5)'
          }
        }
      },
      {
        props: { variant: 'tonal' },
        style: {
          '& .MuiPaginationItem-root:not(.MuiPaginationItem-ellipsis)': {
            backgroundColor: 'var(--mui-palette-action-selected)'
          }
        }
      },
      {
        props: { variant: 'tonal', color: 'standard' },
        style: {
          '& .MuiPaginationItem-root.Mui-selected': {
            backgroundColor: 'var(--mui-palette-primary-lightOpacity)',
            color: 'var(--mui-palette-primary-main)',
            '&:hover': {
              backgroundColor: 'var(--mui-palette-primary-mainOpacity)'
            }
          },
          '& .MuiPaginationItem-root:hover:not(.Mui-selected):not(.MuiPaginationItem-ellipsis)': {
            backgroundColor: 'var(--mui-palette-action-focus)'
          },
          '& .MuiPaginationItem-root.Mui-selected.Mui-disabled': {
            backgroundColor: 'var(--mui-palette-primary-lightOpacity)',
            color: 'var(--mui-palette-primary-main)'
          }
        }
      },
      {
        props: { variant: 'tonal', color: 'primary' },
        style: {
          '& .MuiPaginationItem-root.Mui-selected': {
            backgroundColor: 'var(--mui-palette-primary-main)',
            color: 'var(--mui-palette-primary-contrastText)',
            '&:not(.Mui-disabled)': {
              boxShadow: 'var(--mui-customShadows-xs)'
            },
            '&:hover': {
              backgroundColor: 'var(--mui-palette-primary-dark)'
            }
          },
          '& .MuiPaginationItem-root:hover:not(.Mui-selected):not(.MuiPaginationItem-ellipsis)': {
            backgroundColor: 'var(--mui-palette-primary-lightOpacity)',
            color: 'var(--mui-palette-primary-main)'
          },
          '& .MuiPaginationItem-root.Mui-selected.Mui-disabled': {
            backgroundColor: 'var(--mui-palette-primary-main)',
            color: 'var(--mui-palette-primary-contrastText)'
          }
        }
      },
      {
        props: { variant: 'tonal', color: 'secondary' },
        style: {
          '& .MuiPaginationItem-root.Mui-selected': {
            backgroundColor: 'var(--mui-palette-secondary-main)',
            color: 'var(--mui-palette-secondary-contrastText)',
            '&:not(.Mui-disabled)': {
              boxShadow: 'var(--mui-customShadows-xs)'
            },
            '&:hover': {
              backgroundColor: 'var(--mui-palette-secondary-dark)'
            }
          },
          '& .MuiPaginationItem-root:hover:not(.Mui-selected):not(.MuiPaginationItem-ellipsis)': {
            backgroundColor: 'var(--mui-palette-secondary-mainOpacity)',
            color: 'var(--mui-palette-secondary-main)'
          },
          '& .MuiPaginationItem-root.Mui-selected.Mui-disabled': {
            backgroundColor: 'var(--mui-palette-secondary-main)',
            color: 'var(--mui-palette-secondary-contrastText)'
          }
        }
      }
    ]
  },
  MuiPaginationItem: {
    styleOverrides: {
      root: ({ ownerState }) => ({
        ...(ownerState.size === 'medium' && {
          height: '2.375rem',
          minWidth: '2.375rem'
        }),
        ...(ownerState.shape !== 'rounded' && {
          borderRadius: '50px'
        }),
        '&.Mui-selected.Mui-disabled': {
          color: 'var(--mui-palette-text-primary)',
          opacity: 0.45
        },
        '&.Mui-disabled': {
          opacity: 0.45
        },
        ...(ownerState.shape === 'rounded' &&
          ownerState.size === 'small' && {
            borderRadius: 'var(--mui-shape-customBorderRadius-sm)'
          }),
        ...(ownerState.shape === 'rounded' &&
          ownerState.size === 'large' && {
            borderRadius: 'var(--mui-shape-customBorderRadius-lg)'
          })
      }),
      sizeSmall: {
        height: '2.125rem',
        minWidth: '2.125rem'
      },
      sizeLarge: {
        height: '2.625rem',
        minWidth: '2.625rem'
      }
    }
  }
}

export default pagination
