// Note:
// Google Fonts を next/font/google で取得すると開発サーバー起動時やビルド時に
// Node 側から外部ネットワークへフェッチが発生します。
// プロキシ環境下では失敗しやすいため、ここでは next/font/google の使用を避け、
// ローカル指定のフォントファミリーに切り替えます。

// Theme Options Imports
import overrides from './overrides'
import colorSchemes from './colorSchemes'
import spacing from './spacing'
import shadows from './shadows'
import customShadows from './customShadows'
import typography from './typography'

// 外部フェッチを伴わない安全なフォントファミリーを定義
// （必要に応じてグローバル <link> で Google Fonts を読み込めばブラウザー側で適用されます）
const safeInterFontFamily = [
  'Inter',
  'Noto Sans JP',
  'sans-serif',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"'
].join(',')

const theme = (mode, direction) => {
  return {
    direction,
    components: overrides(),
    colorSchemes: colorSchemes(),
    ...spacing,
    shape: {
      borderRadius: 6,
      customBorderRadius: {
        xs: 2,
        sm: 4,
        md: 6,
        lg: 8,
        xl: 10
      }
    },
    shadows: shadows(mode),

  // next/font を使わずにフォントファミリーを直接指定
  typography: typography(safeInterFontFamily),
    customShadows: customShadows(mode),
    mainColorChannels: {
      light: '46 38 61',
      dark: '231 227 252',
      lightShadow: '46 38 61',
      darkShadow: '19 17 32'
    }
  }
}

export default theme
