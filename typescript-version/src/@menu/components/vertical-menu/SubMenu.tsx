'use client'

// React Imports
import { Children, cloneElement, forwardRef, useEffect, useId, useRef, useState } from 'react'
import type {
  AnchorHTMLAttributes,
  ForwardRefRenderFunction,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  ReactNode
} from 'react'

// Next Imports
import { usePathname } from 'next/navigation'

// Third-party Imports
import classnames from 'classnames'
import styled from '@emotion/styled'
import type { CSSObject } from '@emotion/styled'

// Type Imports
import type { OpenSubmenu } from './Menu'
import type { MenuItemProps } from './MenuItem'
import type { ChildrenType, RootStylesType, SubMenuItemElement } from '../../types'

// Component Imports
import SubMenuContent from './SubMenuContent'
import MenuButton, { menuButtonStyles } from './MenuButton'

// Icon Imports
import ChevronRight from '../../svg/ChevronRight'

// Hook Imports
import useVerticalNav from '../../hooks/useVerticalNav'
import useVerticalMenu from '../../hooks/useVerticalMenu'

// Util Imports
import { menuClasses } from '../../utils/menuClasses'
import { confirmUrlInChildren, renderMenuIcon } from '../../utils/menuUtils'

// Styled Component Imports
import StyledMenuLabel from '../../styles/StyledMenuLabel'
import StyledMenuPrefix from '../../styles/StyledMenuPrefix'
import StyledMenuSuffix from '../../styles/StyledMenuSuffix'
import StyledVerticalNavExpandIcon, {
  StyledVerticalNavExpandIconWrapper
} from '../../styles/vertical/StyledVerticalNavExpandIcon'

export type SubMenuProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'prefix'> &
  RootStylesType &
  Partial<ChildrenType> & {
    label: ReactNode
    icon?: ReactElement
    prefix?: ReactNode
    suffix?: ReactNode
    defaultOpen?: boolean
    disabled?: boolean
    contentClassName?: string
    onOpenChange?: (open: boolean) => void

    /**
     * @ignore
     */
    level?: number
  }

type StyledSubMenuProps = Pick<SubMenuProps, 'rootStyles' | 'disabled'> & {
  level: number
  active?: boolean
  menuItemStyles?: CSSObject
  buttonStyles?: CSSObject
}

const StyledSubMenu = styled.li<StyledSubMenuProps>`
  position: relative;
  inline-size: 100%;
  margin-block-start: 4px;

  &.${menuClasses.open} > .${menuClasses.button} {
    background-color: #f3f3f3;
  }

  ${({ menuItemStyles }) => menuItemStyles};
  ${({ rootStyles }) => rootStyles};

  > .${menuClasses.button} {
    ${({ level, disabled, active, children }) =>
      menuButtonStyles({
        level,
        active,
        disabled,
        children
      })};
    ${({ buttonStyles }) => buttonStyles};
  }
`

const SubMenu: ForwardRefRenderFunction<HTMLLIElement, SubMenuProps> = (props, ref) => {
  // Props
  const {
    children,
    className,
    contentClassName,
    label,
    icon,
    title,
    prefix,
    suffix,
    defaultOpen,
    level = 0,
    disabled = false,
    rootStyles,
    onOpenChange,
    onClick,
    onKeyUp,
    ...rest
  } = props

  // States
  const [active, setActive] = useState<boolean>(false)

  // Refs
  const contentRef = useRef<HTMLDivElement>(null)

  // Hooks
  const id = useId()
  const pathname = usePathname()
  const { isBreakpointReached } = useVerticalNav()

  const {
    renderExpandIcon,
    renderExpandedMenuItemIcon,
    menuItemStyles,
    openSubmenu,
    toggleOpenSubmenu,
    transitionDuration,
    openSubmenusRef,
    textTruncate
  } = useVerticalMenu()

  // Vars
  // Filter out falsy values from children
  const childNodes = Children.toArray(children).filter(Boolean) as [ReactElement<SubMenuProps | MenuItemProps>]

  const isSubMenuOpen = openSubmenu?.some((item: OpenSubmenu) => item.id === id) ?? false

  const handleSlideToggle = (): void => {
    toggleOpenSubmenu?.({ level, label, active, id })
    onOpenChange?.(!isSubMenuOpen)
    if (openSubmenusRef?.current && openSubmenusRef?.current.length > 0) openSubmenusRef.current = []
  }

  const handleOnClick = (event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) => {
    onClick?.(event)
    handleSlideToggle()
  }

  const handleOnKeyUp = (event: KeyboardEvent<HTMLAnchorElement>) => {
    onKeyUp?.(event)

    if (event.key === 'Enter') {
      handleSlideToggle()
    }
  }

  const getSubMenuItemStyles = (element: SubMenuItemElement): CSSObject | undefined => {
    // If the menuItemStyles prop is provided, get the styles for the specified element.
    if (menuItemStyles) {
      // Define the parameters that are passed to the style functions.
      const params = {
        level,
        disabled,
        active,
        isSubmenu: true,
        open: isSubMenuOpen
      }

      // Get the style function for the specified element.
      const styleFunction = menuItemStyles[element]

      if (styleFunction) {
        // If the style function is a function, call it and return the result.
        // Otherwise, return the style function itself.
        return typeof styleFunction === 'function' ? styleFunction(params) : styleFunction
      }
    }
  }

  useEffect(() => {
    if (confirmUrlInChildren(children, pathname)) {
      openSubmenusRef?.current.push({ level, label, active: true, id })
    } else {
      if (defaultOpen) {
        openSubmenusRef?.current.push({ level, label, active: false, id })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Change active state when the url changes
  useEffect(() => {
    // Check if the current url matches any of the children urls
    if (confirmUrlInChildren(children, pathname)) {
      setActive(true)

      if (openSubmenusRef?.current.findIndex(submenu => submenu.id === id) === -1) {
        openSubmenusRef?.current.push({ level, label, active: true, id })
      }
    } else {
      setActive(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  /* useEffect(() => {
    console.log(openSubmenu)
  }, [openSubmenu]) */

  const submenuContent = (
    <SubMenuContent
      ref={contentRef}
      transitionDuration={transitionDuration}
      open={isSubMenuOpen}
      level={level}
      className={classnames(menuClasses.subMenuContent, contentClassName)}
      rootStyles={{
        ...getSubMenuItemStyles('subMenuContent')
      }}
    >
      {childNodes.map(node =>
        cloneElement(node, {
          level: level + 1
        })
      )}
    </SubMenuContent>
  )

  return (
    // eslint-disable-next-line lines-around-comment
    /* Sub Menu */
    <StyledSubMenu
      ref={ref}
      className={classnames(
        menuClasses.subMenuRoot,
        { [menuClasses.active]: active },
        { [menuClasses.disabled]: disabled },
        { [menuClasses.open]: isSubMenuOpen },
        className
      )}
      menuItemStyles={getSubMenuItemStyles('root')}
      level={level}
      disabled={disabled}
      active={active}
      buttonStyles={getSubMenuItemStyles('button')}
      rootStyles={rootStyles}
    >
      {/* Menu Item */}
      <MenuButton
        ref={null}
        onClick={handleOnClick}
        onKeyUp={handleOnKeyUp}
        title={title}
        className={classnames(menuClasses.button, { [menuClasses.active]: active })}
        tabIndex={disabled ? -1 : 0}
        {...rest}
      >
        {/* Sub Menu Icon */}
        {renderMenuIcon({
          icon,
          level,
          active,
          disabled,
          renderExpandedMenuItemIcon,
          styles: getSubMenuItemStyles('icon'),
          isBreakpointReached
        })}

        {/* Sub Menu Prefix */}
        {prefix && (
          <StyledMenuPrefix className={menuClasses.prefix} rootStyles={getSubMenuItemStyles('prefix')}>
            {prefix}
          </StyledMenuPrefix>
        )}

        {/* Sub Menu Label */}
        <StyledMenuLabel
          className={menuClasses.label}
          rootStyles={getSubMenuItemStyles('label')}
          textTruncate={textTruncate}
        >
          {label}
        </StyledMenuLabel>

        {/* Sub Menu Suffix */}
        {suffix && (
          <StyledMenuSuffix className={menuClasses.suffix} rootStyles={getSubMenuItemStyles('suffix')}>
            {suffix}
          </StyledMenuSuffix>
        )}

        {/* Sub Menu Toggle Icon Wrapper */}
        {
          <StyledVerticalNavExpandIconWrapper
            className={menuClasses.subMenuExpandIcon}
            rootStyles={getSubMenuItemStyles('subMenuExpandIcon')}
          >
            {renderExpandIcon ? (
              renderExpandIcon({
                level,
                disabled,
                active,
                open: isSubMenuOpen
              })
            ) : (
              // eslint-disable-next-line lines-around-comment
              /* Expanded Arrow Icon */
              <StyledVerticalNavExpandIcon open={isSubMenuOpen} transitionDuration={transitionDuration}>
                <ChevronRight fontSize='1rem' />
              </StyledVerticalNavExpandIcon>
            )}
          </StyledVerticalNavExpandIconWrapper>
        }
      </MenuButton>

      {/* Sub Menu Content */}
      {submenuContent}
    </StyledSubMenu>
  )
}

export default forwardRef<HTMLLIElement, SubMenuProps>(SubMenu)
