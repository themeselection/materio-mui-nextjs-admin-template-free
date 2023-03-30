const Popover = theme => {
  return {
    MuiPopover: {
      styleOverrides: {
        root: {
          '& .MuiPopover-paper': {
            boxShadow: theme.shadows[6]
          }
        }
      }
    }
  }
}

export default Popover
