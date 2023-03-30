const Menu = theme => {
  return {
    MuiMenu: {
      styleOverrides: {
        root: {
          '& .MuiMenu-paper': {
            borderRadius: 5,
            boxShadow: theme.palette.mode === 'light' ? theme.shadows[8] : theme.shadows[9]
          }
        }
      }
    }
  }
}

export default Menu
