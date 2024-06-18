// MUI Imports
import Chip from '@mui/material/Chip'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }: { scrollMenu: (container: any, isPerfectScrollbar: boolean) => void }) => {
  // Hooks
  const theme = useTheme()
  const { isBreakpointReached, transitionDuration } = useVerticalNav()

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        menuItemStyles={menuItemStyles(theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuSectionStyles={menuSectionStyles(theme)}
      >
        <SubMenu
          label='Dashboards'
          icon={<i className='ri-home-smile-line' />}
          suffix={<Chip label='5' size='small' color='error' />}
        >
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_PRO_URL}/dashboards/crm`}
            suffix={<Chip label='Pro' size='small' color='primary' variant='tonal' />}
            target='_blank'
          >
            CRM
          </MenuItem>
          <MenuItem href='/'>Analytics</MenuItem>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_PRO_URL}/dashboards/ecommerce`}
            suffix={<Chip label='Pro' size='small' color='primary' variant='tonal' />}
            target='_blank'
          >
            eCommerce
          </MenuItem>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_PRO_URL}/dashboards/academy`}
            suffix={<Chip label='Pro' size='small' color='primary' variant='tonal' />}
            target='_blank'
          >
            Academy
          </MenuItem>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_PRO_URL}/dashboards/logistics`}
            suffix={<Chip label='Pro' size='small' color='primary' variant='tonal' />}
            target='_blank'
          >
            Logistics
          </MenuItem>
        </SubMenu>
        <SubMenu
          label='Front Pages'
          icon={<i className='ri-file-copy-line' />}
          suffix={<Chip label='Pro' size='small' color='primary' variant='tonal' />}
        >
          <MenuItem href={`${process.env.NEXT_PUBLIC_PRO_URL}/front-pages/landing-page`} target='_blank'>
            Landing
          </MenuItem>
          <MenuItem href={`${process.env.NEXT_PUBLIC_PRO_URL}/front-pages/pricing`} target='_blank'>
            Pricing
          </MenuItem>
          <MenuItem href={`${process.env.NEXT_PUBLIC_PRO_URL}/front-pages/payment`} target='_blank'>
            Payment
          </MenuItem>
          <MenuItem href={`${process.env.NEXT_PUBLIC_PRO_URL}/front-pages/checkout`} target='_blank'>
            Checkout
          </MenuItem>
          <MenuItem href={`${process.env.NEXT_PUBLIC_PRO_URL}/front-pages/help-center`} target='_blank'>
            Help Center
          </MenuItem>
        </SubMenu>
        <MenuSection label='Apps & Pages'>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_PRO_URL}/apps/email`}
            icon={<i className='ri-mail-open-line' />}
            suffix={<Chip label='Pro' size='small' color='primary' variant='tonal' />}
            target='_blank'
          >
            Email
          </MenuItem>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_PRO_URL}/apps/chat`}
            icon={<i className='ri-wechat-line' />}
            suffix={<Chip label='Pro' size='small' color='primary' variant='tonal' />}
            target='_blank'
          >
            Chat
          </MenuItem>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_PRO_URL}/apps/calendar`}
            icon={<i className='ri-calendar-line' />}
            suffix={<Chip label='Pro' size='small' color='primary' variant='tonal' />}
            target='_blank'
          >
            Calendar
          </MenuItem>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_PRO_URL}/apps/kanban`}
            icon={<i className='ri-drag-drop-line' />}
            suffix={<Chip label='Pro' size='small' color='primary' variant='tonal' />}
            target='_blank'
          >
            Kanban
          </MenuItem>
          <MenuItem href='/account-settings' icon={<i className='ri-user-settings-line' />}>
            Account Settings
          </MenuItem>
          <SubMenu label='Auth Pages' icon={<i className='ri-shield-keyhole-line' />}>
            <MenuItem href='/login' target='_blank'>
              Login
            </MenuItem>
            <MenuItem href='/register' target='_blank'>
              Register
            </MenuItem>
            <MenuItem href='/forgot-password' target='_blank'>
              Forgot Password
            </MenuItem>
          </SubMenu>
          <SubMenu label='Miscellaneous' icon={<i className='ri-question-line' />}>
            <MenuItem href='/error' target='_blank'>
              Error
            </MenuItem>
            <MenuItem href='/under-maintenance' target='_blank'>
              Under Maintenance
            </MenuItem>
          </SubMenu>
          <MenuItem href='/card-basic' icon={<i className='ri-bar-chart-box-line' />}>
            Cards
          </MenuItem>
        </MenuSection>
        <MenuSection label='Forms & Tables'>
          <MenuItem href='/form-layouts' icon={<i className='ri-layout-4-line' />}>
            Form Layouts
          </MenuItem>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_PRO_URL}/forms/form-validation`}
            icon={<i className='ri-checkbox-multiple-line' />}
            suffix={<Chip label='Pro' size='small' color='primary' variant='tonal' />}
            target='_blank'
          >
            Form Validation
          </MenuItem>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_PRO_URL}/forms/form-wizard`}
            icon={<i className='ri-git-commit-line' />}
            suffix={<Chip label='Pro' size='small' color='primary' variant='tonal' />}
            target='_blank'
          >
            Form Wizard
          </MenuItem>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_PRO_URL}/react-table`}
            icon={<i className='ri-table-alt-line' />}
            suffix={<Chip label='Pro' size='small' color='primary' variant='tonal' />}
            target='_blank'
          >
            React Table
          </MenuItem>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/form-elements`}
            icon={<i className='ri-radio-button-line' />}
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
          >
            Form Elements
          </MenuItem>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/mui-table`}
            icon={<i className='ri-table-2' />}
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
          >
            MUI Tables
          </MenuItem>
        </MenuSection>
        <MenuSection label='Misc'>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/foundation`}
            icon={<i className='ri-pantone-line' />}
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
          >
            Foundation
          </MenuItem>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components`}
            icon={<i className='ri-toggle-line' />}
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
          >
            Components
          </MenuItem>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/menu-examples/overview`}
            icon={<i className='ri-menu-search-line' />}
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
          >
            Menu Examples
          </MenuItem>
          <MenuItem
            href={`https://github.com/themeselection/${process.env.NEXT_PUBLIC_REPO_NAME}/issues`}
            icon={<i className='ri-lifebuoy-line' />}
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
          >
            Raise Support
          </MenuItem>
          <MenuItem
            href={process.env.NEXT_PUBLIC_DOCS_URL}
            icon={<i className='ri-book-line' />}
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
          >
            Documentation
          </MenuItem>
          <SubMenu label='Others' icon={<i className='ri-more-line' />}>
            <MenuItem suffix={<Chip label='New' size='small' color='info' />}>Item With Badge</MenuItem>
            <MenuItem
              href='https://themeselection.com'
              target='_blank'
              suffix={<i className='ri-external-link-line text-xl' />}
            >
              External Link
            </MenuItem>
            <SubMenu label='Menu Levels'>
              <MenuItem>Menu Level 2</MenuItem>
              <SubMenu label='Menu Level 2'>
                <MenuItem>Menu Level 3</MenuItem>
                <MenuItem>Menu Level 3</MenuItem>
              </SubMenu>
            </SubMenu>
            <MenuItem disabled>Disabled Menu</MenuItem>
          </SubMenu>
        </MenuSection>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
