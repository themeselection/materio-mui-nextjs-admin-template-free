'use client'

/*
======== ファイル概要 ========
機械ステータス管理ページ。APIで取得した機械情報とエラーログを集約し、点検操作やフィルタリング付きで可視化する。
*/

import { useEffect, useMemo, useRef, useState } from 'react'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import SurfaceBox from '@/components/surface/SurfaceBox'

import { UnitStatusLamps } from './components/UnitStatusLamps'
import { ErrorLogList } from './components/ErrorLogList'
import { InspectionDialog, IntervalDialog } from './components/InspectionDialogs'
import { useMachineInfo } from './hooks/useMachineInfo'
import { useMachineLogs } from './hooks/useMachineLogs'
import { formatYmdSlash, secondsToHMS } from './utils/date'

const machineInfo = { image: '/images/projectpic/image.png' }

/**
 * 機械ごとの稼働状況とログをまとめて表示するページコンポーネント。
 * @returns {JSX.Element}                           完成したページのJSX要素。
 */
const MachineStatus = () => {
  // APIの{id}は固定でこの機械名を使用
  const machineId = '半自動表層バネどめ機'

  const [logType, setLogType] = useState('すべて')
  const [logDate, setLogDate] = useState('')

  // ======== 状態管理: 機械情報の取得結果を保持 ========
  // --- 機械基本情報（/api/machines/{id}） ---
  const {
    machineName,
    todayUptimeHms,
    todayProductionCount,
    machineDataLoading,
    machineDataError,
    uptimeSeconds,
    setLastInspectionDate,
    lastInspectionDate,
    inspectionIntervalDays,
    setInspectionIntervalDays,
    nextInspectionDate,
    defaultInfo,
  } = useMachineInfo(machineId)

  // ======== 状態管理: ログ情報の取得結果を保持 ========
  const { processedLogs, loading, fetchError, isFallbackData, unitStatuses, globalStatusLabel } = useMachineLogs(machineId)

  // ダイアログ管理
  const [openInspection, setOpenInspection] = useState(false)
  const [openInterval, setOpenInterval] = useState(false)
  const [savingInterval, setSavingInterval] = useState(false)
  const [completingInspection, setCompletingInspection] = useState(false)

  // スナックバー
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const showSnack = (message, severity = 'success') => setSnackbar({ open: true, message, severity })
  const closeSnack = () => setSnackbar(s => ({ ...s, open: false }))

  // ======== フィルタリング: ログを種類と日付で絞り込み ========
  // フィルタ適用
  const filteredLogs = useMemo(() => {
    return processedLogs.filter((log) => {
      const typeMatch = logType === 'すべて' || log.type === logType // 「すべて」の場合は全件通す
      const dateMatch = !logDate || log.date === logDate            // 未指定時は日付条件を無効化する

      return typeMatch && dateMatch
    })
  }, [processedLogs, logType, logDate])

  // ======== レイアウト制御: ログリスト高さの固定 ========
  // ログリストの初期高さを固定して、以降はスクロールに切り替え（縦に伸びない）
  const logListRef = useRef(null)
  const [logListMaxHeight, setLogListMaxHeight] = useState(null)

  useEffect(() => {
    // DOM参照が未確定、またはすでに初期高さが決まっている場合は再計測しない
    if (!logListRef.current || logListMaxHeight != null) return

    // 次フレームで計測して初期高さをロック
    const rAF = requestAnimationFrame(() => {
      const h = logListRef.current?.getBoundingClientRect().height

      if (h && h > 0) setLogListMaxHeight(h)
    })

    return () => cancelAnimationFrame(rAF)
  }, [logListMaxHeight])

  // ======== レイアウト制御: 左カラムと右カラムの高さ同期 ========
  // 左カラム(Card)の高さを監視して右カラムに反映
  const leftCardRef = useRef(null)
  const [leftCardHeight, setLeftCardHeight] = useState(null)

  useEffect(() => {
    // ResizeObserver が存在しない環境では同期不可のため早期リターン
    if (!leftCardRef.current || typeof ResizeObserver === 'undefined') return

    const ro = new ResizeObserver(entries => {
      const entry = entries[0]

      // エントリが欠落しているケースは無視して安全側に倒す
      if (!entry) return
      const h = entry.contentRect.height

      if (h && h > 0) setLeftCardHeight(h)
    })

    ro.observe(leftCardRef.current)

    return () => ro.disconnect()
  }, [])

  // ======== 集約処理: ユニット毎の状態から全体ラベルを決定 ========
  // ここから描画

  // ユニット状態から全体ステータスを集約（優先度: エラー > 警告 > 不明 > 正常）
  const overallStatus = useMemo(() => {
    const values = [...Object.values(unitStatuses), globalStatusLabel]
    const hasError = values.some(v => v === 'エラー' || v === '残弾なし')   // クリティカル停止は最優先で通知したい
    const hasWarn = values.some(v => v === '残弾わずか')                   // 材料残量など注意喚起は次点で扱う
    const hasUnknown = values.some(v => v === '不明')                      // 状態不明は運用判断が必要なため第三優先
    const hasStopped = values.some(v => v === '停止中')                    // 停止中は運転再開の検討が必要

    if (hasError) return { label: 'エラー', color: 'error' }
    if (hasStopped) return { label: '停止中', color: 'default' }
    if (hasWarn) return { label: '警告', color: 'warning' }
    if (hasUnknown) return { label: '不明', color: 'default' }

    return { label: '正常に稼働中', color: 'success' }
  }, [unitStatuses, globalStatusLabel])

  return (
    <>
      <Grid container spacing={6}>
        {/* タイトル・戻るリンク */}
        {/* <Typography variant='h4' sx={{ mb: 0, fontWeight: 700 }}>生産機械ステータス</Typography> */}

        {/* 2カラムレイアウト */}
        <Grid item xs={12}>
          <Grid container spacing={4}>
            {/* 左カラム: 機械画像・状態 */}
            <Grid item xs={12} md={5}>
            <Card ref={leftCardRef} sx={{ mb: 4, height: '100%' }}>
              <CardContent>
                <Typography variant='h6' fontWeight='bold' mb={2}>{machineName}</Typography>
                <SurfaceBox
                  variant='paper'
                  sx={{
                    width: '100%',
                    borderRadius: 2,
                    overflow: 'hidden',
                    mb: 2
                  }}
                >
                  <img
                    src={machineInfo.image}
                    alt={machineName}
                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                  />
                </SurfaceBox>
                <UnitStatusLamps unitStatuses={unitStatuses} />
                <Chip
                  label={overallStatus.label}
                  color={overallStatus.color}
                  sx={{ width: '100%', fontSize: 18, py: 2, fontWeight: 'bold' }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* 右カラム: 稼働データ・エラーログ */}
          <Grid item xs={12} md={7} sx={{ display: 'flex', flexDirection: 'column', height: '100%', ...(leftCardHeight ? { height: leftCardHeight } : {}) }}>
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box display='flex' alignItems='center' justifyContent='space-between' mb={2} gap={2}>
                  <Typography variant='h6' fontWeight='bold'>稼働データ</Typography>
                  <Box display='flex' gap={1} flexWrap='wrap'>
                    <Button variant='contained' color='primary' onClick={() => setOpenInspection(true)}>
                      点検
                    </Button>
                    <Button variant='outlined' color='secondary' onClick={() => setOpenInterval(true)}>
                      点検期間変更
                    </Button>
                    {machineDataLoading && <CircularProgress size={18} />}
                  </Box>
                </Box>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={6} sm={3}>
                    <SurfaceBox variant='soft' p={2} borderRadius={2} textAlign='center'>
                      <Typography variant='body2' color='text.secondary'>本日の稼働時間</Typography>
                      <Typography variant='h5' fontWeight='bold'>
                        {uptimeSeconds != null ? secondsToHMS(uptimeSeconds) : (todayUptimeHms || defaultInfo.todayWorkTime)}
                      </Typography>
                    </SurfaceBox>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <SurfaceBox variant='soft' p={2} borderRadius={2} textAlign='center'>
                      <Typography variant='body2' color='text.secondary'>本日の生産数</Typography>
                      <Typography variant='h5' fontWeight='bold'>
                        {todayProductionCount != null ? `${todayProductionCount.toLocaleString()}個` : defaultInfo.todayProduction}
                      </Typography>
                    </SurfaceBox>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <SurfaceBox variant='soft' p={2} borderRadius={2} textAlign='center'>
                      <Typography variant='body2' color='text.secondary'>最終点検日</Typography>
                      <Typography variant='h5' fontWeight='bold'>{formatYmdSlash(lastInspectionDate)}</Typography>
                    </SurfaceBox>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <SurfaceBox variant='soft' p={2} borderRadius={2} textAlign='center'>
                      <Typography variant='body2' color='text.secondary'>次回点検日</Typography>
                      <Typography variant='h5' fontWeight='bold'>{formatYmdSlash(nextInspectionDate)}</Typography>
                    </SurfaceBox>
                  </Grid>
                </Grid>
                {machineDataError && (
                  <Typography variant='caption' color='warning.main'>
                    {machineDataError}
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* エラーログ */}
            <Card sx={{ flex: 1, display: 'flex', minHeight: 0 }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                <Box display='flex' flexDirection={{ xs: 'column', sm: 'row' }} justifyContent='space-between' alignItems={{ xs: 'flex-start', sm: 'center' }} mb={2} gap={2}>
                  <Typography variant='h6' fontWeight='bold'>エラーログ</Typography>
                  <Box display='flex' gap={2} alignItems='center'>
                    <TextField
                      type='date'
                      size='small'
                      value={logDate}
                      onChange={e => setLogDate(e.target.value)}
                      sx={{ minWidth: 140 }}
                    />
                    <TextField
                      select
                      size='small'
                      value={logType}
                      onChange={e => setLogType(e.target.value)}
                      sx={{ minWidth: 100 }}
                    >
                      <MenuItem value='すべて'>すべて</MenuItem>
                      <MenuItem value='エラー'>エラー</MenuItem>
                      <MenuItem value='警告'>警告</MenuItem>
                      <MenuItem value='情報'>情報</MenuItem>
                    </TextField>
                    {loading && <CircularProgress size={20} />}
                  </Box>
                </Box>
                {isFallbackData && (
                  <Typography variant='caption' color='warning.main' sx={{ mb: 1 }}>
                    {fetchError || 'ログの取得に失敗しました。サンプルデータで表示しています。'}
                  </Typography>
                )}
                <Divider sx={{ mb: 2 }} />
                <Box ref={logListRef} sx={{ flex: 1, minHeight: 0 }}>
                  <ErrorLogList
                    logs={filteredLogs}
                    maxHeight={leftCardHeight ? `calc(${leftCardHeight}px - 140px)` : (logListMaxHeight || undefined)}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>

      {/* 点検ダイアログ */}
      <InspectionDialog
        open={openInspection}
        onClose={() => setOpenInspection(false)}
        onComplete={async () => {
          try {
            setCompletingInspection(true)
            const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
            const token = (typeof window !== 'undefined' && (localStorage.getItem('access_token') || sessionStorage.getItem('access_token'))) || ''

            const res = await fetch(`${base}/api/machines/${encodeURIComponent(machineId)}/complete-inspection`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            })

            if (!res.ok) {
              const err = await res.json().catch(() => ({}))

              throw new Error(err?.error || `Failed: ${res.status}`)
            }

            const data = await res.json()

            if (data?.last_inspection_date) {
              setLastInspectionDate(new Date(data.last_inspection_date))
            } else {
              setLastInspectionDate(new Date())
            }

            if (Number.isFinite(Number(data?.inspection_interval_days))) {
              setInspectionIntervalDays(Number(data.inspection_interval_days))
            }

            // 成功時: 進捗クリア
            try { if (typeof window !== 'undefined') localStorage.removeItem('machine-status:inspection-progress') } catch {}
            showSnack('点検を記録しました', 'success')
            setOpenInspection(false)
          } catch (e) {
            showSnack(`点検の記録に失敗しました: ${e?.message || e}`, 'error')
          } finally {
            setCompletingInspection(false)
          }
        }}
      />

      {/* 点検期間変更ダイアログ */}
      <IntervalDialog
        open={openInterval}
        onClose={() => setOpenInterval(false)}
        value={inspectionIntervalDays}
        onChange={(v) => setInspectionIntervalDays(v)}
        nextInspectionDate={nextInspectionDate}
        saving={savingInterval}
        onSave={async (newDays) => {
          try {
            setSavingInterval(true)
            const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
            const token = (typeof window !== 'undefined' && (localStorage.getItem('access_token') || sessionStorage.getItem('access_token'))) || ''

            const res = await fetch(`${base}/api/machines/${encodeURIComponent(machineId)}/inspection-interval`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
              body: JSON.stringify({ interval_days: Number(newDays) })
            })

            if (!res.ok) {
              const err = await res.json().catch(() => ({}))

              throw new Error(err?.error || `Failed: ${res.status}`)
            }

            const data = await res.json()

            if (Number.isFinite(Number(data?.inspection_interval_days))) {
              setInspectionIntervalDays(Number(data.inspection_interval_days))
            }

            if (data?.next_inspection_date) {
              // setLastInspectionDate は不要。次回点検日は派生で再計算されるが、APIの値を優先したい場合は last を逆算ではなく直接 next を表示に使う設計に変更が必要。
              // ここでは UI 仕様に合わせて interval 更新だけで派生計算を継続。
            }

            showSnack('点検間隔を変更しました', 'success')
            setOpenInterval(false)
          } catch (e) {
            showSnack(`点検間隔の変更に失敗しました: ${e?.message || e}`, 'error')
          } finally {
            setSavingInterval(false)
          }
        }}
      />

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={closeSnack} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert onClose={closeSnack} severity={snackbar.severity} sx={{ width: '100%' }}>
        {snackbar.message}
      </Alert>
      </Snackbar>
    </>
  )
}

export default MachineStatus
