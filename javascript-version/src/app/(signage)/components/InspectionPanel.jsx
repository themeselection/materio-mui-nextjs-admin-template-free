"use client"

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

export default function InspectionPanel({ overallStatus, tiles }) {
  // 全体文字の色
  const getStatusColor = (status) => {
    if (status === 'PASS') return 'success.main'
    if (status === 'FAIL') return 'error.main'
    return 'text.disabled' // グレー
  }

  // 表示する文字（PASS/FAIL以外は WAIT と表示する）
  const getStatusText = (status) => {
    if (status === 'PASS' || status === 'FAIL') return status
    return 'WAIT' // 別の文字（待機中など）に変更可能
  }

  const getChipColor = (status) => {
    if (status === 'PASS') return 'success'
    if (status === 'FAIL') return 'error'
    return 'default'
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader 
        sx={{ py: 2, px: 3 }}
        title={
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant='h4' fontWeight={700} sx={{ fontSize: { xs: '2.2rem', md: '2.4rem' } }}>
              画像検査
            </Typography>
            <Typography 
              variant='h3' 
              fontWeight={900} 
              color={getStatusColor(overallStatus)} 
              sx={{ fontSize: { xs: '2.5rem', md: '3rem' }, lineHeight: 1, mr: 4 }}
            >
              {getStatusText(overallStatus)}
            </Typography>
          </Stack>
        } 
      />
      <CardContent sx={{ pt: 0, pb: 2, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <Grid container spacing={1} sx={{ flexGrow: 1, minHeight: 0 }}>
          {tiles.map((t, i) => (
            <Grid item xs={6} key={i} sx={{ height: '50%' }}>
              <Box sx={{ 
                position: 'relative', borderRadius: 2, overflow: 'hidden', bgcolor: 'black',
                width: '100%', height: '100%', border: '1px solid #333',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {t.imageUrl && (
                  <img src={t.imageUrl} alt={t.cameraId} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none' }} />
                )}
                <Typography sx={{ position: 'absolute', top: 6, left: 8, bgcolor: 'rgba(0,0,0,0.6)', px: 0.8, py: 0.2, borderRadius: 1, fontSize: '0.9rem', zIndex: 2 }} variant='subtitle1' color='grey.300' fontWeight={600}>
                  {t.cameraId}
                </Typography>
                <Chip size='small' color={getChipColor(t.status)} label={t.status} sx={{ position: 'absolute', top: 6, right: 8, fontWeight: 700, zIndex: 2 }} />
                {t.failReason && (
                  <Chip size='small' color={getChipColor(t.status)} variant='filled' label={t.failReason} sx={{ position: 'absolute', bottom: 6, right: 8, zIndex: 2, fontWeight: 700 }} />
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}