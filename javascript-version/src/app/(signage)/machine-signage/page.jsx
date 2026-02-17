"use client"

import { useState, useEffect, useMemo } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import useSignageData from '../components/useSignageData'
import MachineStatusPanel from '../components/MachineStatusPanel'
import InspectionPanel from '../components/InspectionPanel'
import SpringMapPanel from '../components/SpringMapPanel'
import DebugControls from '../components/DebugControls'
import AlertOverlay from '../components/AlertOverlay'

const SSE_URL = '/api/sse' 

const Page = () => {
  const data = useSignageData()
  const [showMap, setShowMap] = useState(false)

  // 【変更箇所】data.tiles からマップ用のデータオブジェクトを作成
  const mapData = useMemo(() => {
    return {
      spring1: data.tiles.find(t => t.cameraId === 'B-spring01')?.status,
      spring2: data.tiles.find(t => t.cameraId === 'B-spring02')?.status,
      spring3: data.tiles.find(t => t.cameraId === 'B-spring03')?.status,
      spring4: data.tiles.find(t => t.cameraId === 'B-spring04')?.status,
    }
  }, [data.tiles])

  useEffect(() => {
    const timer = setInterval(() => {
      setShowMap((prev) => !prev)
    }, 10000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.EventSource) return
    const eventSource = new EventSource(SSE_URL)

    eventSource.addEventListener('sse:connected', (e) => {
      console.log('SSE Connected')
    })

    const handleUpdate = (event) => {
      console.log('New data received:', event.type)
      // 必要に応じてここでデータの再取得を行う
    }

    eventSource.addEventListener('inspection:imageUploaded', handleUpdate)
    eventSource.addEventListener('inspection:resultUpdated', handleUpdate)
    eventSource.addEventListener('machine:started', handleUpdate)

    return () => eventSource.close()
  }, [])

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', fontSize: '125%', overflow: 'hidden' }}>
      <Box sx={{ px: 4, py: 3, flexShrink: 0 }}>
        <Stack direction='row' alignItems='center' justifyContent='space-between'>
          <Box>
            <Typography variant='h3' fontWeight={900} letterSpacing={2} sx={{ fontSize: { xs: '2.75rem', md: '3.25rem' } }}>
              工場ダッシュボード
            </Typography>
            <DebugControls onError={data.onDebugError} onWarning={data.onDebugWarning} onNormal={data.onDebugNormal} />
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant='h3' fontWeight={800} sx={{ fontSize: { xs: '2.75rem', md: '3.25rem' } }}>{data.clock.time}</Typography>
            <Typography variant='h5' color='text.secondary' sx={{ fontSize: { xs: '1.75rem', md: '2rem' } }}>{data.clock.date}</Typography>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ px: 4, pb: 4, flexGrow: 1, minHeight: 0, overflow: 'hidden' }}>
        <Grid container spacing={4} sx={{ height: '100%' }}>
          <Grid item xs={12} xl={4} sx={{ height: '100%' }}>
            <MachineStatusPanel
              machineName={data.machineName}
              machineBadge={data.machineBadge}
              todayUptimeSec={data.todayUptimeSec}
              todayProdCount={data.todayProdCount}
              logs={data.logs}
              formatNumber={data.formatNumber}
            />
          </Grid>

          <Grid item xs={12} xl={8} sx={{ height: '100%' }}>
            <Stack spacing={4} sx={{ height: '100%' }}>
              <Box sx={{ flexGrow: 1, minHeight: 0, position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ 
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  opacity: showMap ? 0 : 1,
                  transition: 'opacity 0.5s ease-in-out',
                  pointerEvents: showMap ? 'none' : 'auto',
                  zIndex: showMap ? 0 : 1
                }}>
                  <InspectionPanel overallStatus={data.overallStatus} tiles={data.tiles} />
                </Box>

                <Box sx={{ 
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  opacity: showMap ? 1 : 0,
                  transition: 'opacity 0.5s ease-in-out',
                  zIndex: showMap ? 1 : 0
                }}>
                  {/* 【変更箇所】変換した本物のデータを渡す */}
                  <SpringMapPanel data={mapData} />
                </Box>
              </Box>

              <Grid container spacing={3} sx={{ flexShrink: 0 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant='body1' color='text.secondary' sx={{ fontSize: '1.1rem' }}>rot_id</Typography>
                    <Typography variant='h4' fontWeight={700} sx={{ fontSize: { xs: '2.2rem', md: '2.5rem' } }}>{data.rotId || '---'}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant='body1' color='text.secondary' sx={{ fontSize: '1.1rem' }}>検査時間</Typography>
                    <Typography variant='h4' fontWeight={700} sx={{ fontSize: { xs: '2.2rem', md: '2.5rem' } }}>{data.inspectionTime}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <AlertOverlay alert={data.alert} />
    </Box>
  )
}

export default Page