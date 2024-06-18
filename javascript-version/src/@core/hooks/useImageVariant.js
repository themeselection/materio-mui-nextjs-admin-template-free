// React Imports
import { useMemo } from 'react'

// Third-party imports
import { useColorScheme } from '@mui/material'

export const useImageVariant = (mode, imgLight, imgDark) => {
  // Hooks
  const { mode: muiMode } = useColorScheme()

  return useMemo(() => {
    const isServer = typeof window === 'undefined'

    const currentMode = (() => {
      if (isServer) return mode

      return muiMode
    })()

    const isDarkMode = currentMode === 'dark'

    return isDarkMode ? imgDark : imgLight
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, muiMode])
}
