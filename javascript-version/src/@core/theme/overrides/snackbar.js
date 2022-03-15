const Snackbar = theme => {
  return {
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[900] : theme.palette.grey[100]
        }
      }
    }
  }
}

export default Snackbar
