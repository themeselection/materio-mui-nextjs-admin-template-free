// バネどめ検査 ロット詳細モーダル（ラベル位置統一・色変化対応版）

import { useCallback, useEffect, useMemo, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

import { getFallbackImageBase, toAfterTestUrl, toBeforeTestUrl, toImageUrl } from '../../utils/imageUrl'
import ShotsSummaryBlock from '../lots/ShotsSummaryBlock'
import { normalizeShotSummary } from '../../utils/summaryUtils'

const fallbackImageBase = getFallbackImageBase()
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
const FALLBACK_IMG = `${basePath}/images/pages/CameraNotFound.png`

/**
 * 画像パスの表記ゆれを取り除き、URL生成に使える形へ整える。
 * @param {string} path - 元のパス。
 * @returns {string|null} 正規化結果。
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
 * ステータスに応じたMUI Chipカラーを返す。
 * @param {string} status - 判定。
 * @returns {'success'|'error'|'warning'|'default'} 色指定。
 */
const getChipColor = status => {
  const normalized = (status || '').toString().trim().toUpperCase()
  if (normalized === 'OK' || normalized === 'PASS') return 'success'
  if (normalized === 'NG' || normalized === 'FAIL') return 'error'
  if (normalized === 'MISSING') return 'warning'
  return 'default'
}

/**
 * ロットヘッダー用Chipカラーを計算する。
 * @param {string} status - 判定。
 * @returns {'success'|'error'|'warning'|'default'} 色。
 */
const getLotStatusColor = status => {
  const normalized = (status || '').toString().trim().toUpperCase()
  if (normalized === 'PASS') return 'success'
  if (normalized === 'FAIL') return 'error'
  if (normalized === 'MISSING') return 'warning'
  return 'default'
}

/**
 * 撮影履歴テーブル内のChipカラーを選ぶ。
 * @param {string} status - 判定。
 * @returns {'success'|'error'|'warning'|'default'} 色。
 */
const getShotStatusColor = status => {
  const normalized = (status || '').toString().toUpperCase()
  if (normalized === 'PASS') return 'success'
  if (normalized === 'FAIL') return 'error'
  if (normalized === 'MISSING') return 'warning'
  return 'default'
}

const SpringLotDetailModal = ({ open, lot, lotStatus, shotsByCamera, shotsStatus, lotSummary, onClose, setLightbox }) => {
  const theme = useTheme();
  const normalizedLotStatus = (lotStatus || '').toString().trim().toUpperCase()
  const [showTable, setShowTable] = useState(false)
  const [filterCamera, setFilterCamera] = useState(null)

  // 各カメラの判定結果をマップ化
  const cameraStatusMap = useMemo(() => {
    const map = {};
    (lot?.cameras || []).forEach(cam => {
      const normalizedName = cam.name.replace(/(\d+)$/, (match) => match.padStart(2, '0'));
      const status = (cam.status || '').toString().trim().toUpperCase();
      map[normalizedName] = status === 'OK' ? 'PASS' : status === 'NG' ? 'FAIL' : status;
    });
    return map;
  }, [lot?.cameras]);

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
   * ショットの状態に応じてbefore/afterのどちらを参照するかを決定する。
   * @param {object} shot - ショット情報。
   * @returns {{primary: string, fallback: string}} 表示URL。
   */
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

  /**
   * 画像の読み込み失敗時、フォールバック→固定画像の順に差し替える。
   * @param {React.SyntheticEvent<HTMLImageElement>} event - onErrorイベント。
   * @param {string} fallbackSrc                          - フォールバックURL。
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

  const shotEntries = useMemo(
    () => Object.entries(shotsByCamera || {}).map(([key, shots]) => [key, Array.isArray(shots) ? shots : []]),
    [shotsByCamera],
  )

  const filteredShotEntries = useMemo(() => {
    if (!filterCamera) return shotEntries
    const toStandard = (name) => name.trim().replace(/(\d+)$/, (match) => match.padStart(2, '0'))
    const target = toStandard(filterCamera)
    return shotEntries.filter(([key]) => toStandard(key) === target)
  }, [shotEntries, filterCamera])

  const flattenedShots = useMemo(() => {
    return Object.values(shotsByCamera || {}).reduce((acc, value) => {
      if (Array.isArray(value)) acc.push(...value)
      return acc
    }, [])
  }, [shotsByCamera])

  const normalizedLotSummary = useMemo(
    () => normalizeShotSummary(lotSummary, flattenedShots),
    [lotSummary, flattenedShots],
  )

  const hasShotEntries = shotEntries.length > 0

  useEffect(() => {
    if (!open) {
      setShowTable(false)
      setFilterCamera(null)
    }
  }, [open])

  const handleCameraClick = (e, cameraName) => {
    if (e) e.stopPropagation();
    if (!hasShotEntries) return
    setFilterCamera(cameraName)
    setShowTable(true)
  }

  if (!lot) return null

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">{lot.date} {lot.time}</Typography>
            <Typography variant="h5" fontWeight="bold">{lot.lotId}</Typography>
          </Box>
          <Chip label={normalizedLotStatus || '-'} color={getLotStatusColor(normalizedLotStatus)} size="small" variant="filled" />
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'stretch', gap: { xs: 4, md: 6 }, p: { xs: 4, md: 6 }, boxSizing: 'border-box', height: { md: '70vh' } }}>
          <Box sx={{ flexBasis: { md: '40%' }, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4, position: { md: 'sticky' }, top: { md: 24 } }}>
            <Box sx={{ width: '100%', aspectRatio: '16/9', borderRadius: 2, overflow: 'hidden', bgcolor: theme => (theme.palette.mode === 'dark' ? 'grey.900' : 'grey.200'), cursor: 'zoom-in' }}
              onClick={() => {
                if (setLightbox) {
                  setLightbox({ open: true, src: representativeSources.primary, fallback: representativeSources.fallback, alt: lot.representativeImage ? `${lot.lotId} representative` : 'placeholder' })
                }
              }}
            >
              <img src={representativeSources.primary} alt={lot.representativeImage ? `${lot.lotId} representative` : 'placeholder'} onError={e => handleImageError(e, representativeSources.fallback)} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
            {normalizedLotSummary && <ShotsSummaryBlock title="検査サマリー" summary={normalizedLotSummary} />}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>判定要素</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {(lot.cameras || []).map((camera, index) => {
                  const normalizedName = camera.name.replace(/(\d+)$/, (match) => match.padStart(2, '0'));
                  const status = cameraStatusMap[normalizedName] || 'UNKNOWN';
                  const isPass = status === 'PASS';

                  return (
                    <Chip key={`${camera.name}-${index}`} label={`${normalizedName}: ${status}`} size="small" color={getChipColor(status)} variant={isPass ? 'outlined' : 'filled'}
                      onClick={(e) => handleCameraClick(e, normalizedName)}
                      sx={{ cursor: 'pointer', border: filterCamera === normalizedName ? '2px solid' : 'none' }}
                    />
                  )
                })}
              </Box>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1, minHeight: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
                  撮影・検査履歴 {filterCamera ? <Chip label={filterCamera} size="small" color="primary" sx={{ ml: 1 }} /> : ''}
                </Typography>
                {showTable && (
                  <Button size="small" variant="outlined" onClick={() => { setShowTable(false); setFilterCamera(null); }}>
                    図に戻る / 全表示
                  </Button>
                )}
              </Box>
              <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: { xs: 'visible', md: 'auto' } }}>
                {showTable ? (
                  <Table size="small" aria-label="lot shots table" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>カメラ/シーケンス</TableCell>
                        <TableCell>結果</TableCell>
                        <TableCell>詳細</TableCell>
                        <TableCell align="right">画像</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredShotEntries.flatMap(([key, shots]) =>
                        shots.map((shot, idx) => {
                          const sources = buildShotSources(shot)
                          const statusColor = getShotStatusColor(shot.status)
                          return (
                            <TableRow key={`${key}-${idx}`}>
                              <TableCell sx={{ fontWeight: 500 }}>{key}</TableCell>
                              <TableCell><Chip label={shot.status || '-'} size="small" color={statusColor} /></TableCell>
                              <TableCell>{shot.details || '-'}</TableCell>
                              <TableCell align="right" sx={{ width: 240 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                                  <Typography variant="caption" color="text.secondary" sx={{ maxWidth: '100%', wordBreak: 'break-all', textAlign: 'right' }}>{shot.image_path || '-'}</Typography>
                                  <Box sx={{ width: 140, aspectRatio: '16/9', borderRadius: 1, overflow: 'hidden', bgcolor: theme => (theme.palette.mode === 'dark' ? 'grey.900' : 'grey.200'), cursor: 'zoom-in' }}
                                    onClick={() => { if (setLightbox) setLightbox({ open: true, src: sources.primary, fallback: sources.fallback, alt: shot.image_path || 'shot' }) }}
                                  >
                                    <img src={sources.primary} alt={shot.image_path || 'shot'} onError={e => handleImageError(e, sources.fallback)} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  </Box>
                                </Box>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                ) : (
                  <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <Box sx={{ width: '100%', maxWidth: 880, bgcolor: 'background.paper', borderRadius: 2, boxShadow: theme => theme.shadows[4], border: theme => `1px solid ${theme.palette.divider}`, p: 2, '& svg': { width: '100%', height: 'auto' } }}>
                      <svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg">
                        <style>{`
                          .camera-group { cursor: pointer; transition: all 0.2s ease; }
                          .camera-group:hover { filter: brightness(0.9); }
                          .camera-box { stroke-width: 6; rx: 20; }
                          .camera-label { font-size: 32px; font-weight: bold; text-anchor: middle; dominant-baseline: central; pointer-events: none; }
                          
                          .status-pass .camera-box { fill: #edf7ed; stroke: #4caf50; }
                          .status-pass .camera-label { fill: #2e7d32; }
                          .status-fail .camera-box { fill: #fdeded; stroke: #f44336; }
                          .status-fail .camera-label { fill: #d32f2f; }
                          .status-missing .camera-box { fill: #fff4e5; stroke: #ff9800; }
                          .status-missing .camera-label { fill: #ed6c02; }
                          .status-default .camera-box { fill: #f5f5f5; stroke: #bdbdbd; }
                          
                          .active .camera-box { stroke-width: 10 !important; }
                        `}</style>
                        <g transform="translate(50, 0)">
                          <text x="300" y="40" textAnchor="middle" style={{ fontSize: '28px', fontWeight: 'bold', fill: '#3730a3' }}>バネどめ検査カメラ</text>
                          
                          <g className="camera-group" onClick={(e) => handleCameraClick(e, null)}>
                            <rect x="120" y="180" width="360" height="150" style={{ fill: '#f8fafc', stroke: '#cbd5e1', strokeWidth: 2, rx: 20 }} />
                            <text x="300" y="255" textAnchor="middle" style={{ fontSize: '26px', fontWeight: 'bold', fill: '#64748b', pointerEvents: 'none' }}>押し上げ部 (全表示)</text>
                          </g>

                          {['01', '02', '03', '04'].map((num, i) => {
                            const name = `B-spring${num}`;
                            const status = cameraStatusMap[name] || 'DEFAULT';
                            const statusClass = `status-${status.toLowerCase()}`;
                            const xPos = [40, 140, 310, 490][i];
                            const yPos = [160, 90, 90, 160][i];
                            const width = [70, 150, 150, 70][i];
                            const height = [190, 70, 70, 190][i];
                            const labelX = [75, 215, 385, 525][i];
                            const labelY = [255, 125, 125, 255][i];

                            return (
                              <g key={name} className={`camera-group ${statusClass} ${filterCamera === name ? 'active' : ''}`} onClick={(e) => handleCameraClick(e, name)}>
                                <rect x={xPos} y={yPos} width={width} height={height} className="camera-box" />
                                <text x={labelX} y={labelY} className="camera-label">{i + 1}</text>
                                {/* 【修正点】yPos - 15 に統一して、すべてのラベルをボタンの上に配置 */}
                                <text x={labelX} y={yPos - 15} textAnchor="middle" style={{ fontSize: '14px', fill: '#475569', fontWeight: 'bold' }}>{name}</text>
                              </g>
                            )
                          })}
                        </g>
                      </svg>
                    </Box>
                    <Typography variant="body2" color="text.secondary" textAlign="center">数字をクリックするとそのカメラの詳細を表示します</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions><Button onClick={onClose} color="inherit">閉じる</Button></DialogActions>
    </Dialog>
  )
}

export default SpringLotDetailModal