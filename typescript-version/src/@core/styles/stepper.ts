// MUI imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'

const StepperWrapper = styled(Box)<BoxProps>(({ theme }) => {
  return {
    [theme.breakpoints.down('md')]: {
      '& .MuiStepper-horizontal:not(.MuiStepper-alternativeLabel)': {
        flexDirection: 'column',
        alignItems: 'flex-start'
      }
    },
    '& .MuiStep-root': {
      '& .MuiStepLabel-iconContainer:empty': {
        display: 'none'
      },
      '& .step-label': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      '& .step-number': {
        ...theme.typography.h4,
        marginRight: theme.spacing(2)
      },
      '&:not(:has(.step-subtitle)) .step-number': {
        ...theme.typography.h6
      },
      '& .step-title': {
        ...theme.typography.body1,
        letterSpacing: 0.15,
        fontWeight: 500
      },
      '& .step-subtitle': {
        ...theme.typography.body2,
        color: 'var(--mui-palette-text-secondary)'
      },
      '& .MuiStepLabel-root.Mui-disabled': {
        '& .step-number': {
          color: 'var(--mui-palette-text-disabled)'
        }
      },
      '& .Mui-error': {
        '& .MuiStepLabel-labelContainer, & .step-number, & .step-title, & .step-subtitle': {
          color: 'var(--mui-palette-error-main)'
        }
      }
    },
    '& .MuiStepConnector-root': {
      '& .MuiStepConnector-line': {
        borderBlockStartWidth: 3,
        borderRadius: 3
      },
      '&.Mui-active, &.Mui-completed': {
        '& .MuiStepConnector-line': {
          borderColor: 'var(--mui-palette-primary-main)'
        }
      },
      '&.Mui-disabled .MuiStepConnector-line': {
        borderColor: 'var(--mui-palette-primary-lightOpacity)'
      }
    },
    '& .MuiStepper-alternativeLabel': {
      '& .MuiStepConnector-root': {
        top: 9
      },
      '& .MuiStepLabel-labelContainer': {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
      }
    },
    '& .MuiStepper-vertical': {
      '& .MuiStep-root': {
        '& .step-label': {
          justifyContent: 'flex-start'
        },
        '& .MuiStepContent-root': {
          borderInlineStartWidth: 3,
          marginLeft: theme.spacing(2.25),
          borderColor: 'var(--mui-palette-primary-main)'
        },
        '& .button-wrapper': {
          marginTop: theme.spacing(4)
        },
        '&.active + .MuiStepConnector-root .MuiStepConnector-line': {
          borderColor: 'var(--mui-palette-primary-main)'
        }
      },
      '& .MuiStepConnector-root': {
        marginLeft: theme.spacing(2.25),
        '& .MuiStepConnector-line': {
          borderBlockStartWidth: 0,
          borderInlineStartWidth: 3,
          borderRadius: 0
        }
      }
    }
  }
})

export default StepperWrapper
