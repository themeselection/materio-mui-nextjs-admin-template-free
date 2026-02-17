/*
======== ファイル概要 ========
従業員名簿機能で使う API ユーティリティ集。トークン取得やカラーコード整形をまとめる。
*/

/**
 * ローカル保存済みのアクセストークンを取得する。
 * @returns {string} - 現在ログイン中のトークン。未ログイン時は空文字。
 */
export const getToken = () =>
  (typeof window !== 'undefined' && (window.localStorage.getItem('access_token') || window.sessionStorage.getItem('access_token'))) || ''

/**
 * API 呼び出し用の認証ヘッダーを生成する。
 * @returns {Record<string, string>} - Authorization ヘッダー。トークン未取得時は空オブジェクト。
 */
export const getAuthHeaders = () => {
  const token = getToken()

  return token ? { Authorization: `Bearer ${token}` } : {} // トークンが未取得なら未認証 API と同等に扱う。
}

/**
 * カラーコードにハッシュを付与して正規化する。
 * @param {string} hex - 6 桁または # 付きカラーコード。
 * @returns {string}   - ハッシュ付きのカラーコード。
 */
export const ensureHash = hex => {
  if (!hex) return '#999999'

  return String(hex).startsWith('#') ? String(hex) : `#${hex}`
}

/**
 * 先頭のハッシュを取り除いたカラーコードを返す。
 * @param {string} hex - ハッシュ付きまたはなしのカラーコード。
 * @returns {string}   - ハッシュなしのカラーコード。
 */
export const stripHash = hex => (hex || '').replace(/^#/, '')
