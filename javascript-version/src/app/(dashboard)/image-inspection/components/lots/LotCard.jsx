/*
======== ファイル概要 ========
ロットの代表画像とカメラ判定をカード形式で表示し、詳細モーダル起動の入り口となるコンポーネント。
カメラ数が多い場合のサマリ表示や不良詳細の強調も担う。
*/

import { useCallback, useEffect, useMemo, useState } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { getFallbackImageBase, toImageUrl } from '../../utils/imageUrl'

const fallbackImageBase = getFallbackImageBase()
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
const FALLBACK_IMG = `${basePath}/images/pages/CameraNotFound.png`
const SUMMARY_THRESHOLD = 8

/**
 * APIから返る相対/絶対パスの表記ゆれを正規化して画像URLに利用しやすくする。
 * @param {string} path - 元の画像パス。
 * @returns {string|null} 正規化済みパス。
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
 * OK/NG といった別表記を PASS/FAIL/MISSING へ揃える。
 * @param {string} status - 判定文字列。
 * @returns {string}      正規化結果。
 */
const normalizeStatusLabel = status => {
  const normalized = (status || '').toString().trim().toUpperCase()
  if (!normalized) return ''
  if (normalized === 'OK') return 'PASS'
  if (normalized === 'NG') return 'FAIL'
  return normalized
}

/**
 * ステータスに応じて MUI Chip のカラートークンを決定する。
 * @param {string} status - 判定文字列。
 * @returns {'success'|'error'|'warning'|'default'} 色指定。
 */
const getChipColor = status => {
  const normalized = normalizeStatusLabel(status)
  if (normalized === 'PASS') return 'success'
  if (normalized === 'FAIL') return 'error'
  if (normalized === 'MISSING') return 'warning'
  return 'default'
}

/**
 * 並び替え用の優先度を返す。不良系を先に並べたいときに使用。
 * @param {string} status - 判定文字列。
 * @returns {number}      小さいほど優先。
 */
const getStatusPriority = status => {
  const normalized = normalizeStatusLabel(status)
  if (normalized === 'FAIL') return 0
  if (normalized === 'MISSING') return 1
  if (normalized === 'PASS') return 2
  if (normalized === 'UNKNOWN') return 3
  return 4
}

/**
 * カメラ/シーケンスに紐づく最適な表示名を推定する。
 * @param {object} item - カメラ情報。
 * @param {number} index - 配列インデックス（フォールバック用）。
 * @returns {string} 表示名。
 */
const resolveDisplayName = (item, index) => {
  const candidates = [item?.name, item?.label, item?.camera_id, item?.cameraId, item?.rawSequence]
  for (const candidate of candidates) {
    if (candidate === undefined || candidate === null) continue
    const text = String(candidate).trim()
    if (!text || text === '-' || text === '--') continue
    return text
  }
  return `#${index + 1}`
}

/**
 * ロット概要カード。代表画像、ロット情報、カメラ判定をまとめて表示する。
 * @param {object} props             - コンポーネント引数。
 * @param {object} props.lot         - ロットデータ。
 * @param {string} [props.lotStatus] - 全体判定。
 * @param {Function} props.onOpen    - クリック時のモーダルオープンハンドラ。
 * @param {boolean} [props.isActive] - 選択中スタイルを出すかどうか。
 * @returns {JSX.Element|null}        レイアウト済みカード。
 */
const LotCard = ({
  lot,
  lotStatus,
  onOpen,
  isActive = false,
}) => {
  const cameraList = useMemo(() => {
    if (!lot || !Array.isArray(lot.cameras)) return []
    return lot.cameras
  }, [lot])
  const shouldSummarize = cameraList.length > SUMMARY_THRESHOLD
  const [showAllCameras, setShowAllCameras] = useState(false)
  const showDetailedView = !shouldSummarize || showAllCameras

  useEffect(() => {
    setShowAllCameras(false)
  }, [lot?.lotId])

  /**
   * 代表画像のURLセットを生成し、フォールバックを確保する。
   * @param {string} path - APIから受け取った画像パス。
   * @returns {{primary: string, fallback: string}} 表示用URL。
   */
  const buildImageSources = useCallback((path) => {
    const normalized = normalizeRelativePath(path)
    if (!normalized) return { primary: FALLBACK_IMG, fallback: '' }
    const primary = toImageUrl(normalized)
    const fallback = fallbackImageBase ? toImageUrl(normalized, { base: fallbackImageBase }) : ''
    return {
      primary: primary || FALLBACK_IMG,
      fallback: fallback && fallback !== primary ? fallback : '',
    }
  }, [])

  /**
   * 画像失敗時にフォールバック→固定画像の順で差し替える。
   * @param {React.SyntheticEvent<HTMLImageElement>} event - onErrorイベント。
   * @param {string} fallbackSrc                          - 第二候補URL。
   */
  const handleImageError = (event, fallbackSrc) => {
    const target = event.currentTarget
    if (fallbackSrc && !target.dataset.fallbackTried) {
      target.dataset.fallbackTried = 'true'
      target.src = fallbackSrc
    } else if (target.src !== FALLBACK_IMG) {
      target.src = FALLBACK_IMG
    }
  }

  const representativeSources = useMemo(
    () => buildImageSources(lot?.representativeImage),
    [buildImageSources, lot?.representativeImage],
  )

  const cameraStatusSummary = useMemo(() => {
    if (!shouldSummarize) return []
    const summaryMap = new Map()

    cameraList.forEach(camera => {
      const rawLabel = camera?.status ?? 'UNKNOWN'
      const normalized = normalizeStatusLabel(rawLabel) || 'UNKNOWN'
      const displayLabel = normalized
      const current = summaryMap.get(normalized)

      if (current) {
        current.count += 1
      } else {
        summaryMap.set(normalized, {
          normalized,
          displayLabel,
          count: 1,
        })
      }
    })

    return Array.from(summaryMap.values()).sort((a, b) => {
      const priorityDiff = getStatusPriority(a.normalized) - getStatusPriority(b.normalized)
      if (priorityDiff !== 0) return priorityDiff
      if (b.count !== a.count) return b.count - a.count
      return a.displayLabel.localeCompare(b.displayLabel)
    })
  }, [cameraList, shouldSummarize])

  const problematicDetails = useMemo(() => {
    return cameraList.reduce((accumulator, camera, index) => {
      const normalizedStatus = normalizeStatusLabel(camera.status)
      if (normalizedStatus !== 'PASS' && camera.details && camera.details !== '-') {
        accumulator.push({ camera, index, status: normalizedStatus })
      }
      return accumulator
    }, [])
  }, [cameraList])

  if (!lot) return null

  const normalizedLotStatus = (lotStatus || '').toString().trim().toUpperCase()
  const chipColor = normalizedLotStatus === 'PASS'
    ? 'success'
    : normalizedLotStatus === 'FAIL'
      ? 'error'
      : normalizedLotStatus === 'MISSING'
        ? 'warning'
        : 'default'
  const lotStatusLabel = normalizedLotStatus || '-'

  // ======== 処理ステップ: 代表画像 → 判定概要 → 詳細チップ ========
  // 1. 代表画像ではhandleImageErrorを紐付けて通信エラー時の視覚欠損を防ぐ。
  // 2. 判定概要ブロックでロットID・総合結果・要約チップを表示し、問題箇所を一目で把握させる。
  // 3. 詳細チップ/不良詳細を展開し、showAllCamerasを切り替えて情報量を制御する。
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderColor: isActive ? 'primary.main' : undefined,
        boxShadow: isActive ? theme => `0 0 0 1px ${theme.palette.primary.main}` : undefined,
      }}
    >
      <CardActionArea
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
        onClick={onOpen}
      >
        <Box
          sx={{
            position: 'relative',
            aspectRatio: '16/9',
            bgcolor: theme => (theme.palette.mode === 'dark' ? 'grey.900' : 'grey.200'),
            overflow: 'hidden',
          }}
        >
          <img
            src={representativeSources.primary}
            alt={lot.representativeImage ? `${lot.lotId} representative` : 'placeholder'}
            onError={e => handleImageError(e, representativeSources.fallback)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none', userSelect: 'none' }}
            draggable={false}
          />
        </Box>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1, width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1.5 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {lot.date} {lot.time}
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {lot.lotId}
              </Typography>
            </Box>
            <Chip label={lotStatusLabel} color={chipColor} size="small" variant="filled" />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              判定要素
            </Typography>
            {shouldSummarize && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {cameraStatusSummary.map(summary => (
                  <Chip
                    key={summary.normalized}
                    label={`${summary.displayLabel}: ${summary.count}件`}
                    size="small"
                    color={getChipColor(summary.displayLabel)}
                    variant={summary.normalized === 'PASS' ? 'outlined' : 'filled'}
                  />
                ))}
              </Box>
            )}
            {showDetailedView && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {cameraList.map((camera, index) => {
                  const normalizedCameraStatus = normalizeStatusLabel(camera.status) || 'UNKNOWN'
                  const label = resolveDisplayName(camera, index)
                  const statusLabel = normalizedCameraStatus || 'UNKNOWN'

                  return (
                    <Chip
                      key={`${label}-${index}`}
                      label={`${label}: ${statusLabel}`}
                      size="small"
                      color={getChipColor(statusLabel)}
                      variant={normalizedCameraStatus === 'PASS' ? 'outlined' : 'filled'}
                    />
                  )
                })}
              </Box>
            )}
            {shouldSummarize && (
              <Button
                size="small"
                variant="text"
                onClick={() => setShowAllCameras(prev => !prev)}
                sx={{ alignSelf: 'flex-start', mt: 1, px: 0 }}
              >
                {showAllCameras ? '概要に戻す' : `詳細を見る (${cameraList.length}項目)`}
              </Button>
            )}
            {showDetailedView && problematicDetails.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {problematicDetails.map(({ camera, index, status }) => {
                  const detailColor = status === 'MISSING' ? 'warning.main' : 'error.main'
                  const label = resolveDisplayName(camera, index)

                  return (
                    <Typography key={`${label}-${index}-detail`} variant="caption" color={detailColor}>
                      {label}: {camera.details}
                    </Typography>
                  )
                })}
              </Box>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default LotCard
