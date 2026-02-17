"use client"

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Fade from '@mui/material/Fade'

export default function AlertOverlay({ alert }) {
  return (
    <Fade in={alert.open} timeout={300} unmountOnExit>
      <Box sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.8)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
        <Box sx={{ position: 'absolute', inset: 0, opacity: 0.2, backgroundImage: 'repeating-linear-gradient(-45deg, #f59e0b, #f59e0b 25px, #1f2937 25px, #1f2937 50px)' }} />
        <Box sx={{ textAlign: 'center', zIndex: 1 }}>
          <Typography variant='h1' fontWeight={900} color='error.main' sx={{ lineHeight: 1, animation: 'flash 1s infinite', fontSize: { xs: 72, md: 180 } }}>警告</Typography>
          <Box sx={{ mt: 6, bgcolor: 'rgba(0,0,0,0.8)', p: 4, border: theme => `4px solid ${theme.palette.warning.main}`, borderRadius: 2 }}>
            <Typography variant='h2' fontWeight={800} color='warning.main' sx={{ wordBreak: 'break-word' }}>{alert.title}</Typography>
            <Typography variant='h4' mt={4} color='common.white'>{alert.message}</Typography>
          </Box>
        </Box>
        <style jsx global>{`
          @keyframes flash { 0%,100% { opacity: 1 } 50% { opacity: .5 } }
        `}</style>
      </Box>
    </Fade>
  )
}
