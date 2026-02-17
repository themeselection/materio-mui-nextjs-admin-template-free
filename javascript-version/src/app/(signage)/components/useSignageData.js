"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const pad2 = n => String(Math.max(0, Number(n) || 0)).padStart(2, '0')
const formatDateYMD = iso => (iso ? String(iso).replace(/-/g, '/') : '--/--/--')
const formatNumber = n => {
  const num = Number(n) || 0
  try { return num.toLocaleString('ja-JP') } catch { return String(num) }
}

const CAMERA_IDS = ['B-spring01', 'B-spring02', 'B-spring03', 'B-spring04']

const useAuthHeader = () => {
  return useMemo(() => {
    if (typeof window === 'undefined') return {}
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
      return token ? { Authorization: `Bearer ${token}` } : {}
    } catch {
      return {}
    }
  }, [])
}

export default function useSignageData() {
  const authHeader = useAuthHeader()

  // --- States ---
  const [clock, setClock] = useState({ time: '--:--', date: '----/--/-- (--)' })
  const [machineName, setMachineName] = useState('自動表層バネどめ機')
  const [todayProdCount, setTodayProdCount] = useState(0)
  const [lastInspectionDate, setLastInspectionDate] = useState('')
  const [nextInspectionDate, setNextInspectionDate] = useState('')
  const [startedAt, setStartedAt] = useState(null)
  const [todayUptimeSec, setTodayUptimeSec] = useState(0)
  const [machineBadge, setMachineBadge] = useState('info')
  const [logs, setLogs] = useState([])
  const [overallStatus, setOverallStatus] = useState('WAIT')
  const [rotId, setRotId] = useState('')
  const [inspectionTime, setInspectionTime] = useState('--:--:--')
  
  const [tiles, setTiles] = useState(() => (
    [1, 2, 3, 4].map(i => ({ index: i, cameraId: CAMERA_IDS[i - 1], status: '---', imageUrl: '', failReason: '' }))
  ))
  
  const [alert, setAlert] = useState({ open: false, title: '', message: '' })
  const alertTimerRef = useRef(null)

  // --- API Helpers ---
  const fetchJson = useCallback((url, timeoutMs = 5000) => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    return fetch(url, { signal: controller.signal, headers: { Accept: 'application/json', ...authHeader } })
      .then(res => {
        clearTimeout(timer)
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        return res.json()
      })
      .catch(err => { throw err })
  }, [authHeader])

  const getMachine = useCallback((id = 1) => fetchJson(`/api/machines/${id}`), [fetchJson])
  const getMachineLogs = useCallback((id = 1) => fetchJson(`/api/machines/${id}/logs?page=1&limit=10`), [fetchJson])
  
  const getLotsList = useCallback((limit = 5) => 
    fetchJson(`/api/inspections/lots?section=spring&page=1&limit=${limit}`), [fetchJson])
  
  const getLotShots = useCallback((lotId) => 
    fetchJson(`/api/inspections/lots/${encodeURIComponent(String(lotId))}/shots`), [fetchJson])
  
  const buildInspectionImageUrl = useCallback(imagePath => {
    if (!imagePath) return ''
    const imageBase = `http://10.100.54.170:3001`
    const p = imagePath.replace(/\\/g, '/')
    return p.startsWith('/') ? `${imageBase}${p}` : `${imageBase}/${p}`
  }, [])

  // --- Data Loaders ---
  const loadMachine = useCallback(async () => {
    try {
      const data = await getMachine(1)
      if (data?.machine_name) setMachineName(data.machine_name)
      if (data?.today_production_count != null) setTodayProdCount(data.today_production_count)
      if (data?.last_inspection_date) setLastInspectionDate(formatDateYMD(data.last_inspection_date))
      if (data?.next_inspection_date) setNextInspectionDate(formatDateYMD(data.next_inspection_date))
      if (data?.started_at) setStartedAt(data.started_at)
    } catch (err) { console.error(err) }
  }, [getMachine])

  // ★重要：最新ログの並び順を確実に修正するロジック
  const loadLogs = useCallback(async () => {
    try {
      const resp = await getMachineLogs(1)
      let list = Array.isArray(resp?.logs) ? resp.logs : []
      
      // 同時刻のログがある場合、IDが大きい方を上にするソート処理を追加
      list.sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime()
        const timeB = new Date(b.timestamp).getTime()
        
        if (timeA !== timeB) {
          return timeB - timeA // まずは時刻の降順
        }
        // 時刻が全く同じなら、IDの降順（後から入ったデータを上にする）
        return (Number(b.log_id) || 0) - (Number(a.log_id) || 0)
      })
      
      setLogs(list)
    } catch (err) { console.error(err) }
  }, [getMachineLogs])

  const applyShots = useCallback((lotId, shots, capturedAtIso) => {
    const latestByCam = {}
    for (const s of shots || []) {
      if (!s?.camera_id) continue
      const normalizedId = s.camera_id.replace(/B-spring(\d+)/, (match, p1) => `B-spring${p1.padStart(2, '0')}`)
      latestByCam[normalizedId] = s
    }

    let failFound = false
    let reportedCount = 0

    CAMERA_IDS.forEach(id => {
      const entry = latestByCam[id]
      if (entry) {
        reportedCount++
        if (String(entry.status || '').toUpperCase() === 'FAIL') failFound = true
      }
    })

    if (failFound) setOverallStatus('FAIL')
    else if (reportedCount === 0) setOverallStatus('WAIT')
    else if (reportedCount === CAMERA_IDS.length) setOverallStatus('PASS')
    else setOverallStatus('WAIT')

    setTiles(prev => prev.map(t => {
      const entry = latestByCam[t.cameraId]
      if (!entry) return { ...t, status: '---', imageUrl: '', failReason: '' }
      const status = String(entry.status || 'PASS').toUpperCase()
      return { ...t, status, imageUrl: buildInspectionImageUrl(entry.image_path), failReason: entry.details || '' }
    }))

    const d = capturedAtIso ? new Date(capturedAtIso) : new Date()
    setRotId(lotId || '')
    setInspectionTime(`${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`)
  }, [buildInspectionImageUrl])

  const loadInspection = useCallback(async () => {
    try {
      const resp = await getLotsList(5)
      const lots = resp?.lots || []
      for (const lot of lots) {
        const detail = await getLotShots(lot.lot_id)
        const shots = Array.isArray(detail?.shots) ? detail.shots : []
        if (shots.length > 0) {
          applyShots(lot.lot_id, shots, detail?.captured_at)
          return 
        }
      }
      setRotId(lots[0]?.lot_id || '---')
    } catch (err) { console.error(err) }
  }, [getLotsList, getLotShots, applyShots])

  // --- Actions ---
  const addLog = useCallback((title, message, type) => {
    const now = new Date(); const ts = now.toISOString()
    setLogs(prev => [{ log_type: type, title, message, timestamp: ts }, ...prev])
  }, [])

  const showAlert = useCallback((title, message) => {
    setAlert({ open: true, title, message })
    if (alertTimerRef.current) clearTimeout(alertTimerRef.current)
    alertTimerRef.current = setTimeout(() => setAlert({ open: false, title: '', message: '' }), 5000)
  }, [])

  const onDebugError = useCallback(() => {
    setMachineBadge('error'); addLog('デバッグ', '異常', 'error'); showAlert('エラー', '異常検知')
    setOverallStatus('FAIL'); setTiles(prev => prev.map(t => t.index === 1 ? { ...t, status: 'FAIL' } : t))
  }, [addLog, showAlert])

  const onDebugWarning = useCallback(() => {
    setMachineBadge('warning'); addLog('デバッグ', '警告', 'warning')
  }, [addLog])

  const onDebugNormal = useCallback(() => {
    setMachineBadge('info'); addLog('デバッグ', '正常復帰', 'info'); setOverallStatus('PASS')
    setTiles(prev => prev.map(t => ({ ...t, status: 'PASS', failReason: '' })))
  }, [addLog])

  // --- Effects ---
  useEffect(() => {
    const tick = () => {
      const n = new Date()
      const hh = pad2(n.getHours()); const mm = pad2(n.getMinutes()); const y = n.getFullYear(); const mo = pad2(n.getMonth() + 1); const d = pad2(n.getDate())
      const wk = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][n.getDay()]
      setClock({ time: `${hh}:${mm}`, date: `${y}/${mo}/${d} (${wk})` })
      if (startedAt) setTodayUptimeSec(Math.max(0, Math.floor((Date.now() - Date.parse(startedAt)) / 1000)))
    }
    tick(); const t = setInterval(tick, 1000); return () => clearInterval(t)
  }, [startedAt])

  useEffect(() => {
    loadMachine(); loadLogs(); loadInspection()
    // 5秒ごとに更新してリアルタイム性を高める
    const t = setInterval(() => { loadMachine(); loadLogs(); loadInspection() }, 5000)
    return () => clearInterval(t)
  }, [loadMachine, loadLogs, loadInspection])

  return { clock, machineName, todayProdCount, lastInspectionDate, nextInspectionDate, todayUptimeSec, machineBadge, logs, overallStatus, rotId, inspectionTime, tiles, formatNumber, alert, onDebugError, onDebugWarning, onDebugNormal }
}