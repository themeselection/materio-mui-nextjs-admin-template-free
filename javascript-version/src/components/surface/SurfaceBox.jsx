"use client"

import { forwardRef } from 'react'
import Box from '@mui/material/Box'

// Variant mapping to a background token derived from the theme.
const variantToBg = (theme, variant) => {
  switch (variant) {
    case 'paper':
      return theme.palette.background.paper
    case 'default':
      return theme.palette.background.default
    case 'soft':
    default:
      // Prefer custom surface color if provided by theme; fallback to grey scale.
      return (
        theme.palette?.customColors?.greyLightBg ||
        (theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50')
      )
  }
}

const SurfaceBox = forwardRef(function SurfaceBox(props, ref) {
  const { variant = 'soft', sx, ...rest } = props
  return (
    <Box
      ref={ref}
      sx={{ bgcolor: theme => variantToBg(theme, variant), ...sx }}
      {...rest}
    />
  )
})

export default SurfaceBox
