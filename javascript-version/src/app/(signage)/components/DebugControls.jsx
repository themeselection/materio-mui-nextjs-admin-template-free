"use client"

import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

export default function DebugControls({ onError, onWarning, onNormal }) {
  return (
    <Stack direction='row' spacing={1.5} sx={{ pt: 1 }}>
      <Button size='medium' variant='contained' color='error' onClick={onError} sx={{ fontSize: '1rem' }}>デバッグ: エラー発生</Button>
      <Button size='medium' variant='contained' color='warning' onClick={onWarning} sx={{ fontSize: '1rem' }}>デバッグ: 警告発生</Button>
      <Button size='medium' variant='contained' color='success' onClick={onNormal} sx={{ fontSize: '1rem' }}>デバッグ: 正常化</Button>
    </Stack>
  )
}
