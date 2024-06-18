const tooltip = {
  MuiTooltip: {
    styleOverrides: {
      popper: {
        '&[data-popper-placement*="bottom"] .MuiTooltip-tooltip': {
          marginTop: '6px !important'
        },
        '&[data-popper-placement*="top"] .MuiTooltip-tooltip': {
          marginBottom: '6px !important'
        },
        '&[data-popper-placement*="left"] .MuiTooltip-tooltip': {
          marginRight: '6px !important'
        },
        '&[data-popper-placement*="right"] .MuiTooltip-tooltip': {
          marginLeft: '6px !important'
        }
      },
      tooltip: ({ theme }) => ({
        borderRadius: 'var(--mui-shape-customBorderRadius-sm)',
        fontSize: theme.typography.subtitle2.fontSize,
        lineHeight: 1.539,
        color: 'var(--mui-palette-customColors-tooltipText)',
        paddingInline: theme.spacing(3)
      })
    }
  }
}

export default tooltip
