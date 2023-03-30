const Typography = theme => {
  return {
    MuiTypography: {
      styleOverrides: {
        gutterBottom: {
          marginBottom: theme.spacing(2)
        }
      }
    }
  }
}

export default Typography
