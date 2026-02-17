'use client'

import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Slider from '@mui/material/Slider'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'

const DisplaySettings = () => {
  const [easyMode, setEasyMode] = useState(false)
  const [themeMode, setThemeMode] = useState('system')
  const [colorPreset, setColorPreset] = useState('default')
  const [fontSize, setFontSize] = useState('md')
  const [density, setDensity] = useState('comfortable')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [borderRadius, setBorderRadius] = useState(10)
  const [reduceMotion, setReduceMotion] = useState(false)

  return (
    <Card>
      <CardHeader
        title='表示設定'
        subheader='ここで UI の見た目を調整できます（ダミー設定のため保存は行われません）。'
      />
      <Divider />
      <CardContent>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <FormGroup>
              <FormControlLabel
                control={<Switch checked={easyMode} onChange={e => setEasyMode(e.target.checked)} />}
                label='かんたんモード'
              />
              <Typography variant='body2' color='text.secondary' sx={{ ml: 5 }}>
                UI を簡略化して主要機能のみを表示します。
              </Typography>
            </FormGroup>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id='theme-mode-label'>テーマ</InputLabel>
              <Select
                labelId='theme-mode-label'
                label='テーマ'
                value={themeMode}
                onChange={e => setThemeMode(e.target.value)}
              >
                <MenuItem value='light'>ライト</MenuItem>
                <MenuItem value='dark'>ダーク</MenuItem>
                <MenuItem value='system'>システム</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id='color-preset-label'>配色プリセット</InputLabel>
              <Select
                labelId='color-preset-label'
                label='配色プリセット'
                value={colorPreset}
                onChange={e => setColorPreset(e.target.value)}
              >
                <MenuItem value='default'>デフォルト</MenuItem>
                <MenuItem value='blue'>ブルー系</MenuItem>
                <MenuItem value='green'>グリーン系</MenuItem>
                <MenuItem value='purple'>パープル系</MenuItem>
                <MenuItem value='orange'>オレンジ系</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id='font-size-label'>フォントサイズ</InputLabel>
              <Select
                labelId='font-size-label'
                label='フォントサイズ'
                value={fontSize}
                onChange={e => setFontSize(e.target.value)}
              >
                <MenuItem value='sm'>小</MenuItem>
                <MenuItem value='md'>標準</MenuItem>
                <MenuItem value='lg'>大</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id='density-label'>表示密度</InputLabel>
              <Select
                labelId='density-label'
                label='表示密度'
                value={density}
                onChange={e => setDensity(e.target.value)}
              >
                <MenuItem value='comfortable'>快適</MenuItem>
                <MenuItem value='compact'>コンパクト</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id='rows-label'>表の行数（1ページあたり）</InputLabel>
              <Select
                labelId='rows-label'
                label='表の行数（1ページあたり）'
                value={rowsPerPage}
                onChange={e => setRowsPerPage(e.target.value)}
              >
                {[10, 25, 50, 100].map(n => (
                  <MenuItem key={n} value={n}>
                    {n}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
              <Typography gutterBottom>カードの角丸</Typography>
              <Slider
                value={borderRadius}
                onChange={(_, v) => setBorderRadius(v)}
                min={0}
                max={24}
                step={2}
                valueLabelDisplay='auto'
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <FormGroup>
              <FormControlLabel
                control={<Switch checked={reduceMotion} onChange={e => setReduceMotion(e.target.checked)} />}
                label='アニメーションを減らす'
              />
              <Typography variant='body2' color='text.secondary' sx={{ ml: 5 }}>
                画面遷移や装飾的なアニメーションを最小限にします。
              </Typography>
            </FormGroup>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant='caption' color='text.secondary'>
              すべてダミー設定です。リロードすると元に戻ります。
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default DisplaySettings
