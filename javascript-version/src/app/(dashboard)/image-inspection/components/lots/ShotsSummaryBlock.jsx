/*
======== ファイル概要 ========
ショットサマリーをカード状に表示し、総数/良品/不良/進捗バーをひとまとめにする表示ブロック。
*/

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'

import { alpha } from '@mui/material/styles'

import SurfaceBox from '@/components/surface/SurfaceBox'

/**
 * 0〜100の範囲に収めた整数パーセンテージを返す。
 * @param {number} value - 元の値。
 * @returns {number}     端数切り捨て済みパーセント。
 */
const clampPercent = value => {
  const num = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(num)) return 0
  if (num < 0) return 0
  if (num > 100) return 100
  return Math.round(num)
}

/**
 * 撮影サマリーをタイルで表示する。
 * @param {object} props           - プロパティ集合。
 * @param {string} [props.title]   - セクションタイトル。
 * @param {object} props.summary   - total/pass/fail/率を含むオブジェクト。
 * @returns {JSX.Element|null}      表示内容。
 */
const ShotsSummaryBlock = ({ title, summary }) => {
  if (!summary) return null

  const total = Number.isFinite(summary.total) ? summary.total : 0
  const okCount = Number.isFinite(summary.okCount) ? summary.okCount : 0
  const ngCount = Number.isFinite(summary.ngCount) ? summary.ngCount : Math.max(total - okCount, 0)
  const okRate = clampPercent(summary.okRate)
  const ngRate = clampPercent(summary.ngRate ?? 100 - okRate)

  // ======== 処理ステップ: KPIカード → 進捗バー → 比率テキスト ========
  // 1. KPIカードで総数/良品/不良を個別ボックスに分け、数値の比較をしやすくする。
  // 2. 進捗バーは良率をバーの長さで示し、不良率には背景色を使ってコントラストを取る。
  // 3. 比率テキストで最終的なパーセンテージを示し、バー見ただけでは分からない正確値を補う。
  return (
    <Box sx={{ '& + &': { mt: 3 } }}>
      {title ? (
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
      ) : null}
      <Grid container spacing={1.5}>
        <Grid item xs={4}>
          <SurfaceBox variant="soft" sx={{ p: 1.5, borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              総枚数
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {total}
            </Typography>
          </SurfaceBox>
        </Grid>
        <Grid item xs={4}>
          <SurfaceBox variant="soft" sx={{ p: 1.5, borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              良品画像
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="success.main">
              {okCount}
            </Typography>
          </SurfaceBox>
        </Grid>
        <Grid item xs={4}>
          <SurfaceBox variant="soft" sx={{ p: 1.5, borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              不良画像
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="error.main">
              {ngCount}
            </Typography>
          </SurfaceBox>
        </Grid>
      </Grid>
      <Box sx={{ mt: 2 }}>
        <LinearProgress
          variant="determinate"
          value={okRate}
          sx={theme => ({
            height: 8,
            borderRadius: 4,
            bgcolor: alpha(theme.palette.error.main, theme.palette.mode === 'dark' ? 0.5 : 0.2),
            '& .MuiLinearProgress-bar': {
              backgroundColor: theme.palette.success.main,
            },
          })}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption" color="success.main">
            良率 {okRate}%
          </Typography>
          <Typography variant="caption" color="error.main">
            不良率 {ngRate}%
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default ShotsSummaryBlock
