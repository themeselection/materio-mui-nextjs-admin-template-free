const backdrop = {
  MuiBackdrop: {
    styleOverrides: {
      root: {
        '&:not(.MuiBackdrop-invisible)': {
          backgroundColor: 'var(--backdrop-color)'
        }
      }
    }
  }
}

export default backdrop
