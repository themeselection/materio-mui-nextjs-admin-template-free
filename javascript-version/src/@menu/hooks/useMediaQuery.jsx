'use client'

// React Imports
import { useEffect, useState } from 'react'

const useMediaQuery = breakpoint => {
  // States
  const [matches, setMatches] = useState(breakpoint === 'always')

  useEffect(() => {
    if (breakpoint && breakpoint !== 'always') {
      const media = window.matchMedia(`(max-width: ${breakpoint})`)

      if (media.matches !== matches) {
        setMatches(media.matches)
      }

      const listener = () => setMatches(media.matches)

      window.addEventListener('resize', listener)

      return () => window.removeEventListener('resize', listener)
    }
  }, [matches, breakpoint])

  return matches
}

export default useMediaQuery
