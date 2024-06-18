const badges = {
  MuiBadge: {
    styleOverrides: {
      standard: ({ theme }) => ({
        height: 22,
        minWidth: 22,
        borderRadius: 20,
        fontSize: theme.typography.subtitle2.fontSize,
        lineHeight: 1.07,
        padding: theme.spacing(1, 2)
      })
    }
  }
}

export default badges
