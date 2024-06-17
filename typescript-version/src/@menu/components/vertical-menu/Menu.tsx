'use client'

// React Imports
import { createContext, forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ForwardRefRenderFunction, MenuHTMLAttributes, MutableRefObject, ReactElement, ReactNode } from 'react'

// Next Imports
import { usePathname } from 'next/navigation'

// Third-party Imports
import classnames from 'classnames'
import type { CSSObject } from '@emotion/styled'

// Type Imports
import type {
  ChildrenType,
  MenuItemStyles,
  RootStylesType,
  RenderExpandIconParams,
  RenderExpandedMenuItemIcon
} from '../../types'

// Util Imports
import { menuClasses } from '../../utils/menuClasses'

// Styled Component Imports
import StyledVerticalMenu from '../../styles/vertical/StyledVerticalMenu'

// Style Imports
import styles from '../../styles/styles.module.css'

// Default Config Imports
import { verticalSubMenuToggleDuration } from '../../defaultConfigs'

export type MenuSectionStyles = {
  root?: CSSObject
  label?: CSSObject
  prefix?: CSSObject
  suffix?: CSSObject
  icon?: CSSObject
}

export type OpenSubmenu = {
  level: number
  label: ReactNode
  active: boolean
  id: string
}

export type VerticalMenuContextProps = {
  transitionDuration?: number
  menuSectionStyles?: MenuSectionStyles
  menuItemStyles?: MenuItemStyles
  subMenuOpenBehavior?: 'accordion' | 'collapse'
  renderExpandIcon?: (params: RenderExpandIconParams) => ReactElement
  renderExpandedMenuItemIcon?: RenderExpandedMenuItemIcon
  textTruncate?: boolean

  /**
   * @ignore
   */
  openSubmenu?: OpenSubmenu[]

  /**
   * @ignore
   */
  openSubmenusRef?: MutableRefObject<OpenSubmenu[]>

  /**
   * @ignore
   */
  toggleOpenSubmenu?: (...submenus: { level: number; label: ReactNode; active?: boolean; id: string }[]) => void
}

export type MenuProps = VerticalMenuContextProps &
  RootStylesType &
  Partial<ChildrenType> &
  MenuHTMLAttributes<HTMLMenuElement>

export const VerticalMenuContext = createContext({} as VerticalMenuContextProps)

const Menu: ForwardRefRenderFunction<HTMLMenuElement, MenuProps> = (props, ref) => {
  // Props
  const {
    children,
    className,
    rootStyles,
    menuItemStyles,
    renderExpandIcon,
    renderExpandedMenuItemIcon,
    menuSectionStyles,
    subMenuOpenBehavior = 'accordion', // accordion, collapse
    transitionDuration = verticalSubMenuToggleDuration,
    textTruncate = true,
    ...rest
  } = props

  // States
  const [openSubmenu, setOpenSubmenu] = useState<OpenSubmenu[]>([])

  // Refs
  const openSubmenusRef = useRef<OpenSubmenu[]>([])

  // Hooks
  const pathname = usePathname()

  const toggleOpenSubmenu = useCallback(
    (...submenus: { level: number; label: ReactNode; active?: boolean; id: string }[]): void => {
      if (!submenus.length) return

      const openSubmenuCopy = [...openSubmenu]

      submenus.forEach(({ level, label, active = false, id }) => {
        const submenuIndex = openSubmenuCopy.findIndex(submenu => submenu.id === id)
        const submenuExists = submenuIndex >= 0
        const isAccordion = subMenuOpenBehavior === 'accordion'

        const inactiveSubmenuIndex = openSubmenuCopy.findIndex(submenu => !submenu.active && submenu.level === 0)

        // Delete submenu if it exists
        if (submenuExists) {
          openSubmenuCopy.splice(submenuIndex, 1)
        }

        if (isAccordion) {
          // Add submenu if it doesn't exist
          if (!submenuExists) {
            if (inactiveSubmenuIndex >= 0 && !active && level === 0) {
              openSubmenuCopy.splice(inactiveSubmenuIndex, 1, { level, label, active, id })
            } else {
              openSubmenuCopy.push({ level, label, active, id })
            }
          }
        } else {
          // Add submenu if it doesn't exist
          if (!submenuExists) {
            openSubmenuCopy.push({ level, label, active, id })
          }
        }
      })

      setOpenSubmenu(openSubmenuCopy)
    },
    [openSubmenu, subMenuOpenBehavior]
  )

  useEffect(() => {
    setOpenSubmenu([...openSubmenusRef.current])
    openSubmenusRef.current = []
  }, [pathname])

  const providerValue = useMemo(
    () => ({
      transitionDuration,
      menuItemStyles,
      menuSectionStyles,
      renderExpandIcon,
      renderExpandedMenuItemIcon,
      openSubmenu,
      openSubmenusRef,
      toggleOpenSubmenu,
      subMenuOpenBehavior,
      textTruncate
    }),
    [
      transitionDuration,
      menuItemStyles,
      menuSectionStyles,
      renderExpandIcon,
      renderExpandedMenuItemIcon,
      openSubmenu,
      openSubmenusRef,
      toggleOpenSubmenu,
      subMenuOpenBehavior,
      textTruncate
    ]
  )

  return (
    <VerticalMenuContext.Provider value={providerValue}>
      <StyledVerticalMenu
        ref={ref}
        className={classnames(menuClasses.root, className)}
        rootStyles={rootStyles}
        {...rest}
      >
        <ul className={styles.ul}>{children}</ul>
      </StyledVerticalMenu>
    </VerticalMenuContext.Provider>
  )
}

export default forwardRef(Menu)
