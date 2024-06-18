// MUI Imports
import type { Theme } from '@mui/material/styles'

// Type Imports
import type { MenuProps } from '@menu/vertical-menu'

// Util Imports
import { menuClasses } from '@menu/utils/menuClasses'

const menuSectionStyles = (theme: Theme): MenuProps['menuSectionStyles'] => {
  return {
    root: {
      marginBlockStart: theme.spacing(7),
      [`& .${menuClasses.menuSectionContent}`]: {
        color: 'var(--mui-palette-text-disabled)',
        paddingInline: '0 !important',
        paddingBlock: `${theme.spacing(1.75)} !important`,
        gap: theme.spacing(2.5),

        '&:before': {
          content: '""',
          blockSize: 1,
          inlineSize: '0.875rem',
          backgroundColor: 'var(--mui-palette-divider)'
        },
        '&:after': {
          content: '""',
          blockSize: 1,
          flexGrow: 1,
          backgroundColor: 'var(--mui-palette-divider)'
        }
      },
      [`& .${menuClasses.menuSectionLabel}`]: {
        flexGrow: 0,
        fontSize: '13px',
        lineHeight: 1.38462
      }
    }
  }
}

export default menuSectionStyles
