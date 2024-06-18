const fab = {
  MuiFab: {
    variants: [
      {
        props: { color: 'default' },
        style: {
          color: 'rgb(var(--mui-mainColorChannels-light) / 0.9)',
          '&.Mui-focusVisible:not(:has(span.MuiTouchRipple-root))': {
            backgroundColor: 'var(--mui-palette-grey-A100)'
          }
        }
      },
      {
        props: { color: 'primary' },
        style: {
          '&.Mui-focusVisible:not(:has(span.MuiTouchRipple-root))': {
            backgroundColor: 'var(--mui-palette-primary-dark)'
          }
        }
      },
      {
        props: { color: 'secondary' },
        style: {
          '&.Mui-focusVisible:not(:has(span.MuiTouchRipple-root))': {
            backgroundColor: 'var(--mui-palette-secondary-dark)'
          }
        }
      },
      {
        props: { color: 'error' },
        style: {
          '&.Mui-focusVisible:not(:has(span.MuiTouchRipple-root))': {
            backgroundColor: 'var(--mui-palette-error-dark)'
          }
        }
      },
      {
        props: { color: 'warning' },
        style: {
          '&.Mui-focusVisible:not(:has(span.MuiTouchRipple-root))': {
            backgroundColor: 'var(--mui-palette-warning-dark)'
          }
        }
      },
      {
        props: { color: 'info' },
        style: {
          '&.Mui-focusVisible:not(:has(span.MuiTouchRipple-root))': {
            backgroundColor: 'var(--mui-palette-info-dark)'
          }
        }
      },
      {
        props: { color: 'success' },
        style: {
          '&.Mui-focusVisible:not(:has(span.MuiTouchRipple-root))': {
            backgroundColor: 'var(--mui-palette-success-dark)'
          }
        }
      }
    ]
  }
}

export default fab
