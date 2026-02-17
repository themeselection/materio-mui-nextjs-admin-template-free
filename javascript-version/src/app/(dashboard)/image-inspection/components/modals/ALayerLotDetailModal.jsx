/*
======== ファイル概要 ========
A層ロットの詳細をモーダルで表示し、4K/FHD撮影マップや代表画像・サマリーを統合的に扱う。
シーケンス座標の補完や画像フォールバックも含めた高機能モーダル実装。
*/

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'

import { getFallbackImageBase, toAfterTestUrl, toBeforeTestUrl, toImageUrl } from '../../utils/imageUrl'
import { normalizeShotSummary } from '../../utils/summaryUtils'
import FourKMapSection from './FourKMapSection'
import LotInfoSection from '../lots/LotInfoSection'

const fallbackImageBase = getFallbackImageBase()
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
const FALLBACK_IMG = `${basePath}/images/pages/CameraNotFound.png`
const MIN_GRID_ROWS = 5
const MIN_GRID_COLS = 4

/**
 * 画像パス文字列から余分なスラッシュを取り除き、絶対/相対を正規化する。
 * @param {string} path - 元のパス。
 * @returns {string|null} 正規化結果。
 */
const normalizeRelativePath = path => {
  if (!path) return null
  const trimmed = String(path).trim()
  if (!trimmed) return null
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  const cleaned = trimmed.replace(/\/{2,}/g, '/')
  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`
}

/**
 * OK/NGのような表記をPASS/FAIL/MISSINGへ統一する。
 * @param {string} status - 判定。
 * @returns {string}      正規化結果。
 */
const normalizeStatusLabel = status => {
  const normalized = (status || '').toString().trim().toUpperCase()
  if (normalized === 'OK') return 'PASS'
  if (normalized === 'NG') return 'FAIL'
  return normalized
}

/**
 * ロット全体のChipカラーを算出する。
 * @param {string} status - 判定。
 * @returns {'success'|'error'|'warning'|'default'} 色キー。
 */
const getLotStatusColor = status => {
  const normalized = normalizeStatusLabel(status)
  if (normalized === 'PASS') return 'success'
  if (normalized === 'FAIL') return 'error'
  if (normalized === 'MISSING') return 'warning'
  return 'default'
}

/**
 * 個別チップ表示用のカラーを返す。
 * @param {string} status - 判定。
 * @returns {'success'|'error'|'warning'|'default'} 色キー。
 */
const getChipColor = status => {
  const normalized = normalizeStatusLabel(status)
  if (normalized === 'PASS') return 'success'
  if (normalized === 'FAIL') return 'error'
  if (normalized === 'MISSING') return 'warning'
  return 'default'
}

/**
 * ショットカードに使う色指定を返す。
 * @param {string} status - 判定。
 * @returns {'success'|'error'|'warning'|'default'} 色キー。
 */
const getShotStatusColor = status => {
  const normalized = normalizeStatusLabel(status)
  if (normalized === 'PASS') return 'success'
  if (normalized === 'FAIL') return 'error'
  if (normalized === 'MISSING') return 'warning'
  return 'default'
}

/**
 * Excel風の列記法(A,B...AA)を0始まりインデックスへ変換する。
 * @param {string} letters - 行ラベル。
 * @returns {number}        0始まりインデックス。
 */
const toRowIndex = letters => {
  return letters.split('').reduce((acc, char) => acc * 26 + (char.charCodeAt(0) - 64), 0) - 1
}

/**
 * 0始まりインデックスをExcel風ラベルへ戻す。
 * @param {number} index - 行インデックス。
 * @returns {string}      ラベル文字列。
 */
const fromRowIndex = index => {
  if (!Number.isFinite(index) || index < 0) return ''
  let value = Math.floor(index) + 1
  let label = ''

  while (value > 0) {
    const remainder = (value - 1) % 26
    label = String.fromCharCode(65 + remainder) + label
    value = Math.floor((value - 1) / 26)
  }

  return label
}

/**
 * A-12 のようなシーケンスを構造化情報へ分解する。
 * @param {string} value - 元の表記。
 * @returns {object|null} 行列ラベルとインデックスを含む情報。
 */
const parseShotSequence = value => {
  if (!value) return null
  const raw = String(value).trim().toUpperCase()
  if (!raw) return null
  const match = raw.match(/^([A-Z]+)[-_]?(\d+)$/)
  if (!match) return null
  const [, rowLabel, colLabelRaw] = match
  const colNumber = parseInt(colLabelRaw, 10)
  if (!Number.isFinite(colNumber) || colNumber <= 0) return null
  const rowIndex = toRowIndex(rowLabel)
  if (rowIndex < 0) return null
  return {
    raw,
    label: `${rowLabel}-${colNumber}`,
    rowLabel,
    colLabel: String(colNumber),
    rowIndex,
    colIndex: colNumber - 1,
  }
}

/**
 * 実データがスカスカな場合でも一定行数のグリッドを保つために不足分を補完する。
 * @param {Array} currentRows - 既存行。
 * @param {number} [minCount=MIN_GRID_ROWS] - 最低行数。
 * @returns {Array} 補完後行配列。
 */
const ensureRowCoverage = (currentRows, minCount = MIN_GRID_ROWS) => {
  if (currentRows.length === 0) {
    const baseRows = []
    for (let idx = 0; idx < minCount; idx += 1) {
      baseRows.push({ label: fromRowIndex(idx), index: idx, placeholder: true })
    }
    return baseRows
  }

  const rowsByIndex = new Map(currentRows.map(row => [row.index, row]))
  const startIndex = currentRows[0].index
  const maxIndex = currentRows[currentRows.length - 1].index
  let endIndex = Math.max(maxIndex, startIndex + minCount - 1)
  const result = []

  for (let idx = startIndex; idx <= endIndex; idx += 1) {
    const existing = rowsByIndex.get(idx)
    if (existing) {
      result.push(existing)
    } else {
      result.push({ label: fromRowIndex(idx), index: idx, placeholder: true })
    }
  }

  while (result.length < minCount) {
    endIndex += 1
    result.push({ label: fromRowIndex(endIndex), index: endIndex, placeholder: true })
  }

  return result
}

/**
 * 列方向の不足を補完して均一なマップを保つ。
 * @param {Array} currentCols - 既存列。
 * @param {number} [minCount=MIN_GRID_COLS] - 最低列数。
 * @returns {Array} 補完後列配列。
 */
const ensureColCoverage = (currentCols, minCount = MIN_GRID_COLS) => {
  if (currentCols.length === 0) {
    const baseCols = []
    for (let idx = 0; idx < minCount; idx += 1) {
      baseCols.push({ label: String(idx + 1), index: idx, placeholder: true })
    }
    return baseCols
  }

  const colsByIndex = new Map(currentCols.map(col => [col.index, col]))
  const startIndex = currentCols[0].index
  const maxIndex = currentCols[currentCols.length - 1].index
  let endIndex = Math.max(maxIndex, startIndex + minCount - 1)
  const result = []

  for (let idx = startIndex; idx <= endIndex; idx += 1) {
    const existing = colsByIndex.get(idx)
    if (existing) {
      result.push(existing)
    } else {
      result.push({ label: String(idx + 1), index: idx, placeholder: true })
    }
  }

  while (result.length < minCount) {
    endIndex += 1
    result.push({ label: String(endIndex + 1), index: endIndex, placeholder: true })
  }

  return result
}

/**
 * ショット配列から行列ラベルおよびセル構造を生成する。
 * @param {Array} shots - 撮影結果配列。
 * @param {object} [options] - シーケンス抽出方法など。
 * @returns {object} rows/cols/cells を含む構造体。
 */
const buildGridStructure = (shots, options = {}) => {
  const {
    sequenceExtractor = shot => shot?.['c4k_seq'] ?? shot?.four_k_seq ?? shot?.seq,
    minRows = MIN_GRID_ROWS,
    minCols = MIN_GRID_COLS,
  } = options

  const entries = (shots || [])
    .map(shot => {
      const seqValue = sequenceExtractor(shot)
      const parsed = parseShotSequence(seqValue)
      if (!parsed) return null
      return { shot, sequence: parsed }
    })
    .filter(Boolean)

  const rowMap = new Map()
  const colMap = new Map()
  const cellMap = new Map()

  entries.forEach(({ sequence, shot }) => {
    if (!rowMap.has(sequence.rowLabel)) {
      rowMap.set(sequence.rowLabel, { label: sequence.rowLabel, index: sequence.rowIndex })
    }
    if (!colMap.has(sequence.colLabel)) {
      colMap.set(sequence.colLabel, { label: sequence.colLabel, index: sequence.colIndex })
    }
    const existing = cellMap.get(sequence.label)
    if (existing) {
      existing.shots.push(shot)
    } else {
      cellMap.set(sequence.label, { sequence, shots: [shot] })
    }
  })

  let rows = Array.from(rowMap.values()).sort((a, b) => a.index - b.index)
  let cols = Array.from(colMap.values()).sort((a, b) => a.index - b.index)

  rows = ensureRowCoverage(rows, minRows)
  cols = ensureColCoverage(cols, minCols)

  const cells = []
  cells.push({ type: 'corner', key: 'corner' })
  cols.forEach(col => {
    cells.push({ type: 'colHeader', key: `col-${col.label}`, col })
  })
  rows.forEach(row => {
    cells.push({ type: 'rowHeader', key: `row-${row.label}`, row })
    cols.forEach(col => {
      const label = `${row.label}-${col.label}`
      const entry = cellMap.get(label) || null
      cells.push({ type: 'cell', key: `cell-${label}`, row, col, entry })
    })
  })

  return {
    rows,
    cols,
    cells,
    hasEntries: entries.length > 0,
  }
}

const STATUS_PRIORITY = ['FAIL', 'MISSING', 'PASS']
/**
 * FAIL優先で複数ショットから代表画像を選定する。
 * @param {Array} shots - ショット配列。
 * @returns {object|null} 代表ショット。
 */
const pickRepresentativeShot = shots => {
  if (!Array.isArray(shots) || shots.length === 0) return null
  const normalized = shots
    .map(shot => {
      const status = normalizeStatusLabel(shot?.status)
      const priority = STATUS_PRIORITY.indexOf(status)
      return {
        shot,
        priority: priority >= 0 ? priority : STATUS_PRIORITY.length,
      }
    })
    .sort((a, b) => a.priority - b.priority)

  return normalized[0]?.shot || shots[0]
}

/**
 * A層ロット詳細モーダル。4K/FHDマップ、代表画像、サマリー、ショット読み込みを統合する。
 * @param {object} props                      - プロパティ集合。
 * @param {boolean} props.open                - モーダル開閉。
 * @param {object} props.lot                  - ロット情報。
 * @param {string} props.lotStatus            - ロット判定。
 * @param {Array} props.shots4k               - 4Kショット配列。
 * @param {string} [props.shotsStatus='success'] - 4Kデータ取得状態。
 * @param {object} [props.shots4kSummary]     - 4Kサマリーデータ。
 * @param {Function} props.onClose            - 閉じるハンドラ。
 * @param {Function} props.setLightbox        - ライトボックス制御。
 * @returns {JSX.Element|null}                 モーダル要素。
 */
const ALayerLotDetailModal = ({ open, lot, lotStatus, shots4k, shotsStatus = 'success', shots4kSummary, onClose, setLightbox }) => {
  const normalizedLotStatus = (lotStatus || '').toString().trim().toUpperCase()
  const sequenceStatusItems = useMemo(() => {
    if (!Array.isArray(shots4k) || shots4k.length === 0) return []

    const priorityOf = status => {
      const normalized = normalizeStatusLabel(status)
      const index = STATUS_PRIORITY.indexOf(normalized)
      return index >= 0 ? index : STATUS_PRIORITY.length
    }

    const groups = new Map()

    shots4k.forEach(shot => {
      const seqRaw = shot?.['c4k_seq'] ?? shot?.four_k_seq ?? shot?.seq ?? ''
      const parsedSequence = parseShotSequence(seqRaw)
      const labelSource = parsedSequence?.label || (typeof seqRaw === 'string' && seqRaw.trim()) || shot?.camera_id || '-'
      const label = labelSource || '-'
      const normalizedStatus = normalizeStatusLabel(shot?.status) || 'UNKNOWN'
      const detail = shot?.details && shot.details !== '-' ? shot.details : ''

      const existing = groups.get(label)
      if (!existing) {
        groups.set(label, {
          name: label,
          status: normalizedStatus,
          priority: priorityOf(normalizedStatus),
          details: detail ? [detail] : [],
        })
      } else {
        const currentPriority = existing.priority
        const nextPriority = priorityOf(normalizedStatus)
        if (nextPriority < currentPriority) {
          existing.status = normalizedStatus
          existing.priority = nextPriority
        }
        if (detail && !existing.details.includes(detail)) {
          existing.details.push(detail)
        }
      }
    })

    return Array.from(groups.values())
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }))
      .map(item => ({
        name: item.name,
        status: item.status,
        details: item.details[0] || '',
      }))
  }, [shots4k])
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

  const buildShotSources = useCallback((shot) => {
    if (!shot) return { primary: FALLBACK_IMG, fallback: '' }
    const normalized = normalizeRelativePath(shot.image_path)
    if (!normalized) return { primary: FALLBACK_IMG, fallback: '' }
    const status = (shot.status || '').toString().toUpperCase()
    const hasFallbackBase = Boolean(fallbackImageBase)

    const buildPair = builder => {
      const primaryCandidate = builder(normalized)
      const fallbackCandidate = hasFallbackBase ? builder(normalized, { base: fallbackImageBase }) : ''
      return { primary: primaryCandidate, fallback: fallbackCandidate }
    }

    const ensureUrl = pair => {
      if (pair.primary) return pair
      return buildPair((path, options) => toImageUrl(path, options))
    }

    let pair
    if (status === 'MISSING') {
      pair = ensureUrl(buildPair((path, options) => toBeforeTestUrl(path, options)))
    } else if (status === 'PASS' || status === 'FAIL') {
      pair = ensureUrl(buildPair((path, options) => toAfterTestUrl(path, options)))
    } else {
      pair = ensureUrl(buildPair((path, options) => toImageUrl(path, options)))
    }

    const primary = pair.primary || FALLBACK_IMG
    const fallback = pair.fallback && pair.fallback !== primary ? pair.fallback : ''

    return { primary, fallback }
  }, [])

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

  const gridStructure = useMemo(
    () => buildGridStructure(shots4k, { sequenceExtractor: shot => shot?.['c4k_seq'] ?? shot?.four_k_seq ?? shot?.seq }),
    [shots4k],
  )

  const [selectedSequence, setSelectedSequence] = useState(null)
  const [fhdShots, setFhdShots] = useState([])
  const [fhdStatus, setFhdStatus] = useState('idle')
  const [fhdError, setFhdError] = useState('')
  const [fhdSummary, setFhdSummary] = useState(null)
  const fhdCacheRef = useRef(new Map())
  const fhdAbortRef = useRef(null)

  const fhdGridStructure = useMemo(
    () => buildGridStructure(fhdShots, { sequenceExtractor: shot => shot?.fhd_seq ?? shot?.seq }),
    [fhdShots],
  )

  const normalizedShotsStatus = useMemo(() => {
    if (shotsStatus === 'error') return 'error'
    if (Array.isArray(shots4k) && shots4k.length > 0) return 'success'
    if (shotsStatus === 'success') return 'success'
    if (shotsStatus === 'loading') return 'loading'
    return 'loading'
  }, [shotsStatus, shots4k])

  const normalizedFhdStatus = useMemo(() => {
    if (!selectedSequence) return 'idle'
    if (fhdStatus === 'error') return 'error'
    if (Array.isArray(fhdShots) && fhdShots.length > 0) return 'success'
    if (fhdStatus === 'success') return 'success'
    if (fhdStatus === 'loading') return 'loading'
    return 'loading'
  }, [selectedSequence, fhdStatus, fhdShots])

  const handleResetFhdState = useCallback(() => {
    setSelectedSequence(null)
    setFhdShots([])
    setFhdStatus('idle')
    setFhdError('')
    setFhdSummary(null)
    if (fhdAbortRef.current) {
      fhdAbortRef.current.abort()
      fhdAbortRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!open) {
      handleResetFhdState()
    }
  }, [open, handleResetFhdState])

  useEffect(() => {
    fhdCacheRef.current = new Map()
    handleResetFhdState()
  }, [lot?.lotId, handleResetFhdState])

  useEffect(() => () => {
    if (fhdAbortRef.current) {
      fhdAbortRef.current.abort()
      fhdAbortRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!open) return

    if (shots4k == null) {
      console.error('[ALayerLotDetailModal] shots4k が null または undefined です', {
        lotId: lot?.lotId,
        shots4k,
      })
      return
    }

    if (!Array.isArray(shots4k)) {
      console.error('[ALayerLotDetailModal] shots4k は配列ではありません', {
        lotId: lot?.lotId,
        type: typeof shots4k,
        shots4k,
      })
      return
    }

    if (shots4k.length === 0) {
      console.warn('[ALayerLotDetailModal] shots4k 配列が空です', {
        lotId: lot?.lotId,
      })
      return
    }

    if (Array.isArray(shots4k) && shots4k.length > 0 && !gridStructure.hasEntries) {
      const invalidShots = shots4k
        .map(shot => {
          const seqValue = shot?.['c4k_seq'] ?? shot?.four_k_seq ?? shot?.seq
          const parsed = parseShotSequence(seqValue)
          if (parsed) return null
          return {
            seqValue,
            shot,
          }
        })
        .filter(Boolean)

      console.error('[ALayerLotDetailModal] 4K グリッド構造の構築に失敗しました', {
        lotId: lot?.lotId,
        shotsCount: shots4k.length,
        invalidShotCount: invalidShots.length,
        invalidShots,
      })
    }
  }, [open, shots4k, lot?.lotId, gridStructure.hasEntries])

  useEffect(() => {
    if (!selectedSequence || !lot?.lotId) return

    const sequenceLabel = selectedSequence.label
    if (!sequenceLabel) return

    const cacheKey = `${lot.lotId}::${sequenceLabel}`
    const cached = fhdCacheRef.current.get(cacheKey)
    if (cached) {
      setFhdShots(cached.shots)
      setFhdStatus('success')
      setFhdError('')
      setFhdSummary(cached.summary || normalizeShotSummary(null, cached.shots))
      return
    }

    const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
    const controller = new AbortController()
    if (fhdAbortRef.current) {
      fhdAbortRef.current.abort()
    }
    fhdAbortRef.current = controller

    const fetchFhdShots = async () => {
      try {
        setFhdStatus('loading')
        setFhdError('')
        setFhdShots([])
        setFhdSummary(null)
        const res = await fetch(
          `${base}/api/inspections/lots/${encodeURIComponent(lot.lotId)}/shots/FHD/${encodeURIComponent(sequenceLabel)}`,
          { signal: controller.signal },
        )
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        const data = await res.json()
        const shots = Array.isArray(data?.shots) ? data.shots : []
        const summary = normalizeShotSummary(data?.summary, shots)
        setFhdShots(shots)
        setFhdStatus('success')
        setFhdSummary(summary)
        fhdCacheRef.current.set(cacheKey, { shots, summary, fetchedAt: Date.now() })
      } catch (error) {
        if (controller.signal.aborted) return
        console.error('[ALayerLotDetailModal] FHD ショットの取得に失敗しました', {
          lotId: lot?.lotId,
          sequence: sequenceLabel,
          error,
        })
        setFhdStatus('error')
        setFhdError(error?.message || '不明なエラー')
        setFhdShots([])
        setFhdSummary(null)
      } finally {
        if (fhdAbortRef.current === controller) {
          fhdAbortRef.current = null
        }
      }
    }

    fetchFhdShots()

    return () => {
      controller.abort()
    }
  }, [selectedSequence, lot?.lotId])

  useEffect(() => {
    if (!selectedSequence || normalizedFhdStatus !== 'success') return
    const invalidFhdShots = (fhdShots || [])
      .map(shot => {
        const parsed = parseShotSequence(shot?.fhd_seq ?? shot?.seq)
        if (parsed) return null
        return { shot }
      })
      .filter(Boolean)

    if (invalidFhdShots.length > 0) {
      console.warn('[ALayerLotDetailModal] FHD グリッド構築で無効なシーケンスが検出されました', {
        lotId: lot?.lotId,
        sequence: selectedSequence.label,
        count: invalidFhdShots.length,
        invalidFhdShots,
      })
    }
  }, [selectedSequence, normalizedFhdStatus, fhdShots, lot?.lotId])

  const isShowingFhd = Boolean(selectedSequence)
  const activeMapStructure = isShowingFhd ? fhdGridStructure : gridStructure
  const activeStatus = isShowingFhd ? normalizedFhdStatus : normalizedShotsStatus
  const selectedFourKShot = selectedSequence ? pickRepresentativeShot(selectedSequence.shots || []) : null
  const fhdSubtitle = useMemo(() => {
    if (!selectedSequence) return ''
    const parts = [`4Kシーケンス: ${selectedSequence.label}`]
    if (selectedFourKShot?.camera_id) parts.push(`カメラ: ${selectedFourKShot.camera_id}`)
    if (selectedFourKShot?.status) parts.push(`結果: ${selectedFourKShot.status}`)
    if (Array.isArray(selectedSequence.shots) && selectedSequence.shots.length > 1) {
      parts.push(`4K撮影枚数: ${selectedSequence.shots.length}`)
    }
    return parts.join(' / ')
  }, [selectedSequence, selectedFourKShot])

  const lotSummaryForDisplay = useMemo(
    () => normalizeShotSummary(shots4kSummary, shots4k),
    [shots4kSummary, shots4k],
  )

  const fhdSummaryForDisplay = useMemo(
    () => normalizeShotSummary(fhdSummary, fhdShots),
    [fhdSummary, fhdShots],
  )

  const lotInfoSummaryLabel = useMemo(() => {
    if (isShowingFhd) {
      return selectedSequence ? `FHDサマリー（${selectedSequence.label}）` : 'FHDサマリー'
    }
    return '4Kサマリー'
  }, [isShowingFhd, selectedSequence])

  const lotInfoSummary = isShowingFhd ? fhdSummaryForDisplay : lotSummaryForDisplay
  const lotInfoSummaryItems = isShowingFhd ? fhdShots : shots4k

  const handleSelectSequence = useCallback((entry) => {
    if (!entry?.sequence) return
    setSelectedSequence(prev => {
      if (prev?.label === entry.sequence.label) return prev
      return {
        label: entry.sequence.label,
        sequence: entry.sequence,
        shots: Array.isArray(entry.shots) ? entry.shots : [],
      }
    })
  }, [])

  const handleBackToMap = useCallback(() => {
    handleResetFhdState()
  }, [handleResetFhdState])

  // ======== 描画ガード ========
  // ロット情報が取得できない場合はヘッダやサマリーの前提が崩れるため描画を打ち切る
  if (!lot) return null

  return (
    // ======== モーダル全体の骨組みを構築 ========
    // fullWidth + maxWidth="xl" で詳細パネルと撮影マップを横並びに見せる
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              {lot.date} {lot.time}
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {lot.lotId}
            </Typography>
          </Box>
          <Chip label={normalizedLotStatus || '-'} color={getLotStatusColor(normalizedLotStatus)} size="small" variant="filled" />
        </Box>
      </DialogTitle>
      {/* ======== 本文は2カラム構成 ======== */}
      {/* 左列はLot情報、右列は4K/FHDマップを担保するため余白や高さを厳密に制御 */}
      <DialogContent
        dividers
        sx={{
          p: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'stretch',
            gap: { xs: 4, md: 6 },
            p: { xs: 4, md: 6 },
            height: { md: '70vh' },
            boxSizing: 'border-box',
          }}
        >
          {/* ======== 左列: Lot概要とサマリー ======== */}
          <Box
            sx={{
              flexBasis: { md: '40%' },
              flexShrink: 0,
              alignSelf: 'flex-start',
            }}
          >
            <LotInfoSection
              lot={lot}
              representativeSources={representativeSources}
              handleImageError={handleImageError}
              setLightbox={setLightbox}
              getChipColor={getChipColor}
              statusItems={sequenceStatusItems}
              summary={lotInfoSummary}
              summaryItems={lotInfoSummaryItems}
              summaryLabel={lotInfoSummaryLabel}
            />
          </Box>

          {/* ======== 右列: 撮影マップビュー ======== */}
          <Box
            sx={{
              flexGrow: 1,
              minHeight: 0,
              overflowY: { xs: 'visible', md: 'auto' },
              pr: { md: 1 },
            }}
          >
            {/* FHD表示時は戻りボタンや字幕を付与し、4K時はシーケンス選択を許可 */}
            <FourKMapSection
              title={isShowingFhd ? 'FHD 撮影マップ' : '4K 撮影マップ'}
              subtitle={isShowingFhd ? fhdSubtitle : undefined}
              status={activeStatus}
              loadingMessage={isShowingFhd ? 'FHDデータを取得中です…' : '詳細データを取得中です…'}
              errorMessage={isShowingFhd ? (fhdError ? `FHDデータの取得に失敗しました: ${fhdError}` : 'FHDデータの取得に失敗しました。') : '詳細データの取得に失敗しました。'}
              emptyMessage={isShowingFhd ? '該当するFHDショットがありません。' : '該当する4Kショットがありません。'}
              placeholderLabel={isShowingFhd ? '未取得' : '未取得'}
              gridStructure={activeMapStructure}
              buildShotSources={buildShotSources}
              getShotStatusColor={getShotStatusColor}
              handleImageError={handleImageError}
              setLightbox={setLightbox}
              onSelectSequence={isShowingFhd ? undefined : handleSelectSequence}
              selectedSequenceLabel={selectedSequence?.label}
              onBack={isShowingFhd ? handleBackToMap : undefined}
              highlightSelected={!isShowingFhd}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ALayerLotDetailModal
