// Util Imports
import { menuClasses, verticalNavClasses } from '@menu/utils/menuClasses'

const navigationCustomStyles = () => ({
  color: 'var(--mui-palette-text-primary)',
  zIndex: 'var(--drawer-z-index) !important',
  [`& .${verticalNavClasses.container}`]: {
    borderColor: 'var(--mui-palette-divider)'
  },
  [`& .${verticalNavClasses.bgColorContainer}`]: {
    backgroundColor: 'var(--mui-palette-background-paper)'
  },
  [`& .${menuClasses.menuSectionContent}`]: {
    color: 'var(--mui-palette-text-disabled)'
  }
})

export default navigationCustomStyles
