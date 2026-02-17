/*
======== ファイル概要 ========
画像パスを現在ホストの3001番ポートへマッピングするためのURLユーティリティ群。
before/after撮影の自動切り替えも提供する。
*/

const stripTrailingSlash = value => (value || '').replace(/\/$/, '')

const ensureProtocol = value => {
  if (!value) return ''
  return /^https?:\/\//i.test(value) ? value : `http://${value}`
}

const normalizeBase = value => {
  const trimmed = stripTrailingSlash((value || '').trim())
  if (!trimmed) return ''
  return stripTrailingSlash(ensureProtocol(trimmed))
}

/**
 * ベースURLを決定する。環境変数での上書きがなければ実行中ホスト:3001を参照。
 * @returns {string} ベースURL。
 */
export const getImageBase = () => {
  const override = normalizeBase(process.env.NEXT_PUBLIC_IMAGE_BASE)
  if (override) return override
  if (typeof window !== 'undefined') return `http://${window.location.hostname}:3001`
  // SSR等ウィンドウ未定義時のフォールバック
  return 'http://localhost:3001'
}

const FALLBACK_DEFAULT_BASE = 'http://10.100.54.170:3001'

/**
 * フォールバック用のベースURLを返す。環境変数未設定時は固定IPを使う。
 * @returns {string} フォールバックベース。
 */
export const getFallbackImageBase = () => normalizeBase(process.env.NEXT_PUBLIC_IMAGE_FALLBACK_BASE) || FALLBACK_DEFAULT_BASE

const buildUrlWithBase = (p, base) => {
  if (!p) return ''
  if (/^https?:\/\//i.test(p)) return p
  const resolvedBase = stripTrailingSlash(base || '')
  if (!resolvedBase) return p
  return p.startsWith('/') ? `${resolvedBase}${p}` : `${resolvedBase}/${p}`
}

/**
 * 任意のパス/URLを、指定ベース or 現在ホストを基点にした絶対URLへ変換する。
 * @param {string} p - 元のパス。
 * @param {object} [options]
 * @param {string} [options.base] - ベースURLを強制指定したい場合。
 * @returns {string}               完全URL。
 */
export const toImageUrl = (p, options = {}) => buildUrlWithBase(p, options.base || getImageBase())

export default toImageUrl

/**
 * beforeTest階層の画像URLを生成する。
 * @param {string} p          - 元のパス/URL。
 * @param {object} [options]
 * @param {string} [options.base] - ベースURLの上書き。
 * @returns {string}               完全URLまたは空文字。
 */
export const toBeforeTestUrl = (p, options = {}) => {
  /*
  ======== ロジック説明 ========
  beforeTest ディレクトリは検査前の基準画像を指すため、ファイル名が取れた場合のみ貼り付ける。
  */
  const fname = (p || '').split('/').pop() || ''
  if (!fname) return ''
  const base = stripTrailingSlash(options.base || getImageBase())
  if (!base) return ''
  return `${base}/imageDB/beforeTest/${fname}`
}

/**
 * afterTest階層の画像URLを生成する。
 * @param {string} p          - 元のパス/URL。
 * @param {object} [options]
 * @param {string} [options.base] - ベースURL。
 * @returns {string}               完全URLまたは空文字。
 */
export const toAfterTestUrl = (p, options = {}) => {
  /*
  ======== ロジック説明 ========
  afterTest 側は検査後の画像を格納するため、ファイル名を抽出できない場合は空文字でエラーを避ける。
  */
  const fname = (p || '').split('/').pop() || ''
  if (!fname) return ''
  const base = stripTrailingSlash(options.base || getImageBase())
  if (!base) return ''
  return `${base}/imageDB/afterTest/${fname}`
}
