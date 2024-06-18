const timeline = {
  MuiTimeline: {
    styleOverrides: {
      root: {
        padding: 0
      }
    }
  },
  MuiTimelineDot: {
    styleOverrides: {
      root: ({ theme }) => ({
        margin: theme.spacing(3, 0),
        boxShadow: 'none',
        '&:has(> i), &:has(> svg)': {
          padding: 6
        },
        '& > svg, & > i': {
          fontSize: '1.25rem'
        },
        '&:has(svg)': {
          width: 32,
          height: 32,
          alignItems: 'center',
          justifyContent: 'center'
        }
      })
    },
    variants: [
      {
        props: { variant: 'outlined' },
        style: {
          padding: 5,
          '& + .MuiTimelineConnector-root': {
            backgroundColor: 'transparent',
            borderInlineStart: '1px dashed var(--mui-palette-divider)'
          },
          '&:has(+ .MuiTimelineConnector-root)': {
            marginBlock: '0.625rem'
          }
        }
      },
      {
        props: { variant: 'filled', color: 'grey' },
        style: {
          boxShadow: '0 0 0 3px rgb(var(--mui-mainColorChannels-light) / 0.04)'
        }
      },
      {
        props: { variant: 'filled', color: 'primary' },
        style: {
          boxShadow: '0 0 0 3px var(--mui-palette-primary-lightOpacity)'
        }
      },
      {
        props: { variant: 'filled', color: 'secondary' },
        style: {
          boxShadow: '0 0 0 3px var(--mui-palette-secondary-lightOpacity)'
        }
      },
      {
        props: { variant: 'filled', color: 'error' },
        style: {
          boxShadow: '0 0 0 3px var(--mui-palette-error-lightOpacity)'
        }
      },
      {
        props: { variant: 'filled', color: 'warning' },
        style: {
          boxShadow: '0 0 0 3px var(--mui-palette-warning-lightOpacity)'
        }
      },
      {
        props: { variant: 'filled', color: 'info' },
        style: {
          boxShadow: '0 0 0 3px var(--mui-palette-info-lightOpacity)'
        }
      },
      {
        props: { variant: 'filled', color: 'success' },
        style: {
          boxShadow: '0 0 0 3px var(--mui-palette-success-lightOpacity)'
        }
      },
      {
        props: { variant: 'tonal' },
        style: {
          border: 0
        }
      },
      {
        props: { variant: 'tonal', color: 'grey' },
        style: {
          backgroundColor: 'var(--mui-palette-action-selected)',
          color: 'var(--mui-palette-text-primary)'
        }
      },
      {
        props: { variant: 'tonal', color: 'primary' },
        style: {
          backgroundColor: 'var(--mui-palette-primary-lightOpacity)',
          color: 'var(--mui-palette-primary-main)'
        }
      },
      {
        props: { variant: 'tonal', color: 'secondary' },
        style: {
          backgroundColor: 'var(--mui-palette-secondary-lightOpacity)',
          color: 'var(--mui-palette-secondary-main)'
        }
      },
      {
        props: { variant: 'tonal', color: 'error' },
        style: {
          backgroundColor: 'var(--mui-palette-error-lightOpacity)',
          color: 'var(--mui-palette-error-main)'
        }
      },
      {
        props: { variant: 'tonal', color: 'warning' },
        style: {
          backgroundColor: 'var(--mui-palette-warning-lightOpacity)',
          color: 'var(--mui-palette-warning-main)'
        }
      },
      {
        props: { variant: 'tonal', color: 'info' },
        style: {
          backgroundColor: 'var(--mui-palette-info-lightOpacity)',
          color: 'var(--mui-palette-info-main)'
        }
      },
      {
        props: { variant: 'tonal', color: 'success' },
        style: {
          backgroundColor: 'var(--mui-palette-success-lightOpacity)',
          color: 'var(--mui-palette-success-main)'
        }
      }
    ]
  },
  MuiTimelineConnector: {
    styleOverrides: {
      root: {
        width: 1,
        backgroundColor: 'var(--mui-palette-divider)'
      }
    }
  },
  MuiTimelineContent: {
    styleOverrides: {
      root: {
        paddingBottom: '1rem'
      }
    }
  }
}

export default timeline
