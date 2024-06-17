/*
 ! We do not recommend using your own custom theme built from scratch.
 ! Instead, we recommend using the merged theme (src/components/theme/mergedTheme.ts) and customizing it as per your needs.
 ! If you still want to use your own custom theme, you must be aware about the MUI theme structure along with MUI CSS Variables.
 ! MUI Theme: https://mui.com/material-ui/customization/default-theme/
 ! MUI CSS Variables: https://mui.com/material-ui/experimental-api/css-theme-variables/overview/
 ! Export this file and import it in the `@components/theme/index.tsx` file to use only this theme.
 */

// MUI Imports
import type { Theme } from '@mui/material/styles'

// Type Imports
/* Enable following line and the `settings` parameter in the below `userTheme`
   function in order to access `settings` context value in your custom theme object
 */
// import type { Settings } from '@core/contexts/settingsContext'

const userTheme = (/* settings: Settings */): Theme => {
  return {
    // Write your custom theme object here.
  } as Theme
}

export default userTheme
