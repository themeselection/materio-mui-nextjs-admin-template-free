/*
======== ファイル概要 ========
画像検査ロット関連のデータ取得・キャッシュ・整形を担うカスタムフック。
ダミーデータからAPIへの移行を見据え、トグルで動作を切り替えられる。
*/

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SAMPLE_SUMMARIES } from '../data/sampleSummaries'
import { SAMPLE_LOTS } from '../data/sampleLots'
import { mapStatusApiToUi, normalizeShotSummary } from '../utils/summaryUtils'

// 簡易トグル: trueでAPIを叩いてサマリー（総数/良品/不良/不良理由）を取得
const USE_API_SUMMARY = true;
// ロットログ（一覧）もAPIに切り替えるトグル
const USE_API_LOTS = true;

// 表示名 => 内部コード（APIのsectionクエリ）
const SECTION_TO_CODE = {
  'バネ留め': 'spring',
  'A層': 'alayer'
}

const CODE_TO_SECTION = Object.fromEntries(Object.entries(SECTION_TO_CODE).map(([display, code]) => [code, display]))

/**
 * 現在日時を YYYY-MM-DD 文字列で返す。
 * @returns {string} 日付文字列。
 */
const todayYMD = () => {
  const d = new Date()
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/**
 * キャッシュキーで利用する日付表現を決める。未指定時は 'LATEST'。
 * @param {string|null|undefined} value - 入力日付。
 * @returns {string}                      正規化キー。
 */
const resolveDateKey = value => {
  if (value === null || value === undefined) return 'LATEST'
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed ? trimmed : 'LATEST'
  }
  return value ? value : 'LATEST'
}

/**
 * セクションやロット種別ごとのキャッシュキーを生成する。
 * @param {string} prefix - 先頭識別子。
 * @param {string|null} date - 日付。
 * @returns {string} キー文字列。
 */
const buildCacheKey = (prefix, date) => `${prefix}|${resolveDateKey(date)}`

/**
 * API由来の画像パスのスラッシュを整え、先頭スラッシュを付けて返す。
 * @param {string} path - 元のパス。
 * @returns {string|null} 正規化結果。
 */
const normalizeImagePath = path => {
  if (!path) return null
  const trimmed = String(path).trim()
  if (!trimmed) return null
  const sanitized = trimmed.replace(/\\/g, '/')
  if (/^https?:\/\//i.test(sanitized)) {
    const [protocol, rest] = sanitized.split('://')
    if (!rest) return sanitized
    const cleanedRest = rest.replace(/\/{3,}/g, '//')
    return `${protocol}://${cleanedRest}`
  }
  const withLeading = sanitized.startsWith('/') ? sanitized : `/${sanitized}`
  return withLeading.replace(/\/{3,}/g, '//')
}

const SHOT_DEFAULT_TYPE = 'DEFAULT'

/**
 * ショット種別を大文字化し、未指定時は DEFAULT に揃える。
 * @param {string} type - 入力種別。
 * @returns {string}     正規化種別。
 */
const normalizeShotType = type => {
  if (!type) return SHOT_DEFAULT_TYPE
  const normalized = String(type).trim()
  return normalized ? normalized.toUpperCase() : SHOT_DEFAULT_TYPE
}

/**
 * ロットIDとショットタイプからキャッシュキーを生成する。
 * @param {string} lotId   - ロットID。
 * @param {string} shotType - ショットタイプ。
 * @returns {string}        キー。
 */
const buildShotCacheKey = (lotId, shotType) => `${lotId}|${normalizeShotType(shotType)}`

/**
 * APIのセクションコードを表示名へ戻し、末尾の「検査」を除去する。
 * @param {string} section - セクション文字列。
 * @returns {string}        表示名。
 */
const normalizeSection = section => {
  if (!section) return section
  const mapped = CODE_TO_SECTION[section] || section
  return mapped.replace(/検査$/, '')
}

/**
 * ISO日時を HH:MM:SS へ整形する。
 * @param {string} iso - ISO8601文字列。
 * @returns {string}    時刻文字列。
 */
const toHHMMSS = iso => {
  try {
    const d = new Date(iso)
    const pad = n => String(n).padStart(2, '0')
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  } catch {
    return ''
  }
}

/**
 * ISO日時を YYYY-MM-DD へ整形する。
 * @param {string} iso - ISO8601文字列。
 * @returns {string}    日付文字列。
 */
const toYMD = iso => {
  try {
    const d = new Date(iso)
    const pad = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  } catch {
    return ''
  }
}

/**
 * 4K/FHDシーケンス表記から見やすいラベルを導出する。
 * @param {string} value - 元文字列。
 * @returns {string}      表示ラベル。
 */
const deriveSequenceLabel = value => {
  if (!value) return ''
  const raw = String(value).trim()
  if (!raw) return ''
  const match = raw.match(/^([A-Za-z]+)[-_]?(\d+)$/)
  if (match) {
    const [, rowRaw, colRaw] = match
    const row = rowRaw.toUpperCase()
    const col = parseInt(colRaw, 10)
    if (Number.isFinite(col) && col > 0) {
      return `${row}-${col}`
    }
  }
  return raw
}

/**
 * カメラ配列をIDごとにまとめ、FAIL優先で状態を保持する。
 * @param {Array} cameras - カメラ配列。
 * @returns {Array}        集約結果。
 */
const aggregateCameras = cameras => {
  const byId = new Map()

  for (const raw of cameras || []) {
    const cameraId = raw?.camera_id || raw?.cameraId || raw?.name
    if (!cameraId) continue
    const statusUi = mapStatusApiToUi(raw?.status)
    const detailTextRaw = typeof raw?.details === 'string' ? raw.details.trim() : ''
    const details = detailTextRaw || '-'
    const imagePath = raw?.image_path || null
    const prev = byId.get(cameraId)

    if (!prev) {
      byId.set(cameraId, {
        name: cameraId,
        status: statusUi,
        rawStatus: raw?.status ?? '',
        details,
        image_path: imagePath,
        type: 'camera',
      })
    } else {
      const nextIsFail = statusUi !== 'PASS'
      const prevIsFail = prev.status !== 'PASS'

      if (nextIsFail && !prevIsFail) {
        prev.status = statusUi
        prev.rawStatus = raw?.status ?? prev.rawStatus
        if (details !== '-' || prev.details === '-' || !prev.details) {
          prev.details = details
        }
        prev.image_path = imagePath || prev.image_path
      }
    }
  }

  return Array.from(byId.values())
}

/**
 * 4Kシーケンス配列をUI用フォーマットへ変換する。
 * @param {Array} sequences - 4K配列。
 * @returns {Array}          整形済み配列。
 */
const mapFourKSequences = sequences => (sequences || []).map(seq => {
  const rawSequence = seq?.['4k_seq'] ?? seq?.['c4k_seq'] ?? seq?.four_k_seq ?? seq?.seq ?? ''
  const label = deriveSequenceLabel(rawSequence)
  const statusUi = mapStatusApiToUi(seq?.status)
  const detailTextRaw = typeof seq?.details === 'string' ? seq.details.trim() : ''
  const detailText = detailTextRaw || '-'

  return {
    name: label || seq?.camera_id || rawSequence || '-',
    label: label || seq?.camera_id || rawSequence || '-',
    status: statusUi,
    rawStatus: seq?.status ?? '',
    details: detailText,
    type: 'sequence',
    rawSequence: rawSequence || '',
  }
})

/**
 * 画像検査ロット関連の各種取得APIを隠蔽し、UI層向けの操作関数を提供するカスタムフック。
 * キャッシュやフェッチ制御、ダミーデータ fallback を一箇所で管理する。
 * @returns {object} ロット/統計/ショット取得のための関数群。
 */
export const useLotsData = () => {
  // API仕様に合わせたダミー応答（将来は fetch で置き換え）
  const [apiPayload] = useState(SAMPLE_LOTS)

  // ---- サマリー(API) キャッシュ ----
  // key: `${sectionCode}|${date}` または `${sectionCode}|LATEST`
  const [summaryCache, setSummaryCache] = useState({})

  // ▼ 修正: dateが未指定(null/undefined)ならクエリに含めない（API側の最新自動取得に任せる）
  /**
   * サマリーAPIを叩き、セクション×日付の集計を取得する。
   * @param {string} sectionDisplayName - 表示名（例: バネ留め）。
   * @param {string} [date]             - YYYY-MM-DD。省略で最新。
   * @returns {Promise<object>}          APIレスポンス。
   */
  const fetchSummary = async (sectionDisplayName, date) => {
    const sectionCode = SECTION_TO_CODE[sectionDisplayName]
    if (!sectionCode) return Promise.reject(new Error(`Unknown section: ${sectionDisplayName}`))
    
    // dateが無い場合は 'LATEST' をキーにする
    const cacheKey = `${sectionCode}|${date || 'LATEST'}`

    if (summaryCache[cacheKey]) return summaryCache[cacheKey]

    const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
    
    // クエリパラメータの構築
    const params = { section: sectionCode }
    if (date) {
      params.date = date
    }
    // dateがない場合はパラメータに含めない -> APIが最新を返す
    
    const qs = new URLSearchParams(params).toString()
    const res = await fetch(`${base}/api/inspections/summary?${qs}`)
    if (!res.ok) throw new Error(`Failed to fetch summary ${res.status}`)
    const data = await res.json()

    setSummaryCache(prev => ({ ...prev, [cacheKey]: data }))
    return data
  }

  // ローカル計算による API レスポンス形のサマリー生成
  /**
   * APIが未設定/エラーの場合のローカルサマリーを計算する。
   * @param {string} sectionDisplayName - セクション表示名。
   * @param {string} [date]             - 対象日付。
   * @returns {object}                   疑似APIレスポンス。
   */
  const buildLocalSummary = (sectionDisplayName, date) => {
    const sectionCode = SECTION_TO_CODE[sectionDisplayName]
    const ymd = date || todayYMD()
    const sampleKey = `${sectionCode}|${ymd}`
    // 1) サンプルサマリーがあれば最優先で返す
    if (SAMPLE_SUMMARIES[sampleKey]) return SAMPLE_SUMMARIES[sampleKey]
    const lots = getSectionLots(sectionDisplayName, ymd)
    const total = lots.length
    const pass = lots.filter(l => getLotStatus(l) === 'PASS').length
    const fail = total - pass
    const passRate = total > 0 ? Math.round((pass / total) * 100) : 100

    const failedCameras = lots.flatMap(l => l.cameras.filter(c => mapStatusApiToUi(c.status) !== 'PASS' && c.details && c.details !== '-'))
    const reasonCounts = failedCameras.reduce((acc, c) => {
      acc[c.details] = (acc[c.details] || 0) + 1
      return acc
    }, {})
    const failReasons = Object.entries(reasonCounts)
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count)

    return {
      section: sectionCode,
      date: ymd,
      total_count: total,
      pass_count: pass,
      fail_count: fail,
      pass_rate: passRate,
      fail_reasons: failReasons
    }
  }

  // ---- アダプト層：APIデータ => 既存UI互換データ ----
  /**
   * APIロットをUIで扱いやすい構造へ変換する。
   * @param {object} lot - APIレスポンスロット。
   * @returns {object}    UI向けロット。
   */
  const adaptLotToUi = useCallback((lot) => {
    const sectionDisplay = normalizeSection(lot.section)
    const overallStatus = typeof lot.pass === 'boolean' ? (lot.pass ? 'PASS' : 'FAIL') : undefined
    const cameraLikeItems = Array.isArray(lot.four_k_sequences) && lot.four_k_sequences.length > 0
      ? mapFourKSequences(lot.four_k_sequences)
      : aggregateCameras(lot.cameras)

    return {
      time: toHHMMSS(lot.captured_at),
      date: toYMD(lot.captured_at),
      timestamp: new Date(lot.captured_at).getTime(),
      section: sectionDisplay,
      sectionCode: typeof lot.section === 'string' ? lot.section : undefined,
      lotId: lot.lot_id,
      cameras: cameraLikeItems,
      overallStatus,
      representativeImage: normalizeImagePath(lot.representative_image),
    }
  }, [])

  // セクションごとに時刻降順で整形したUI向けロット配列（サンプルデータベース）
  const uiLots = useMemo(() => {
    const lots = (apiPayload?.lots || []).map(adaptLotToUi)
    // captured_at 降順
    return lots.sort((a, b) => b.timestamp - a.timestamp)
  }, [adaptLotToUi, apiPayload])

  useEffect(() => {
    if (!uiLots.length) return
    setLotUiIndex(prev => {
      const next = { ...prev }
      let changed = false
      for (const lot of uiLots) {
        if (next[lot.lotId] !== lot) {
          next[lot.lotId] = lot
          changed = true
        }
      }
      return changed ? next : prev
    })
  }, [uiLots])

  // ---- ロット一覧(API) 対応 ----
  // raw: APIの返却をページ結合して保存、ui: アダプト済み配列
  const [lotsRawCache, setLotsRawCache] = useState({}) 
  const [lotsUiCache, setLotsUiCache] = useState({})   
  const [lotRawIndex, setLotRawIndex] = useState({})   
  const [lotUiIndex, setLotUiIndex] = useState({})     
  const [lotShotsCache, setLotShotsCache] = useState({}) 
  const [lotShotsStatus, setLotShotsStatus] = useState({}) 
  const [datesCache, setDatesCache] = useState({})      

  // in-flight guards
  const inFlightSummaryRef = useRef(new Set()) 
  const inFlightLotsRef = useRef(new Set())    
  const inFlightShotsRef = useRef(new Set())   
  const inFlightDatesRef = useRef(new Set())   
  const inFlightLotDetailRef = useRef(new Set()) 

  /**
   * 指定セクションのロット一覧をページングしながら全件取得する。
   * @param {string} sectionDisplayName - セクション表示名。
   * @param {string|null} date          - 日付（nullで最新）。
   * @param {number} [limit=200]        - 1ページ当たりアイテム数。
   * @returns {Promise<Array|undefined>} 取得済みUIロット配列。
   */
  const fetchLotsAllPages = async (sectionDisplayName, date, limit = 200) => {
    const sectionCode = SECTION_TO_CODE[sectionDisplayName]
    if (!sectionCode) throw new Error(`Unknown section: ${sectionDisplayName}`)
    const dateKey = resolveDateKey(date)
    const hasDate = dateKey !== 'LATEST'
    const cacheKeyRaw = buildCacheKey(sectionCode, date)
    const cacheKeyUi = buildCacheKey(sectionDisplayName, date)
    if (lotsRawCache[cacheKeyRaw] && lotsUiCache[cacheKeyUi]) return lotsUiCache[cacheKeyUi]
    if (inFlightLotsRef.current.has(cacheKeyRaw)) return undefined
    inFlightLotsRef.current.add(cacheKeyRaw)

    const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
    let page = 1
    let totalPages = 1
    const allLots = []

    while (page <= totalPages) {
      const params = { section: sectionCode, page: String(page), limit: String(limit ?? 200) }
      if (hasDate) params.date = dateKey
      const qs = new URLSearchParams(params).toString()
      const res = await fetch(`${base}/api/inspections/lots?${qs}`)
      if (!res.ok) throw new Error(`Failed to fetch lots ${res.status}`)
      const data = await res.json()
      totalPages = Number(data.total_pages || 1)
      page = Number(data.current_page || page) + 1
      if (Array.isArray(data.lots)) allLots.push(...data.lots)
    }

    const rawJoined = { total_pages: totalPages, current_page: 1, lots: allLots }
    setLotsRawCache(prev => ({ ...prev, [cacheKeyRaw]: rawJoined }))

    setLotRawIndex(prev => {
      const next = { ...prev }
      for (const l of allLots) next[l.lot_id] = l
      return next
    })

    const adapted = (allLots || []).map(adaptLotToUi).sort((a, b) => b.timestamp - a.timestamp)
    setLotsUiCache(prev => ({ ...prev, [cacheKeyUi]: adapted }))
    setLotUiIndex(prev => {
      const next = { ...prev }
      let changed = false
      for (const lot of adapted) {
        if (next[lot.lotId] !== lot) {
          next[lot.lotId] = lot
          changed = true
        }
      }
      return changed ? next : prev
    })
    if (adapted.length) {
      const uniqueDates = Array.from(new Set(adapted.map(l => l.date).filter(Boolean)))
      if (uniqueDates.length) {
        setDatesCache(prev => {
          const existing = prev[sectionDisplayName] || []
          const merged = Array.from(new Set([...existing, ...uniqueDates]))
            .sort((a, b) => (a < b ? 1 : a > b ? -1 : 0))
          return merged.length === existing.length && merged.every((d, idx) => d === existing[idx]) ? prev : { ...prev, [sectionDisplayName]: merged }
        })
      }
    }

    if (!hasDate) {
      setLotsUiCache(prev => {
        const latestKey = buildCacheKey(sectionDisplayName, null)
        if (latestKey === cacheKeyUi) return prev
        return { ...prev, [latestKey]: adapted }
      })
      setLotsRawCache(prev => {
        const latestKey = buildCacheKey(sectionCode, null)
        if (latestKey === cacheKeyRaw) return prev
        return { ...prev, [latestKey]: rawJoined }
      })
    }

    inFlightLotsRef.current.delete(cacheKeyRaw)
    return adapted
  }

  /**
   * セクション毎にロットデータが存在する日付一覧を取得する。
   * @param {string} sectionDisplayName - セクション表示名。
   * @returns {Promise<Array|undefined>} 取得済み日付配列。
   */
  const fetchAvailableDates = async (sectionDisplayName) => {
    const sectionCode = SECTION_TO_CODE[sectionDisplayName]
    if (!sectionCode) throw new Error(`Unknown section: ${sectionDisplayName}`)
    if (datesCache[sectionDisplayName]) return datesCache[sectionDisplayName]
    if (inFlightDatesRef.current.has(sectionDisplayName)) return undefined
    inFlightDatesRef.current.add(sectionDisplayName)

    try {
      const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
      const res = await fetch(`${base}/api/inspections/sections/${encodeURIComponent(sectionCode)}/dates`)
      if (!res.ok) throw new Error(`Failed to fetch dates ${res.status}`)
      const data = await res.json()
      const dates = Array.isArray(data?.dates) ? data.dates : []
      setDatesCache(prev => ({ ...prev, [sectionDisplayName]: dates }))
      return dates
    } finally {
      inFlightDatesRef.current.delete(sectionDisplayName)
    }
  }

  /**
   * セクションと日付を指定してロット配列を取得する。未キャッシュならフェッチをトリガー。
   * @param {string} section - 表示名。
   * @param {string} [date]  - YYYY-MM-DD。
   * @returns {Array}         UIロット配列。
   */
  const getSectionLots = (section, date) => {
    const normalized = normalizeSection(section)
    const normalizedDateInput = typeof date === 'string' ? date.trim() : date
    const hasExplicitDate = Boolean(normalizedDateInput)
    const resolvedDate = hasExplicitDate ? normalizedDateInput : null

    if (USE_API_LOTS) {
      const cacheKeyUi = buildCacheKey(section, resolvedDate)
      const cached = lotsUiCache[cacheKeyUi]
      if (cached) return cached
      fetchLotsAllPages(section, resolvedDate).catch(() => { })
      const filtered = uiLots.filter(l => l.section === normalized)
      if (hasExplicitDate) return filtered.filter(l => l.date === resolvedDate)
      return filtered.sort((a, b) => b.timestamp - a.timestamp)
    }

    const filtered = uiLots.filter(l => l.section === normalized)
    if (hasExplicitDate) return filtered.filter(l => l.date === resolvedDate)
    return filtered.sort((a, b) => b.timestamp - a.timestamp)
  }

  const normalizeUiStatus = value => {
    const normalized = (value || '').toString().trim().toUpperCase()
    if (normalized === 'OK') return 'PASS'
    if (normalized === 'NG') return 'FAIL'
    return normalized
  }

  const getLotStatus = lot => {
    if (!lot) return 'UNKNOWN'

    const overallStatus = normalizeUiStatus(lot.overallStatus)
    const cameraStatuses = (lot.cameras || []).map(camera => normalizeUiStatus(camera.status))

    if (cameraStatuses.includes('FAIL') || overallStatus === 'FAIL') return 'FAIL'
    if (cameraStatuses.includes('MISSING') || overallStatus === 'MISSING') return 'MISSING'
    if (overallStatus === 'PASS') return 'PASS'

    if (cameraStatuses.length === 0) return overallStatus || 'UNKNOWN'

    if (cameraStatuses.every(status => status === 'PASS')) return 'PASS'

    if (cameraStatuses.some(status => status)) return 'FAIL'

    return 'UNKNOWN'
  }

  // 同期API: UI互換のため、最新取得済みのAPI値を返却し、未取得ならリクエストを発火してローカル計算をフォールバック
  const [latestSummary, setLatestSummary] = useState({}) // key: `${section}|${date}` -> { total_count, pass_count, ... }

  // ▼ 修正: dateを指定してデータを取得（未指定ならLATESTとして扱う）
  const primeSummary = (section, date) => {
    // dateが無い場合は 'LATEST' をキーにする
    const key = `${section}|${date || 'LATEST'}`

    if (latestSummary[key]) return
    if (inFlightSummaryRef.current.has(key)) return

    if (USE_API_SUMMARY) {
      inFlightSummaryRef.current.add(key)
      // dateがnull/undefinedならそのまま渡す（fetchSummary側で処理）
      fetchSummary(section, date)
        .then(data => setLatestSummary(prev => ({ ...prev, [key]: data })))
        .catch(() => { /* サイレント失敗 */ })
        .finally(() => { inFlightSummaryRef.current.delete(key) })
    } else {
      const local = buildLocalSummary(section, date)
      setLatestSummary(prev => ({ ...prev, [key]: local }))
    }
  }

  // ▼ 修正: date引数を無視せず、渡された日付（またはundefined）を使うように変更
// 修正前と修正後の違い： return オブジェクトに date: api.date を追加しました
  const getSectionStats = (section, date) => {
    // 引数のdateを使う（指定なしならLATEST）
    const key = `${section}|${date || 'LATEST'}`
    
    let api = latestSummary[key]
    if (!api) {
      primeSummary(section, date)
      if (!USE_API_SUMMARY) api = buildLocalSummary(section, date)
    }
    if (api) {
      return {
        total: api.total_count ?? 0,
        pass: api.pass_count ?? 0,
        fail: api.fail_count ?? 0,
        passRate: api.pass_rate ?? (api.total_count ? Math.round((api.pass_count / api.total_count) * 100) : 100),
        date: api.date // ★ここを追加！APIが返した日付情報をUIに渡す
      }
    }
    // 最後の保険: 空
    return { total: 0, pass: 0, fail: 0, passRate: 100, date: null }
  }

  // ▼ 修正: こちらも同様に date引数を使うように変更
  const getFailReasons = (section, date) => {
    const key = `${section}|${date || 'LATEST'}`
    
    let api = latestSummary[key]
    if (!api) {
      primeSummary(section, date)
      if (!USE_API_SUMMARY) api = buildLocalSummary(section, date)
    }
    if (api && Array.isArray(api.fail_reasons)) {
      const total = api.fail_reasons.reduce((s, r) => s + (r.count || 0), 0) || 0
      return api.fail_reasons.map(r => ({
        reason: r.reason,
        count: r.count,
        percentage: total ? Math.round((r.count / total) * 100) : 0
      }))
    }
    return []
  }

  const getLatestLot = (section, date) => getSectionLots(section, date)[0] || null

  // 利用可能な日付一覧（降順）
  const getAvailableDates = (section) => {
    if (USE_API_LOTS) {
      const cached = datesCache[section]
      if (cached) return cached
      fetchAvailableDates(section).catch(() => { })
    }
    const lots = getSectionLots(section)
    const set = new Set(lots.map(l => l.date))
    return Array.from(set).sort((a, b) => (a < b ? 1 : a > b ? -1 : 0))
  }

  // ---- 詳細表示向けヘルパ ----
  const getLotShots = (lotId, options = {}) => {
    const shotTypeNormalized = normalizeShotType(options?.type)
    if (USE_API_LOTS) {
      const cached = lotShotsCache[buildShotCacheKey(lotId, shotTypeNormalized)]
      return Array.isArray(cached?.shots) ? cached.shots : []
    }
    const lot = (apiPayload?.lots || []).find(l => l.lot_id === lotId)
    if (!lot) return []

    if (shotTypeNormalized === '4K') {
      const sequences = Array.isArray(lot.four_k_sequences) ? lot.four_k_sequences : []
      const normalizedSequences = sequences.map(seq => {
        const sequenceValue = seq?.['4k_seq'] ?? seq?.['c4k_seq'] ?? seq?.four_k_seq ?? seq?.seq ?? null
        return {
          ...seq,
          image_path: seq?.image_path ? normalizeImagePath(seq.image_path) : seq?.image_path,
          ['4k_seq']: sequenceValue,
          ['c4k_seq']: seq?.['c4k_seq'] ?? seq?.four_k_seq ?? seq?.seq ?? null,
          four_k_seq: seq?.four_k_seq ?? sequenceValue,
        }
      })
      return normalizedSequences
    }

    if (shotTypeNormalized !== SHOT_DEFAULT_TYPE) return []

    return (lot.cameras || []).map(c => ({
      camera_id: c.camera_id,
      status: c.status,
      details: c.details,
      image_path: c.image_path,
    }))
  }

  const getLotShotsSummary = (lotId, options = {}) => {
    if (!lotId) return null
    const shotTypeNormalized = normalizeShotType(options?.type)
    if (USE_API_LOTS) {
      const cached = lotShotsCache[buildShotCacheKey(lotId, shotTypeNormalized)]
      if (cached) return cached.summary || normalizeShotSummary(null, cached.shots)
      return null
    }
    const shots = getLotShots(lotId, options)
    return normalizeShotSummary(null, shots)
  }

  const ensureLotShotsLoaded = async (lotId, options = {}) => {
    if (!USE_API_LOTS) return
    if (!lotId) return
    const shotTypeNormalized = normalizeShotType(options?.type)
    const cacheKey = buildShotCacheKey(lotId, shotTypeNormalized)
    if (lotShotsCache[cacheKey]) {
      setLotShotsStatus(prev => (prev[cacheKey] === 'success' ? prev : { ...prev, [cacheKey]: 'success' }))
      return
    }
    if (inFlightShotsRef.current.has(cacheKey)) return
    inFlightShotsRef.current.add(cacheKey)
    setLotShotsStatus(prev => (prev[cacheKey] === 'loading' ? prev : { ...prev, [cacheKey]: 'loading' }))
    try {
      const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
      const typeSegment = shotTypeNormalized === SHOT_DEFAULT_TYPE ? '' : `/${encodeURIComponent(shotTypeNormalized)}`
      const res = await fetch(`${base}/api/inspections/lots/${encodeURIComponent(lotId)}/shots${typeSegment}`)
      if (!res.ok) throw new Error(`Failed to fetch shots ${res.status}`)
      const data = await res.json()
      const shots = Array.isArray(data?.shots) ? data.shots : []
      const summary = normalizeShotSummary(data?.summary, shots)
      setLotShotsCache(prev => ({ ...prev, [cacheKey]: { shots, summary } }))
      setLotShotsStatus(prev => ({ ...prev, [cacheKey]: 'success' }))
    } catch {
      setLotShotsStatus(prev => ({ ...prev, [cacheKey]: 'error' }))
    } finally {
      inFlightShotsRef.current.delete(cacheKey)
    }
  }

  const getLotShotsStatus = (lotId, options = {}) => {
    if (!lotId) return 'idle'
    const shotTypeNormalized = normalizeShotType(options?.type)
    const cacheKey = buildShotCacheKey(lotId, shotTypeNormalized)
    if (!USE_API_LOTS) {
      const lot = (apiPayload?.lots || []).find(l => l.lot_id === lotId)
      if (!lot) return 'idle'
      if (shotTypeNormalized === '4K') {
        const sequences = Array.isArray(lot.four_k_sequences) ? lot.four_k_sequences : []
        return sequences.length > 0 ? 'success' : 'success'
      }
      if (shotTypeNormalized !== SHOT_DEFAULT_TYPE) return 'success'
      const cameras = Array.isArray(lot.cameras) ? lot.cameras : []
      return cameras.length > 0 ? 'success' : 'success'
    }
    return lotShotsStatus[cacheKey] || (lotShotsCache[cacheKey] ? 'success' : 'idle')
  }

  const getLotShotsByCamera = (lotId, options = {}) => {
    const shots = getLotShots(lotId, options)

    const grouped = shots.reduce((acc, s) => {
      const key = s?.camera_id || s?.cameraId || s?.['4k_seq'] || s?.['c4k_seq'] || s?.four_k_seq || 'unknown'
      if (!acc[key]) acc[key] = []
      acc[key].push(s)
      return acc
    }, {})

    return grouped
  }

  const ensureLotLoaded = useCallback(async (lotId) => {
    if (!lotId) return null
    if (!USE_API_LOTS) {
      return uiLots.find(l => l.lotId === lotId) || null
    }
    if (lotUiIndex[lotId]) return lotUiIndex[lotId]
    if (lotRawIndex[lotId]) {
      const adapted = adaptLotToUi(lotRawIndex[lotId])
      setLotUiIndex(prev => {
        const prevLot = prev[lotId]
        if (prevLot && prevLot.timestamp === adapted.timestamp) return prev
        return { ...prev, [lotId]: adapted }
      })
      return adapted
    }
    if (inFlightLotDetailRef.current.has(lotId)) return null
    inFlightLotDetailRef.current.add(lotId)
    try {
      const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
      const res = await fetch(`${base}/api/inspections/lots/${encodeURIComponent(lotId)}`)
      if (!res.ok) throw new Error(`Failed to fetch lot ${res.status}`)
      const data = await res.json()
      const rawLot = data?.lot || data
      if (!rawLot || !rawLot.lot_id) return null

      setLotRawIndex(prev => ({ ...prev, [rawLot.lot_id]: rawLot }))

      const adapted = adaptLotToUi(rawLot)
      setLotUiIndex(prev => ({ ...prev, [adapted.lotId]: adapted }))

      const sectionName = adapted.section
      const date = adapted.date

      if (sectionName && date) {
        const cacheKeyUi = `${sectionName}|${date}`
        setLotsUiCache(prev => {
          const existing = prev[cacheKeyUi] || []
          if (existing.some(l => l.lotId === adapted.lotId)) return prev
          const updated = [...existing, adapted].sort((a, b) => b.timestamp - a.timestamp)
          return { ...prev, [cacheKeyUi]: updated }
        })

        setDatesCache(prev => {
          const prevDates = prev[sectionName] || []
          if (prevDates.includes(date)) return prev
          const nextDates = [...prevDates, date].sort((a, b) => (a < b ? 1 : a > b ? -1 : 0))
          return { ...prev, [sectionName]: nextDates }
        })
      }

      return adapted
    } catch {
      return null
    } finally {
      inFlightLotDetailRef.current.delete(lotId)
    }
  }, [adaptLotToUi, lotRawIndex, lotUiIndex, uiLots])

  const getLotById = useCallback((lotId) => {
    if (!lotId) return null
    if (lotUiIndex[lotId]) return lotUiIndex[lotId]
    if (lotRawIndex[lotId]) return adaptLotToUi(lotRawIndex[lotId])
    return uiLots.find(l => l.lotId === lotId) || null
  }, [adaptLotToUi, lotUiIndex, lotRawIndex, uiLots])

  // 初期プリフェッチ（APIモード時）
  useEffect(() => {
    const sections = Object.keys(SECTION_TO_CODE)
    
    // ▼ 修正: サマリーは「最新(date=null)」をデフォルトで取得するように変更
    sections.forEach(sec => {
      // dateなし（LATEST）でプリフェッチ
      const key = `${sec}|LATEST`
      if (!latestSummary[key] && !inFlightSummaryRef.current.has(key)) primeSummary(sec, null)
    })

    if (USE_API_LOTS) {
      sections.forEach(sec => {
        const code = SECTION_TO_CODE[sec]
        const rawKey = buildCacheKey(code, null)
        const uiKey = buildCacheKey(sec, null)
        if (!lotsRawCache[rawKey] && !lotsUiCache[uiKey] && !inFlightLotsRef.current.has(rawKey)) {
          fetchLotsAllPages(sec, null).catch(() => { })
        }
      })
      // 利用可能日付もプリフェッチ
      sections.forEach(sec => {
        if (!datesCache[sec] && !inFlightDatesRef.current.has(sec)) fetchAvailableDates(sec).catch(() => { })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestSummary, lotsRawCache, lotsUiCache, datesCache])

  return {
    // 既存UIが参照する互換データ
    lotsData: uiLots,

    // 必要であれば生API形も公開（将来の統合向け）
    apiPayload,
    getSectionLots,
    getLotStatus,
    getSectionStats,
    getFailReasons,
    getLatestLot,
    getAvailableDates,
    getLotShots,
    getLotShotsByCamera,
    getLotShotsStatus,
    getLotShotsSummary,
    getLotById,
    ensureLotLoaded,
    ensureLotShotsLoaded,
  }
}