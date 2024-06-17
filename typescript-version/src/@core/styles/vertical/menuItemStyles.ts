// Type Imports
import type { MenuItemStyles } from '@menu/types'

// Util Imports
import { menuClasses } from '@menu/utils/menuClasses'

const menuItemStyles = (): MenuItemStyles => ({
  root: {
    [`&.${menuClasses.open} > .${menuClasses.button}`]: {
      backgroundColor: 'var(--mui-palette-action-hover)'
    },
    [`&.${menuClasses.disabled} > .${menuClasses.button}`]: {
      color: 'var(--mui-palette-text-disabled)'
    }
  },
  button: {
    paddingBlock: '10px',
    [`&:not(.${menuClasses.active}):hover, &:not(.${menuClasses.active})[aria-expanded="true"]`]: {
      backgroundColor: 'var(--mui-palette-action-hover)'
    }
  },
  subMenuContent: {
    zIndex: 'calc(var(--drawer-z-index) + 1)',
    backgroundColor: 'var(--mui-palette-background-paper)'
  }
})

export default menuItemStyles
