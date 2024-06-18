/*
 * If you change the following items in the config object, you will not see any effect in the local development server
 * as these are stored in the cookie (cookie has the highest priority over the themeConfig):
 * 1. mode
 *
 * To see the effect of the above items, you can click on the reset button from the Customizer
 * which is on the top-right corner of the customizer besides the close button.
 * This will reset the cookie to the values provided in the config object below.
 *
 * Another way is to clear the cookie from the browser's Application/Storage tab and then reload the page.
 */

// Type Imports
import type { Mode } from '@core/types'

export type Config = {
  templateName: string
  settingsCookieName: string
  mode: Mode
  layoutPadding: number
  compactContentWidth: number
  disableRipple: boolean
}

const themeConfig: Config = {
  templateName: 'Materio',
  settingsCookieName: 'materio-mui-next-free-demo',
  mode: 'light', // 'light', 'dark'
  layoutPadding: 24, // Common padding for header, content, footer layout components (in px)
  compactContentWidth: 1440, // in px
  disableRipple: false // true, false
}

export default themeConfig
