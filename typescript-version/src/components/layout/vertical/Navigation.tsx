'use client'

// Next Imports
import Link from 'next/link'

// Component Imports
import VerticalNav, { NavHeader } from '@menu/vertical-menu'
import VerticalMenu from './VerticalMenu'
import Logo from '@components/layout/shared/Logo'

// Style Imports
import navigationCustomStyles from '@core/styles/vertical/navigationCustomStyles'

const Navigation = () => {
  return (
    // eslint-disable-next-line lines-around-comment
    // Sidebar Vertical Menu
    <VerticalNav customStyles={navigationCustomStyles()}>
      {/* Nav Header including Logo & nav toggle icons  */}
      <NavHeader>
        <Link href='/'>
          <Logo />
        </Link>
      </NavHeader>
      <VerticalMenu />
    </VerticalNav>
  )
}

export default Navigation
