/*
======== ファイル概要 ========
単一カメラのプレビュー画像とステータスラベルをカード表示するプレゼンテーション層。
フォールバック画像や事後/事前撮影URLの補完もここで吸収する。
*/

import { useCallback, useMemo } from 'react'

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

import { getFallbackImageBase, toAfterTestUrl, toBeforeTestUrl, toImageUrl } from '../../utils/imageUrl'

const fallbackImageBase = getFallbackImageBase()
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
const FALLBACK_IMG = `${basePath}/images/pages/CameraNotFound.png`

/**
 * 画像パスに混在するバックスラッシュや余計なスラッシュを吸収して
 * APIから届く相対/絶対パスを正規化する。
 * @param {string} path - 元の画像パス。
 * @returns {string|null} 正規化済みのパス。空なら null。
 */
const normalizeRelativePath = path => {
  if (!path) return null
  const trimmed = String(path).trim()
  if (!trimmed) return null
  const sanitized = trimmed.replace(/\\/g, '/')
  if (/^https?:\/\//i.test(sanitized)) {
    const [protocol, rest] = sanitized.split('://')
    if (!rest) return sanitized
    const cleanedRest = rest.replace(/\/{3,}/g, '//')
    return `${protocol}://${cleanedRest}`
  }
  const withLeading = sanitized.startsWith('/') ? sanitized : `/${sanitized}`
  return withLeading.replace(/\/{3,}/g, '//')
}

/**
 * OK/NGなどの表記ゆれをPASS/FAILへ丸め込む。
 * @param {string} status - 生ステータス文字列。
 * @returns {string}      正規化済みステータス。
 * 
 * 【Note】最初から仕様決めとかないからこういうよくわかんない関数必要になるねんて
 */
const normalizeStatusLabel = status => {
  const normalized = (status || '').toString().trim().toUpperCase()
  if (!normalized) return ''
  if (normalized === 'OK') return 'PASS'
  if (normalized === 'NG') return 'FAIL'
  return normalized
}

/**
 * カメラ1台分のカード。画像読み込み失敗時はフォールバックを順に試す。
 * @param {object} props          - コンポーネント引数。
 * @param {string} props.name     - カメラ表示名。
 * @param {string} props.status   - 判定ステータス。
 * @param {boolean} props.isSingle - 単独表示かどうか。
 * @param {string} props.imagePath - 元画像パス。
 * @returns {JSX.Element}          プレビュー付きのカメラカード。
 */
const CameraTile = ({ name, status = 'PASS', isSingle = false, imagePath }) => {
  const canonicalStatus = normalizeStatusLabel(status)
  const normalizedStatus = canonicalStatus || (status || '').toString().trim().toUpperCase() || 'UNKNOWN'

  const chipColor = normalizedStatus === 'PASS'
    ? 'success'
    : normalizedStatus === 'MISSING'
      ? 'warning'
      : normalizedStatus === 'UNKNOWN'
        ? 'default'
        : 'error'

  const label = normalizedStatus

  /**
   * ステータスとパスから最適なURL組み合わせを決め、フォールバックも用意する。
   * 画像DBの before/after を切り替えることで撮影タイミングに即した参照先を選ぶ。
   * @returns {{primary: string, fallback: string}} 読み込み順のURLセット。
   */
  const buildImageSources = useCallback(() => {
    const normalizedPath = normalizeRelativePath(imagePath)
    if (!normalizedPath) {
      return { primary: FALLBACK_IMG, fallback: '' }
    }

    const hasFallbackBase = Boolean(fallbackImageBase)

    const buildPair = builder => {
      const primaryCandidate = builder(normalizedPath)
      const fallbackCandidate = hasFallbackBase ? builder(normalizedPath, { base: fallbackImageBase }) : ''
      return { primary: primaryCandidate, fallback: fallbackCandidate }
    }

    const ensureUrl = pair => {
      if (pair.primary) return pair
      const primaryCandidate = toImageUrl(normalizedPath)
      const fallbackCandidate = hasFallbackBase ? toImageUrl(normalizedPath, { base: fallbackImageBase }) : ''
      return { primary: primaryCandidate, fallback: fallbackCandidate }
    }

    const hasExplicitRoot = normalizedPath.includes('/imageDB/') || /^https?:\/\//i.test(normalizedPath)
    if (hasExplicitRoot) {
      const primaryCandidate = toImageUrl(normalizedPath)
      const fallbackCandidate = hasFallbackBase ? toImageUrl(normalizedPath, { base: fallbackImageBase }) : ''
      const primary = primaryCandidate || FALLBACK_IMG
      const fallback = fallbackCandidate && fallbackCandidate !== primary ? fallbackCandidate : ''
      return { primary, fallback }
    }

    let pair
    if (normalizedStatus === 'MISSING') {
      pair = ensureUrl(buildPair((path, options) => toBeforeTestUrl(path, options)))
    } else if (normalizedStatus === 'PASS' || normalizedStatus === 'FAIL') {
      pair = ensureUrl(buildPair((path, options) => toAfterTestUrl(path, options)))
    } else {
      pair = ensureUrl(buildPair((path, options) => toImageUrl(path, options)))
    }

    const primary = pair.primary || FALLBACK_IMG
    const fallback = pair.fallback && pair.fallback !== primary ? pair.fallback : ''
    return { primary, fallback }
  }, [imagePath, normalizedStatus])

  const imageSources = useMemo(() => buildImageSources(), [buildImageSources])

  /**
   * 画像読み込み失敗時にフォールバックを段階的に試す。最終手段は固定のノーフォト画像。
   * @param {React.SyntheticEvent<HTMLImageElement>} event - onErrorイベント。
   */
  const handleImageError = useCallback((event) => {
    const target = event.currentTarget
    if (imageSources.fallback && !target.dataset.fallbackTried) {
      target.dataset.fallbackTried = 'true'
      target.src = imageSources.fallback
    } else if (target.src !== FALLBACK_IMG) {
      target.src = FALLBACK_IMG
    }
  }, [imageSources.fallback])

  // 描画
  // ======== 処理ステップ: ソース算出 → フォールバック制御 → オーバーレイ描画 ========
  // 1. buildImageSourcesで最適なURLを決めておき、描画時に確実に同じ順序で利用する。
  // 2. handleImageErrorでロード失敗時にフォールバックへ切り替え、最後の砦としてFALLBACK_IMGを使う。
  // 3. オーバーレイ描画では名前とステータスを同じ位置に出し、どの画像か即座に理解できるようにする。
  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 2,
        aspectRatio: '16/9',
        overflow: 'hidden',
      }}
    >
      <img
        src={imageSources.primary}
        alt={imagePath ? `${name} latest capture` : 'placeholder'}
        onError={handleImageError}
        draggable={false}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          px: isSingle ? 4 : 2,
          py: isSingle ? 3 : 1.5,
          background: theme => `linear-gradient(to top, ${theme.palette.grey[900]}dd 0%, transparent 60%)`,
        }}
      >
        <Typography color="common.white" fontWeight={600} variant={isSingle ? 'h5' : 'body1'} sx={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
          {name}
        </Typography>
        <Chip
          label={label}
          size={isSingle ? 'medium' : 'small'}
          color={chipColor}
          variant="filled"
          sx={{ fontSize: isSingle ? '1rem' : '0.75rem', fontWeight: 600 }}
        />
      </Box>
    </Box>
  )
}

export default CameraTile
