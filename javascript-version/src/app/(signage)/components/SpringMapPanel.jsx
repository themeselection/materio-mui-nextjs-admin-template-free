import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'

// 各バネのステータス表示用パーツ
const SpringBox = ({ label, number, status }) => {
  // 'ok' または 'PASS' なら緑色
  const isOk = status === 'ok' || status === 'PASS'
  // 'ng' または 'FAIL' なら赤色
  const isNg = status === 'ng' || status === 'FAIL'
  
  const color = isOk ? '#00e676' : isNg ? '#ff5252' : '#757575'
  const bgColor = isOk ? 'rgba(0, 230, 118, 0.1)' : isNg ? 'rgba(255, 82, 82, 0.1)' : 'rgba(255, 255, 255, 0.05)'

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
      <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 'bold', color: 'text.secondary' }}>
        {label}
      </Typography>
      <Paper
        elevation={0}
        sx={{
          flexGrow: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `3px solid ${color}`,
          bgcolor: bgColor,
          borderRadius: 3,
          color: color,
          minHeight: '80px',
          transition: 'all 0.3s ease'
        }}
      >
        <Typography variant="h3" fontWeight={900} sx={{ textShadow: `0 0 10px ${color}40` }}>
          {number}
        </Typography>
      </Paper>
    </Box>
  )
}

const SpringMapPanel = ({ data }) => {
  // dataプロップスがない場合のフォールバック（動作確認用）
  const results = data || {
    spring1: 'ok', spring2: 'ng', spring3: 'ok', spring4: 'ng', 
  }

  const TOP_SPACER_HEIGHT = '25%' 

  return (
    <Box sx={{ 
      height: '100%', width: '100%', 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      bgcolor: 'background.paper', borderRadius: 2, p: 2
    }}>
      <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 4, letterSpacing: 1 }}>
        バネどめ検査カメラ
      </Typography>

      <Box sx={{ display: 'flex', width: '100%', maxWidth: '900px', height: '100%', maxHeight: '500px', gap: 2 }}>
        <Box sx={{ width: '20%', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ height: TOP_SPACER_HEIGHT, transition: 'height 0.3s' }} /> 
          <Box sx={{ flex: 1 }}>
            <SpringBox label="B-spring01" number="1" status={results.spring1} />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', width: '60%', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, height: '30%' }}>
            <Box sx={{ flex: 1 }}>
              <SpringBox label="B-spring02" number="2" status={results.spring2} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <SpringBox label="B-spring03" number="3" status={results.spring3} />
            </Box>
          </Box>
          <Box sx={{ 
            flex: 1, 
            border: '2px dashed rgba(255, 255, 255, 0.2)', 
            borderRadius: 3, 
            bgcolor: 'rgba(0, 0, 0, 0.2)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'text.secondary'
          }}>
            <Typography variant="h5" fontWeight="bold" sx={{ opacity: 0.5 }}>
              押し上げ部
            </Typography>
          </Box>
        </Box>

        <Box sx={{ width: '20%', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ height: TOP_SPACER_HEIGHT, transition: 'height 0.3s' }} /> 
          <Box sx={{ flex: 1 }}>
            <SpringBox label="B-spring04" number="4" status={results.spring4} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default SpringMapPanel