// フルスクリーン用途のレイアウト (サイネージ等)
// URL には (signage) というグループ名は現れません。/machine-signage などは VerticalLayout を経由せずに表示されます。

import Providers from '@components/Providers'
// DarkModeForcer は Client Component に分離
import DarkModeForcer from './components/DarkModeForcer'

const Layout = ({ children }) => {
  const direction = 'ltr'
  return (
    <Providers direction={direction}>
      <DarkModeForcer />
      {/* サイネージはログイン不要。AuthGuard を通さず常時公開 */}
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>{children}</div>
    </Providers>
  )
}

export default Layout
