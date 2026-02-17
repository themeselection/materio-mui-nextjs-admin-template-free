/*
======== ファイル概要 ========
検査セクション単位のカード、統計、ロット履歴、モーダル開閉をまとめて扱うタブ用コンポーネント。
URL選択状態やAPIからの統計情報もここで橋渡しする。
*/

import { useEffect, useMemo, useRef, useState } from 'react'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import DonutChart from '../charts/DonutChart'
import ImageLightbox from '../lightbox/ImageLightbox'
import SectionSummary from '../lots/SectionSummary'
import CameraGrid from '../grid/CameraGrid'
import LotCard from '../lots/LotCard'
import SpringLotDetailModal from '../modals/SpringLotDetailModal'
import ALayerLotDetailModal from '../modals/ALayerLotDetailModal'
import { SECTION_CONFIG } from '../../utils/sectionConfig'
import SurfaceBox from '@/components/surface/SurfaceBox'

/**
 * セクション別ダッシュボードタブ。最新統計、カメラグリッド、ロットカード群を描画し、
 * ロット詳細モーダルの制御まで担当する。
 * @param {object} props                                - プロパティ集合。
 * @param {string} props.section                        - 対象セクション名。
 * @param {Function} props.getSectionLots               - 日付別ロット取得関数。
 * @param {Function} props.getLotStatus                 - ロット判定取得関数。
 * @param {Function} props.getLotShotsStatus            - ショット取得状態参照関数。
 * @param {Function} props.getLotShotsByCamera          - カメラ別ショット取得関数。
 * @param {Function} props.getLotShots                  - ショット配列取得関数。
 * @param {Function} props.ensureLotShotsLoaded         - ショット読み込み要求関数。
 * @param {Function} props.getSectionStats              - 日付別統計取得関数。
 * @param {Function} props.getFailReasons               - 不良内訳取得関数。
 * @param {object}   props.lightbox                     - ライトボックス状態。
 * @param {Function} props.setLightbox                  - ライトボックス更新関数。
 * @param {Function} props.getLatestLot                 - 最新ロット取得関数。
 * @param {Function} props.getAvailableDates            - ロット日一覧取得関数。
 * @param {string}   [props.selectedLotId]              - 選択中ロットID。
 * @param {object}   [props.selectedLotInfo]            - 選択中ロット詳細。
 * @param {Function} [props.onOpenLot]                  - ロットオープン時のハンドラ。
 * @param {Function} [props.onCloseLot]                 - ロットクローズ時のハンドラ。
 * @param {Function} props.getLotShotsSummary           - サマリー取得関数。
 * @returns {JSX.Element}                                セクションタブ内容。
 */
const SectionTab = ({
  section,
  getSectionLots,
  getLotStatus,
  getLotShotsStatus,
  getLotShotsByCamera,
  getLotShots,
  ensureLotShotsLoaded,
  getSectionStats,
  getFailReasons,
  lightbox,
  setLightbox,
  getLatestLot,
  getAvailableDates,
  selectedLotId,
  selectedLotInfo,
  onOpenLot,
  onCloseLot,
  getLotShotsSummary,
}) => {
  // 日付切替（セクション別に）
  const availableDatesRaw = useMemo(() => getAvailableDates(section) || [], [getAvailableDates, section])
  const availableDates = useMemo(() => {
    if (selectedLotInfo?.section === section && selectedLotInfo.date) {
      const set = new Set([selectedLotInfo.date, ...availableDatesRaw])
      return Array.from(set).sort((a, b) => (a < b ? 1 : a > b ? -1 : 0))
    }
    return availableDatesRaw
  }, [availableDatesRaw, selectedLotInfo, section])

  const [selectedDateIndex, setSelectedDateIndex] = useState(0)
  const [manualDate, setManualDate] = useState('')
  const selectedDate = manualDate || (availableDates[selectedDateIndex] || undefined)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentModalLotId, setCurrentModalLotId] = useState(null)
  const [localLotSnapshot, setLocalLotSnapshot] = useState(null)
  const prevSelectedLotIdRef = useRef(selectedLotId)

  useEffect(() => {
    if (!manualDate) return
    const idx = availableDates.indexOf(manualDate)
    if (idx >= 0 && idx !== selectedDateIndex) {
      setSelectedDateIndex(idx)
    }
  }, [manualDate, availableDates, selectedDateIndex])

  useEffect(() => {
    const maxIndex = Math.max(availableDates.length - 1, 0)
    if (selectedDateIndex > maxIndex) {
      setSelectedDateIndex(maxIndex)
    }
  }, [availableDates, selectedDateIndex])

  useEffect(() => {
    if (!selectedLotInfo) return
    if (selectedLotInfo.section !== section) return
    if (!selectedLotInfo.date) return
    setManualDate(prev => (prev === selectedLotInfo.date ? prev : selectedLotInfo.date))
  }, [selectedLotInfo, section])

  const goPrevDate = () => {
    setManualDate('')
    setSelectedDateIndex(i => Math.min(i + 1, Math.max(availableDates.length - 1, 0)))
  }

  const goNextDate = () => {
    setManualDate('')
    setSelectedDateIndex(i => Math.max(i - 1, 0))
  }

  const canGoPrev = selectedDateIndex < (availableDates.length - 1)
  const canGoNext = selectedDateIndex > 0

  const latestLotForSection = getLatestLot(section)
  const latestLotStatus = latestLotForSection ? getLotStatus(latestLotForSection) : undefined
  const latestDate = latestLotForSection?.date
  const statsLatest = getSectionStats(section, latestDate)
  const failReasonsLatest = getFailReasons(section, latestDate)

  const cameraNamesForGrid = useMemo(() => {
    const fallback = SECTION_CONFIG[section]?.cameras || []
    if (section === 'A層') {
      return fallback
    }
    const fromLatest = Array.from(new Set((latestLotForSection?.cameras || []).map(cam => cam?.name).filter(Boolean)))
    return fromLatest.length ? fromLatest : fallback
  }, [latestLotForSection, section])

  const statusByNameForGrid = useMemo(() => {
    if (section === 'A層') {
      const fallback = SECTION_CONFIG[section]?.cameras || []
      const normalizedLotStatus = (latestLotStatus || '').toString().trim().toUpperCase()
      const statusForCamera = (() => {
        if (normalizedLotStatus === 'PASS') return 'PASS'
        if (normalizedLotStatus === 'FAIL') return 'FAIL'
        if (normalizedLotStatus === 'MISSING') return 'MISSING'
        if (normalizedLotStatus === 'OK') return 'PASS'
        if (normalizedLotStatus === 'NG') return 'FAIL'
        return normalizedLotStatus || ''
      })()
      if (!statusForCamera) return {}
      return Object.fromEntries(fallback.map(name => [name, statusForCamera]))
    }

    const entries = (latestLotForSection?.cameras || [])
      .filter(cam => cam?.name)
      .map(cam => [cam.name, cam.status])
    return Object.fromEntries(entries)
  }, [latestLotForSection, latestLotStatus, section])

  const imageByNameForGrid = useMemo(() => {
    if (!latestLotForSection) return {}
    if (section === 'A層') {
      const representative = latestLotForSection.representativeImage
      if (!representative) return {}
      return Object.fromEntries((cameraNamesForGrid || []).map(name => [name, representative]))
    }
    const entries = (latestLotForSection.cameras || [])
      .filter(cam => cam?.name && cam?.image_path)
      .map(cam => [cam.name, cam.image_path])
    if (entries.length > 0) return Object.fromEntries(entries)
    if (latestLotForSection.representativeImage) {
      return Object.fromEntries((cameraNamesForGrid || []).map(name => [name, latestLotForSection.representativeImage]))
    }
    return {}
  }, [latestLotForSection, section, cameraNamesForGrid])

  const sectionLots = useMemo(() => {
    const baseLots = getSectionLots(section, selectedDate) || []
    if (selectedLotInfo && selectedLotInfo.section === section) {
      const matchesDate = !selectedDate || selectedLotInfo.date === selectedDate
      const exists = baseLots.some(l => l.lotId === selectedLotInfo.lotId)
      if (matchesDate && !exists) {
        return [...baseLots, selectedLotInfo].sort((a, b) => b.timestamp - a.timestamp)
      }
    }
    return baseLots
  }, [getSectionLots, section, selectedDate, selectedLotInfo])

  const selectedLot = useMemo(
    () => {
      const fromList = (sectionLots || []).find(lot => lot.lotId === selectedLotId)
      if (fromList) return fromList
      if (selectedLotInfo && selectedLotInfo.section === section && selectedLotInfo.lotId === selectedLotId) {
        return selectedLotInfo
      }
      return null
    },
    [sectionLots, selectedLotId, selectedLotInfo, section],
  )

  const activeLot = useMemo(() => {
    if (selectedLot && selectedLot.section === section) return selectedLot
    if (!currentModalLotId) return null
    const fromSection = (sectionLots || []).find(lot => lot.lotId === currentModalLotId)
    if (fromSection) return fromSection
    if (selectedLotInfo && selectedLotInfo.section === section && selectedLotInfo.lotId === currentModalLotId) {
      return selectedLotInfo
    }
    if (localLotSnapshot && localLotSnapshot.lotId === currentModalLotId) return localLotSnapshot
    return null
  }, [selectedLot, section, currentModalLotId, sectionLots, selectedLotInfo, localLotSnapshot])

  useEffect(() => {
    if (!selectedLot || selectedLot.section !== section) return
    if (currentModalLotId && selectedLot.lotId !== currentModalLotId) return
    setLocalLotSnapshot(prev => (prev && prev.lotId === selectedLot.lotId ? prev : selectedLot))
  }, [selectedLot, section, currentModalLotId])

  useEffect(() => {
    // Close modal when URL loses the lot parameter (e.g., via back navigation).
    const prevSelectedLotId = prevSelectedLotIdRef.current

    if (!selectedLotId && prevSelectedLotId) {
      if (isModalOpen) setIsModalOpen(false)
      if (currentModalLotId) setCurrentModalLotId(null)
      if (localLotSnapshot) setLocalLotSnapshot(null)
    }

    prevSelectedLotIdRef.current = selectedLotId
  }, [selectedLotId, isModalOpen, currentModalLotId, localLotSnapshot])

  useEffect(() => {
    if (!isModalOpen || !currentModalLotId || !ensureLotShotsLoaded) return
    if (section === 'A層') {
      ensureLotShotsLoaded(currentModalLotId, { type: '4K' })
    } else {
      ensureLotShotsLoaded(currentModalLotId)
    }
  }, [isModalOpen, currentModalLotId, section, ensureLotShotsLoaded])

  const modalLotId = currentModalLotId || (activeLot ? activeLot.lotId : null)

  const lotShotsStatus = useMemo(() => {
    if (!getLotShotsStatus || !modalLotId) return 'idle'
    return section === 'A層'
      ? getLotShotsStatus(modalLotId, { type: '4K' })
      : getLotShotsStatus(modalLotId)
  }, [getLotShotsStatus, modalLotId, section])

  const selectedLotStatus = activeLot ? getLotStatus(activeLot) : undefined

  const selectedLotShotsByCamera = useMemo(() => {
    if (!modalLotId || section === 'A層') return {}
    return getLotShotsByCamera(modalLotId)
  }, [modalLotId, section, getLotShotsByCamera])

  const selectedLotShots4K = useMemo(() => {
    if (!modalLotId || section !== 'A層') return []
    return getLotShots(modalLotId, { type: '4K' })
  }, [modalLotId, section, getLotShots])

  const selectedLotShotsSummary = useMemo(() => {
    if (!modalLotId) return null
    return getLotShotsSummary(modalLotId)
  }, [modalLotId, getLotShotsSummary])

  const selectedLotShots4KSummary = useMemo(() => {
    if (!modalLotId || section !== 'A層') return null
    return getLotShotsSummary(modalLotId, { type: '4K' })
  }, [modalLotId, section, getLotShotsSummary])

  const handleOpenLot = lot => {
    setIsModalOpen(true)
    setCurrentModalLotId(lot.lotId)
    setLocalLotSnapshot(lot)
    onOpenLot?.(lot)
    if (!ensureLotShotsLoaded) return
    if (section === 'A層') {
      ensureLotShotsLoaded(lot.lotId, { type: '4K' })
    } else {
      ensureLotShotsLoaded(lot.lotId)
    }
  }

  const handleCloseLotModal = () => {
    const lotIdToClose = modalLotId
    setIsModalOpen(false)
    setCurrentModalLotId(null)
    setLocalLotSnapshot(null)
    onCloseLot?.()
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8} sx={{ display: 'flex' }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                最新ログ: {section}検査（{cameraNamesForGrid.length}カメラ）
              </Typography>
              
              {/* ▼削除した行の跡地 (何も表示しない) */}
              
              {cameraNamesForGrid.length === 0 ? (
                <Typography color="text.secondary">カメラ構成が取得できません。</Typography>
              ) : (
                <CameraGrid cameraNames={cameraNamesForGrid} statusByName={statusByNameForGrid} imageByName={imageByNameForGrid} />
              )}
              <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2 }}>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  最新の画像判定
                </Typography>
                <SectionSummary latestLot={latestLotForSection} lotStatus={latestLotStatus} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4} sx={{ display: 'flex' }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>
            <CardContent sx={{ '& > * + *': { mt: 3 } }}>
              <Box>
                {/* 右側のサマリータイトルは残します */}
                <Typography variant="h6" gutterBottom>
  {/* availableDates[0] (APIが返す最新日) を表示するように修正 */}
  サマリー（最新日{availableDates[0] ? `: ${availableDates[0]}` : ''}）
</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <DonutChart percentage={statsLatest.passRate} />
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <SurfaceBox variant="soft" sx={{ p: 1.5, borderRadius: 1, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">画像総数</Typography>
                      <Typography variant="h4" fontWeight="bold">{statsLatest.total}</Typography>
                    </SurfaceBox>
                  </Grid>
                  <Grid item xs={4}>
                    <SurfaceBox variant="soft" sx={{ p: 1.5, borderRadius: 1, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">良品画像</Typography>
                      <Typography variant="h4" fontWeight="bold" color="success.main">{statsLatest.pass}</Typography>
                    </SurfaceBox>
                  </Grid>
                  <Grid item xs={4}>
                    <SurfaceBox variant="soft" sx={{ p: 1.5, borderRadius: 1, textAlign:  'center' }}>
                      <Typography variant="body2" color="text.secondary">不良品画像</Typography>
                      <Typography variant="h4" fontWeight="bold" color="error.main">{statsLatest.fail}</Typography>
                    </SurfaceBox>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  不良原因
                </Typography>
                {failReasonsLatest.length === 0 ? (
                  <Typography color="text.secondary">本日の不良品はありません。</Typography>
                ) : (
                  <Box sx={{ '& > * + *': { mt: 2 } }}>
                    {failReasonsLatest.map((reason, index) => (
                      <Box key={index}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {reason.reason}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {reason.count}件
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={reason.percentage}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {section}検査 ロットログ（{selectedDate || '全日'}）
            </Typography>
            {/* 日付ナビゲーション */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <IconButton size="small" onClick={goPrevDate} disabled={!canGoPrev} aria-label="prev date">
                <ChevronLeftIcon />
              </IconButton>
              <TextField
                type="date"
                size="small"
                value={selectedDate || ''}
                onChange={(e) => {
                  const v = e.target.value

                  setManualDate(v)
                  const idx = availableDates.indexOf(v)

                  if (idx >= 0) setSelectedDateIndex(idx)
                }}
                inputProps={{ max: availableDates[0] || undefined }}
                sx={{ minWidth: 160 }}
              />
              <IconButton size="small" onClick={goNextDate} disabled={!canGoNext} aria-label="next date">
                <ChevronRightIcon />
              </IconButton>
              <Box sx={{ flex: 1 }} />
              {availableDates.length > 0 && (
                <Typography variant="caption" color="text.secondary">
                  {selectedDateIndex + 1}/{availableDates.length}
                </Typography>
              )}
            </Box>
            <Box>
              {sectionLots.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                  表示できるロットがありません。
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {sectionLots.map(lot => (
                    <Grid item xs={12} md={6} xl={4} key={lot.lotId}>
                      <LotCard
                        lot={lot}
                        lotStatus={getLotStatus(lot)}
                        onOpen={() => handleOpenLot(lot)}
                        isActive={modalLotId === lot.lotId}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
      {section === 'A層' ? (
        <ALayerLotDetailModal
          open={isModalOpen && Boolean(activeLot)}
          lot={activeLot}
          lotStatus={selectedLotStatus}
          shots4k={selectedLotShots4K}
          shotsStatus={lotShotsStatus}
          shots4kSummary={selectedLotShots4KSummary}
          onClose={handleCloseLotModal}
          setLightbox={setLightbox}
        />
      ) : (
        <SpringLotDetailModal
          open={isModalOpen && Boolean(activeLot)}
          lot={activeLot}
          lotStatus={selectedLotStatus}
          shotsByCamera={selectedLotShotsByCamera}
          shotsStatus={lotShotsStatus}
          lotSummary={selectedLotShotsSummary}
          onClose={handleCloseLotModal}
          setLightbox={setLightbox}
        />
      )}
      {/* Lightbox */}
      <ImageLightbox
        open={lightbox.open}
        src={lightbox.src}
        fallbackSrc={lightbox.fallback}
        alt={lightbox.alt}
        onClose={() => setLightbox({ open: false, src: '', fallback: '', alt: '' })}
      />
    </>
  )
}

export default SectionTab