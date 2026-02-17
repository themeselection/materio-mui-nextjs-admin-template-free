"use client"

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import { alpha } from '@mui/material/styles'

const pad2 = n => String(Math.max(0, Number(n) || 0)).padStart(2, '0')

const UptimeRich = ({ seconds }) => {
  const sec = Math.max(0, Math.floor(Number(seconds) || 0))
  const d = Math.floor(sec / 86400)
  const h = Math.floor((sec % 86400) / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  return (
    <Typography variant='h3' fontWeight={900}>
      {d ? (<><b>{d}</b><Typography component='span' variant='h5'>d </Typography></>) : null}
      <b>{h}</b><Typography component='span' variant='h5'>h </Typography>
      <b>{m}</b><Typography component='span' variant='h5'>m </Typography>
      <Typography component='span' variant='h5'>{String(s).padStart(2, '0')}</Typography>
      <Typography component='span' variant='h5'>s</Typography>
    </Typography>
  )
}

const badgeColor = kind => kind === 'error' ? 'error' : kind === 'warning' ? 'warning' : 'success'
const badgeLabel = kind => kind === 'error' ? 'エラー' : kind === 'warning' ? '警告' : '正常'

export default function MachineStatusPanel({
  machineName,
  machineBadge,
  todayUptimeSec,
  todayProdCount,
  logs,
  formatNumber
}) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
  <CardHeader title={<Typography variant='h4' fontWeight={700} sx={{ fontSize: { xs: '2.2rem', md: '2.4rem' } }}>機械状況</Typography>} />
      <CardContent sx={{ pt: 0, display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1, minHeight: 0 }}>
        <Stack direction='row' alignItems='center' justifyContent='space-between'>
          <Typography variant='h5' fontWeight={700} sx={{ fontSize: { xs: '1.9rem', md: '2.1rem' } }}>{machineName}</Typography>
          <Chip color={badgeColor(machineBadge)} label={badgeLabel(machineBadge)} sx={{ fontSize: 20, px: 1.5, py: 1 }} />
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
              <Typography variant='body1' color='text.secondary' sx={{ fontSize: '1.1rem' }}>本日の稼働時間</Typography>
              <UptimeRich seconds={todayUptimeSec} />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
              <Typography variant='body1' color='text.secondary' sx={{ fontSize: '1.1rem' }}>本日の生産数</Typography>
              <Typography variant='h3' fontWeight={900}>{formatNumber(todayProdCount)}</Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 0 }}>
          <Typography variant='h6' fontWeight={700} sx={{ mb: 1, fontSize: { xs: '1.6rem', md: '1.7rem' } }}>最新エラーログ</Typography>
          <Box sx={{ overflowY: 'auto', pr: 1, flexGrow: 1 }}>
            {(!logs || logs.length === 0) && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant='body1' color='text.primary' fontWeight={600}>I-001: 起動シーケンス完了</Typography>
                <Typography variant='caption' color='text.secondary'>--:--:--</Typography>
              </Box>
            )}
            {(logs || []).map((lg, idx) => {
              const type = String(lg.log_type || 'info').toLowerCase()
              const isError = type === 'error'
              const isWarning = type === 'warning'
              const bgColor = isError
                ? (theme) => alpha(theme.palette.error.main, 0.15)
                : isWarning
                  ? (theme) => alpha(theme.palette.warning.main, 0.18)
                  : 'background.default'
              const titleColor = isError ? 'error.main' : isWarning ? 'warning.dark' : 'text.primary'
              const msgColor = isError ? 'error.dark' : isWarning ? 'warning.main' : 'text.secondary'
              let tsText = '--:--:--'
              try {
                const d = new Date(lg.timestamp)
                tsText = `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
              } catch {}
              return (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    bgcolor: bgColor,
                    borderRadius: 1,
                    mb: 1,
                    border: '1px solid',
                    borderColor: isError ? 'error.main' : isWarning ? 'warning.main' : 'divider'
                  }}
                >
                  <Box>
                    <Typography variant='body1' fontWeight={700} color={titleColor}>{lg.title || ''}</Typography>
                    {lg.message ? <Typography variant='caption' color={msgColor}>{lg.message}</Typography> : null}
                  </Box>
                  <Typography variant='caption' color='text.secondary'>{tsText}</Typography>
                </Box>
              )
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
