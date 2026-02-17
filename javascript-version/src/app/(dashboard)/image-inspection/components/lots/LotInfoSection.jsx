/*
======== ファイル概要 ========
ロット詳細モーダル内で代表画像プレビュー、サマリー、判定チップをまとめて表示する情報ブロック。
サマリーの折り畳みや追加サマリーもここで一括制御する。
*/

import { useCallback, useEffect, useMemo, useState } from 'react'

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import ShotsSummaryBlock from './ShotsSummaryBlock'
import { normalizeShotSummary } from '../../utils/summaryUtils'

/**
 * カメラ/シーケンスの表示名を推測する。
 * @param {object} item - カメラ情報。
 * @param {number} index - フォールバック用インデックス。
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

const SUMMARY_THRESHOLD = 8

/**
 * OK/NGを含む判定をPASS/FAILへ揃える。
 * @param {string} status - 判定。
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
 * サマリーチップを FAIL→MISSING→PASS の順に並べるための優先度。
 * @param {string} status - 判定。
 * @returns {number}      並び替え用数値。
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
 * ロット情報セクション。代表画像、サマリー、判定チップをまとめたモジュール。
 * @param {object} props                           - プロパティ集合。
 * @param {object} props.lot                       - 対象ロット。
 * @param {{primary:string,fallback:string}} props.representativeSources - プレビュー用URL。
 * @param {Function} props.handleImageError        - 画像エラー時の処理。
 * @param {Function} props.setLightbox             - ライトボックス制御関数。
 * @param {Function} props.getChipColor            - ステータス別カラー取得関数。
 * @param {Array}   [props.statusItems]            - 明示的に表示するステータス配列。
 * @param {object}  [props.summary]                - サマリー数値。
 * @param {Array}   [props.summaryItems]           - サマリー生成用の元配列。
 * @param {string}  [props.summaryLabel='検査サマリー'] - メインサマリーの見出し。
 * @param {Array}   [props.additionalSummaries=[]] - 追加サマリー。
 * @returns {JSX.Element|null}                      レイアウト済みセクション。
 */
const LotInfoSection = ({
  lot,
  representativeSources,
  handleImageError,
  setLightbox,
  getChipColor,
  statusItems,
  summary,
  summaryItems,
  summaryLabel = '検査サマリー',
  additionalSummaries = [],
}) => {
  const chips = useMemo(() => {
    if (Array.isArray(statusItems) && statusItems.length > 0) return statusItems
    if (lot && Array.isArray(lot.cameras)) return lot.cameras
    return []
  }, [lot, statusItems])

  const normalizedAdditionalSummaries = useMemo(
    () => (Array.isArray(additionalSummaries) ? additionalSummaries : []),
    [additionalSummaries],
  )

  const shouldSummarize = chips.length > SUMMARY_THRESHOLD
  const [showAllChips, setShowAllChips] = useState(false)
  const showDetailedChips = !shouldSummarize || showAllChips

  useEffect(() => {
    setShowAllChips(false)
  }, [lot?.lotId])

  const chipSummary = useMemo(() => {
    if (!shouldSummarize) return []
    const summaryMap = new Map()

    chips.forEach(item => {
      const statusValue = item?.status ?? 'UNKNOWN'
      const normalized = normalizeStatusLabel(statusValue) || 'UNKNOWN'
      const displayLabel = normalized
      const existing = summaryMap.get(normalized)

      if (existing) {
        existing.count += 1
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
  }, [chips, shouldSummarize])

  const previewSources = useMemo(
    () => representativeSources || { primary: '', fallback: '' },
    [representativeSources],
  )

  const handlePreview = useCallback(() => {
    if (!setLightbox || !lot) return
    setLightbox({
      open: true,
      src: previewSources.primary,
      fallback: previewSources.fallback,
      alt: lot.representativeImage ? `${lot.lotId} representative` : 'placeholder',
    })
  }, [lot, previewSources, setLightbox])

  if (!lot) return null

  const summaryBlocks = []
  const primaryFallbackItems = Array.isArray(summaryItems) ? summaryItems : chips
  const primarySummary = normalizeShotSummary(summary, primaryFallbackItems)
  if (primarySummary) {
    summaryBlocks.push({ label: summaryLabel, data: primarySummary })
  }

  normalizedAdditionalSummaries.forEach((entry, index) => {
    const resolved = normalizeShotSummary(entry?.summary, entry?.items)
    if (resolved) {
      summaryBlocks.push({ label: entry?.label || `サマリー${index + 1}`, data: resolved })
    }
  })

  // ======== 処理ステップ: プレビュー → サマリー → 判定チップ ========
  // 1. プレビュー画像はライトボックスと連動させ、代表画像の拡大確認を容易にする。
  // 2. サマリーではprimarySummaryと追加サマリーを横並びで描画し、ショット種別ごとの傾向を比較しやすくする。
  // 3. 判定チップでは概要→詳細→問題箇所ボタンの順にレイヤー化し、必要なときだけ詳細表示する理由は情報過多を避けるため。
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box
        sx={{
          width: '100%',
          aspectRatio: '16/9',
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: theme => (theme.palette.mode === 'dark' ? 'grey.900' : 'grey.200'),
          cursor: 'zoom-in',
        }}
        onClick={handlePreview}
      >
        <img
          src={previewSources.primary}
          alt={lot.representativeImage ? `${lot.lotId} representative` : 'placeholder'}
          onError={e => handleImageError(e, previewSources.fallback)}
          draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>

      {summaryBlocks.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {summaryBlocks.map((block, index) => (
            <ShotsSummaryBlock key={block.label || index} title={block.label} summary={block.data} />
          ))}
        </Box>
      )}

      <Divider flexItem />

      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          判定要素
        </Typography>
        {shouldSummarize && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: showDetailedChips ? 1.5 : 0 }}>
            {chipSummary.map(summary => (
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
        {showDetailedChips && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {chips.map((item, index) => {
              const normalizedStatus = normalizeStatusLabel(item?.status) || 'UNKNOWN'
              const label = resolveDisplayName(item, index)
              const statusLabel = normalizedStatus || 'UNKNOWN'

              return (
                <Chip
                  key={`${label}-${index}`}
                  label={`${label}: ${statusLabel}`}
                  size="small"
                  color={getChipColor(statusLabel)}
                  variant={normalizedStatus === 'PASS' ? 'outlined' : 'filled'}
                />
              )
            })}
          </Box>
        )}
        {shouldSummarize && (
          <Button
            size="small"
            variant="text"
            onClick={() => setShowAllChips(prev => !prev)}
            sx={{ mt: 1.5, px: 0 }}
          >
            {showAllChips ? '概要に戻す' : `詳細を見る (${chips.length}項目)`}
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default LotInfoSection
