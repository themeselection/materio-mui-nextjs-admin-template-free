const Rating = theme => {
  return {
    MuiRating: {
      styleOverrides: {
        root: {
          color: theme.palette.warning.main
        }
      }
    }
  }
}

export default Rating
