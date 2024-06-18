// React Imports
import { forwardRef } from 'react'

// Third-party Imports
import { css } from '@emotion/react'

// Component Imports
import { RouterLink } from '../RouterLink'

// Util Imports
import { menuClasses } from '../../utils/menuClasses'

export const menuButtonStyles = props => {
  // Props
  const { level, disabled, children } = props

  return css({
    display: 'flex',
    alignItems: 'center',
    minBlockSize: '30px',
    textDecoration: 'none',
    color: 'inherit',
    boxSizing: 'border-box',
    cursor: 'pointer',
    paddingInlineEnd: '20px',
    paddingInlineStart: `${level === 0 ? 20 : (level + 1) * 20}px`,
    '&:hover, &[aria-expanded="true"]': {
      backgroundColor: '#f3f3f3'
    },
    '&:focus-visible': {
      outline: 'none',
      backgroundColor: '#f3f3f3'
    },
    ...(disabled && {
      pointerEvents: 'none',
      cursor: 'default',
      color: '#adadad'
    }),

    // All the active styles are applied to the button including menu items or submenu
    [`&.${menuClasses.active}`]: {
      ...(!children && { color: 'white' }),
      backgroundColor: children ? '#f3f3f3' : '#765feb'
    }
  })
}

const MenuButton = ({ className, children, ...rest }, ref) => {
  return rest.href ? (
    <RouterLink ref={ref} className={className} href={rest.href} {...rest}>
      {children}
    </RouterLink>
  ) : (
    <a ref={ref} className={className} {...rest}>
      {children}
    </a>
  )
}

export default forwardRef(MenuButton)
