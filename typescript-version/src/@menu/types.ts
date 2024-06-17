// React Imports
import type { AnchorHTMLAttributes, ReactElement, ReactNode } from 'react'

// Third-party Imports
import type { CSSObject } from '@emotion/styled'

export type ChildrenType = {
  children: ReactNode
}

// Breakpoints
export type BreakpointType = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'always'

// Exact match for active URL in menu item
export type MenuItemExactMatchUrlProps =
  | {
      exactMatch: true
      activeUrl?: never
    }
  | {
      exactMatch: false
      activeUrl: string
    }
  | {
      exactMatch?: never
      activeUrl?: never
    }

// Menu Item Elements for styling
export type MenuItemElement = 'root' | 'button' | 'icon' | 'label' | 'prefix' | 'suffix'

// Sub Menu Item Elements for styling
export type SubMenuItemElement =
  | 'root'
  | 'button'
  | 'label'
  | 'prefix'
  | 'suffix'
  | 'icon'
  | 'subMenuStyles'
  | 'subMenuContent'
  | 'subMenuExpandIcon'

// Menu Button Props
export type MenuButtonProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'prefix'> & Partial<ChildrenType>

// Menu Item Styles Params Type
export type MenuItemStylesParams = {
  level: number
  disabled: boolean
  active?: boolean
  isSubmenu: boolean
  open?: boolean
}

// Menu Item Style Elements Type
export type ElementStyles = CSSObject | ((params: MenuItemStylesParams) => CSSObject | undefined)

// Menu Item Styles Type
export type MenuItemStyles = {
  root?: ElementStyles
  button?: ElementStyles
  label?: ElementStyles
  prefix?: ElementStyles
  suffix?: ElementStyles
  icon?: ElementStyles
  subMenuStyles?: ElementStyles
  subMenuContent?: ElementStyles
  subMenuExpandIcon?: ElementStyles
}

// Expand Icon
export type RenderExpandIconParams = {
  open: boolean
  level: number
  active: boolean
  disabled: boolean
}

// Icon for menu items in expanded submenu
export type RenderExpandedMenuItemIcon = {
  icon:
    | ReactElement
    | ((params: { level?: number; active?: boolean; disabled?: boolean }) => ReactElement | null)
    | null
  level?: number
}

// Root Styles
export type RootStylesType = {
  rootStyles?: CSSObject
}
