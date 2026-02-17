'use client'

/*
======== ファイル概要 ========
画像検査ダッシュボード全体のページエントリ。タブによるセクション切替や
最新ロットの概要表示、ロット詳細モーダルの状態管理を担っている。
*/

// React Imports
import { useEffect, useMemo, useState } from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

// データ取得用カスタムフック
import { useLotsData } from './hooks/useLotsData'

// セクションごとのタブ・カメラグリッド・サマリー表示用コンポーネント
import SectionTab from './components/sections/SectionTab'
import CameraGrid from './components/grid/CameraGrid'
import SectionSummary from './components/lots/SectionSummary'

// セクション設定（カメラ構成など）
import { SECTION_CONFIG } from './utils/sectionConfig'

// タブのスタイル定義
const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.875rem',
  minHeight: 48,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.primary.light + '20',
  },
}))

// タブ全体のスタイル定義
const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& .MuiTabs-indicator': {
    display: 'none',
  },
}))

const SECTION_TAB_INDEX = {
  overview: 0,
  'バネ留め': 1,
  'A層': 2,
}

// メインコンポーネント
/**
 * 画像検査モジュールの全体ページ。URLクエリとセクションタブの状態を同期し、
 * ロットカードやサマリーの表示を統括する。
 * @returns {JSX.Element} 画像検査ダッシュボード全体のレイアウト。
 */
const ImageInspection = () => {
  // 現在選択中のタブインデックス
  const [activeTab, setActiveTab] = useState(0)
  const [syncedLotIdForTab, setSyncedLotIdForTab] = useState(null)

  // 検査ロット関連のデータ取得・操作関数
  const {
    getSectionLots,
    getLotStatus,
    getSectionStats,
    getFailReasons,
    getLatestLot,
    getLotShotsByCamera,
    getLotShots,
    getLotShotsStatus,
    getLotShotsSummary,
    getAvailableDates,
    ensureLotShotsLoaded,
    getLotById,
    ensureLotLoaded,
  } = useLotsData()

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selectedLotId = searchParams.get('lot')

  // ======== 処理ステップ: 初期フェッチとタブ同期 ========
  // 1. URLにlotクエリがあれば該当ロットを確実にロードする。
  // 2. ロード済みロットのセクションに合わせてタブを強制同期する。意図としてUXの混乱を避ける。
  useEffect(() => {
    if (!selectedLotId) return
    ensureLotLoaded(selectedLotId)
  }, [selectedLotId, ensureLotLoaded])

  const selectedLotInfo = useMemo(() => getLotById(selectedLotId), [getLotById, selectedLotId])

  useEffect(() => {
    if (!selectedLotInfo) {
      if (syncedLotIdForTab !== null) setSyncedLotIdForTab(null)
      return
    }

    const targetIndex = SECTION_TAB_INDEX[selectedLotInfo.section]
    if (typeof targetIndex !== 'number') return

    if (syncedLotIdForTab === selectedLotInfo.lotId) return

    setActiveTab(targetIndex)
    setSyncedLotIdForTab(selectedLotInfo.lotId)
  }, [selectedLotInfo, syncedLotIdForTab])

  const handleSectionCardClick = sectionKey => {
    const targetIndex = SECTION_TAB_INDEX[sectionKey]
    if (typeof targetIndex !== 'number') return
    if (targetIndex === activeTab) return
    setActiveTab(targetIndex)
  }

  /**
   * クエリパラメータの lot 指定と内部状態を同期する。
   * @param {string|null} lotId - 選択したロットID。null の場合はクエリを削除する。
   */
  const updateUrlWithLot = lotId => {
    const currentLot = searchParams.get('lot')
    const params = new URLSearchParams(searchParams.toString())

    if (lotId) {
      if (currentLot === lotId) return
      params.set('lot', lotId)
    } else {
      if (!currentLot) return
      params.delete('lot')
    }

    const queryString = params.toString()
    const url = queryString ? `${pathname}?${queryString}` : pathname
    router.push(url, { scroll: false })
  }

  const handleOpenLot = lot => {
    ensureLotLoaded?.(lot.lotId)
    updateUrlWithLot(lot.lotId)
  }

  const handleCloseLot = () => {
    updateUrlWithLot(null)
  }

  // 画像拡大表示用ライトボックス状態
  const [lightbox, setLightbox] = useState({ open: false, src: '', fallback: '', alt: '' })

  // タブ切り替え時の処理
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  // 「全体表示」タブの内容
  /**
   * 全体表示タブでは最新ロットから推測した各セクションのリアルタイムカードを描画する。
   * @returns {JSX.Element} グリッド状に並んだセクション概要カード群。
   */
  const renderOverviewTab = () => {
    const renderRealtimeCard = sectionKey => {
      const latest = getLatestLot(sectionKey)
      const lotStatus = latest ? getLotStatus(latest) : undefined
      const fallbackNames = SECTION_CONFIG[sectionKey]?.cameras || []

      const cameraNames = (() => {
        if (sectionKey === 'A層') {
          return fallbackNames
        }
        const dynamicNames = Array.from(new Set((latest?.cameras || []).map(cam => cam?.name).filter(Boolean)))
        return dynamicNames.length ? dynamicNames : fallbackNames
      })()

      const statusByName = (() => {
        if (sectionKey === 'A層') {
          const normalizedLotStatus = (lotStatus || '').toString().trim().toUpperCase()
          const mappedStatus = (() => {
            if (normalizedLotStatus === 'PASS') return 'PASS'
            if (normalizedLotStatus === 'FAIL') return 'FAIL'
            if (normalizedLotStatus === 'MISSING') return 'MISSING'
            if (normalizedLotStatus === 'OK') return 'PASS'
            if (normalizedLotStatus === 'NG') return 'FAIL'
            return normalizedLotStatus || ''
          })()
          if (!mappedStatus) return {}
          return Object.fromEntries(fallbackNames.map(name => [name, mappedStatus]))
        }
        const entries = (latest?.cameras || [])
          .filter(cam => cam?.name)
          .map(cam => [cam.name, cam.status])
        return Object.fromEntries(entries)
      })()

      const imageByName = (() => {
        if (!latest) return {}
        if (sectionKey === 'A層') {
          const representative = latest.representativeImage
          if (!representative) return {}
          return Object.fromEntries((cameraNames || []).map(name => [name, representative]))
        }
        const entries = (latest.cameras || [])
          .filter(cam => cam?.name && cam?.image_path)
          .map(cam => [cam.name, cam.image_path])
        if (entries.length > 0) return Object.fromEntries(entries)
        if (latest.representativeImage) {
          return Object.fromEntries((cameraNames || []).map(name => [name, latest.representativeImage]))
        }
        return {}
      })()

      const cameraCount = cameraNames.length
      const title = `${sectionKey}検査`

      return (
        <Grid item xs={12} lg={6} sx={{ display: 'flex' }} key={sectionKey}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>
            <CardActionArea
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                transition: theme => theme.transitions.create(['transform', 'box-shadow'], {
                  duration: theme.transitions.duration.shortest,
                }),
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme => theme.shadows[4],
                },
                '&:focus-visible': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme => theme.shadows[4],
                },
              }}
              onClick={() => handleSectionCardClick(sectionKey)}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  最新ログ: {title}（{cameraCount}カメラ）
                </Typography>
                {cameraNames.length === 0 ? (
                  <Typography color="text.secondary">カメラ構成が取得できません。</Typography>
                ) : (
                  <CameraGrid
                    cameraNames={cameraNames}
                    statusByName={statusByName}
    /**
     * クエリパラメータにlotを付け替えてURLと状態を同期する。
     * @param {string|null} lotId - 選択中ロットID。nullならクエリを削除する。
     */
                    imageByName={imageByName}
                  />
                )}
                <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2 }}>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    最新の画像判定
                  </Typography>
                  <SectionSummary latestLot={latest} lotStatus={lotStatus} />
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      )
    }

    return (
      <Grid container spacing={3}>
        {['バネ留め', 'A層'].map(renderRealtimeCard)}
      </Grid>
    )
  }

  // 各セクションタブの内容（propsで必要な関数や状態を渡す）
  /**
   * セクションごとの詳細タブを描画し、必要なデータフェッチ関数とライトボックス状態を橋渡しする。
   * @param {string} section - 表示対象の検査セクション名。
   * @returns {JSX.Element} SectionTab コンポーネント。
   */
  const renderSectionTab = (section) => (
    <SectionTab
      section={section}
      getSectionLots={getSectionLots}
      getLotStatus={getLotStatus}
      getLotShotsByCamera={getLotShotsByCamera}
      getLotShots={getLotShots}
      getLotShotsStatus={getLotShotsStatus}
      getLotShotsSummary={getLotShotsSummary}
      ensureLotShotsLoaded={ensureLotShotsLoaded}
      getSectionStats={getSectionStats}
      getFailReasons={getFailReasons}
      lightbox={lightbox}
      setLightbox={setLightbox}
      getLatestLot={getLatestLot}
      getAvailableDates={getAvailableDates}
      selectedLotId={selectedLotId}
      selectedLotInfo={selectedLotInfo}
      onOpenLot={handleOpenLot}
      onCloseLot={handleCloseLot}
    />
  )

  // レンダリング
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* タブナビゲーション */}
        <Grid item xs={12}>
          <StyledTabs value={activeTab} onChange={handleTabChange}>
            <StyledTab label="全体表示" />
            <StyledTab label="バネ留め検査" />
            <StyledTab label="A層検査" />
          </StyledTabs>
        </Grid>
        {/* タブコンテンツ */}
        <Grid item xs={12}>
          {activeTab === 0 && renderOverviewTab()}
          {activeTab === 1 && renderSectionTab('バネ留め')}
          {activeTab === 2 && renderSectionTab('A層')}
        </Grid>
      </Grid>
    </Box>
  )
}

// デフォルトエクスポート
export default ImageInspection
