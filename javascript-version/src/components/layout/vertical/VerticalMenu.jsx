// MUI インポート
import Chip from '@mui/material/Chip'
import { useTheme } from '@mui/material/styles'

// サードパーティ インポート
import PerfectScrollbar from 'react-perfect-scrollbar'

// コンポーネント インポート
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'

// フック インポート
import useVerticalNav from '@menu/hooks/useVerticalNav'

// スタイル付きコンポーネント インポート
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// スタイル インポート
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }) => {
  // フック
  const theme = useTheme()
  const { isBreakpointReached, transitionDuration } = useVerticalNav()
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
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
      <Menu
        menuItemStyles={menuItemStyles(theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <span style={{ fontSize: 10, lineHeight: 1 }}>•</span> }}
        menuSectionStyles={menuSectionStyles(theme)}
      >
        <MenuItem href='/' icon={<span role='img' aria-label='home'>🏠</span>}>
          トップページ
        </MenuItem>
        <MenuSection label='製造管理システム'>
          <MenuItem href='/production-management' icon={<span role='img' aria-label='chart'>📊</span>}>
            生産数管理
          </MenuItem>
          <MenuItem href='/image-inspection' icon={<span role='img' aria-label='camera'>📷</span>}>
            画像検査ステータス
          </MenuItem>
          <MenuItem href='/employee-list' icon={<span role='img' aria-label='user'>👤</span>}>
            従業員名簿
          </MenuItem>
          <MenuItem href='/machine-status' icon={<span role='img' aria-label='cpu'>🖥️</span>}>
            生産機械ステータス
          </MenuItem>
          <MenuItem href='/shipping-instructions' icon={<span role='img' aria-label='ship'>🚢</span>}>
            製造出荷指示周知
          </MenuItem>
          <MenuItem href='/parts-inventory' icon={<span role='img' aria-label='inventory'>📦</span>}>
            部品在庫管理
          </MenuItem>
          <MenuItem href='/daily-reports' icon={<span role='img' aria-label='reports'>📝</span>}>
            日報一覧
          </MenuItem>
        </MenuSection>
        <MenuSection label='その他のページ'>
          <MenuItem href='/factory-settings' icon={<span role='img' aria-label='factory'>🏭</span>}>
            工場設定
          </MenuItem>
          <MenuItem
            href='/machine-signage'
            icon={<span role='img' aria-label='display'>🖥️</span>}
          >
            生産機械サイネージ
          </MenuItem>
        </MenuSection>
        <MenuSection label='デバッグ'>
          <MenuItem href='http://10.100.54.170:4001/static/index.html' icon={<span role='img' aria-label='ssh'>🔐</span>}>
            SSH接続ページ
          </MenuItem>
          <MenuItem href='/sse-monitoring' icon={<span role='img' aria-label='monitoring'>📡</span>}>
            SSE監視ページ
          </MenuItem>
        </MenuSection>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
