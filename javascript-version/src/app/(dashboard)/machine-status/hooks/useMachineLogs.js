'use client'

/*
======== ファイル概要 ========
エラーログAPIを取得し、UI向けの整形やユニット毎の状態推定を行うカスタムフック群。
*/

import { useEffect, useMemo, useState } from 'react'

// サンプルフォールバック
const errorLogSample = [
    { type: 'エラー', code: 'E-102', title: 'トルク過負荷', desc: 'モーターの負荷が規定値を超えました。', date: '2025-07-15', time: '10:15:32', color: 'error' },
    { type: '警告', code: 'W-05', title: '潤滑油低下', desc: '潤滑油が規定レベルを下回っています。', date: '2025-07-15', time: '09:30:11', color: 'warning' },
    { type: '情報', code: 'I-001', title: '起動シーケンス完了', desc: '', date: '2025-07-15', time: '08:00:05', color: 'default' },
    { type: 'エラー', code: 'E-201', title: 'センサー接続エラー', desc: 'センサー#3との通信がタイムアウトしました。', date: '2025-07-14', time: '15:45:01', color: 'error' },
    { type: '警告', code: 'W-02', title: 'フィルター交換時期', desc: 'エアフィルターの交換を推奨します。', date: '2025-07-14', time: '11:20:45', color: 'warning' },
    { type: '情報', code: 'I-002', title: '生産完了 (Lot-24B)', desc: '', date: '2025-07-14', time: '17:30:00', color: 'default' },
]

const mapColor = (t) => (t === 'error' ? 'error' : t === 'warning' ? 'warning' : 'default')
const mapTypeJp = (t) => (t === 'error' ? 'エラー' : t === 'warning' ? '警告' : '情報')

/**
 * ログAPIを取得し、画面表示用に整形する。
 * @param   {string} machineId   - 取得対象の機械ID。
 * @returns {object}             - 整形済みログ・状態推定値・通信状態。
 */
export function useMachineLogs(machineId) {
    const [apiLogs, setApiLogs] = useState([])
    const [loading, setLoading] = useState(false)
    const [fetchError, setFetchError] = useState('')
    const [isFallbackData, setIsFallbackData] = useState(false)

    // ======== 副作用: ログ一覧の取得 ========
    useEffect(() => {
        const controller = new AbortController()

        const fetchLogs = async () => {
            try {
                setLoading(true)
                setFetchError('')
                const base = process.env.NEXT_PUBLIC_BASE_PATH || ''

                const token =
                    (typeof window !== 'undefined' && (localStorage.getItem('access_token') || sessionStorage.getItem('access_token'))) || ''

                const qs = new URLSearchParams()

                qs.set('page', '1')
                qs.set('limit', '200')
                const url = `${base}/api/machines/${encodeURIComponent(machineId)}/logs?${qs.toString()}`

                const res = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    signal: controller.signal,
                })

                // エラー応答は上位でフォールバック表示に切り替えたいので例外化する
                if (!res.ok) throw new Error(`Failed to fetch logs: ${res.status}`)
                const data = await res.json()
                const logs = Array.isArray(data?.logs) ? data.logs : []

                setApiLogs(logs)
                setIsFallbackData(false)
            } catch (err) {
                setFetchError('ログの取得に失敗しました。サンプルデータで表示しています。')

                const fallback = errorLogSample.map((s, idx) => ({
                    log_id: 1000 + idx,
                    unit_id: null,
                    timestamp: `${s.date}T${s.time}Z`,
                    log_type: s.color === 'error' ? 'error' : s.color === 'warning' ? 'warning' : 'info',
                    title: `${s.code}: ${s.title}`,
                    message: s.desc || '',
                }))

                setApiLogs(fallback)
                setIsFallbackData(true)
            } finally {
                setLoading(false)
            }
        }

        fetchLogs()

        return () => controller.abort()
    }, [machineId])

    // ======== 加工処理: APIレスポンスをUI向けに整形 ========
    const processedLogs = useMemo(() => {
        const toDateOnly = (iso) => {
            try {
                const d = new Date(iso)
                const y = d.getFullYear()
                const m = String(d.getMonth() + 1).padStart(2, '0')
                const da = String(d.getDate()).padStart(2, '0')

                return `${y}-${m}-${da}`
            } catch {
                return ''
            }
        }

        const toTime = (iso) => {
            try {
                const d = new Date(iso)
                const hh = String(d.getHours()).padStart(2, '0')
                const mm = String(d.getMinutes()).padStart(2, '0')
                const ss = String(d.getSeconds()).padStart(2, '0')

                return `${hh}:${mm}:${ss}`
            } catch {
                return ''
            }
        }

        return apiLogs
            .slice()
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map((l) => {
                const code = (l.title || '').split(':')[0] || ''

                return {
                    type: mapTypeJp(l.log_type),
                    code,
                    title: (l.title || '').split(':').slice(1).join(':').trim() || l.title || '',
                    desc: l.message || '',
                    date: toDateOnly(l.timestamp),
                    time: toTime(l.timestamp),
                    color: mapColor(l.log_type),
                    unitId: l.unit_id,
                }
            })
    }, [apiLogs])

    // ユニット/グローバルステータス推定
    const { unitStatuses, globalStatusLabel } = useUnitAndGlobalStatus(apiLogs, fetchError)

    return { apiLogs, processedLogs, loading, fetchError, isFallbackData, unitStatuses, globalStatusLabel }
}

/**
 * ログ内容からユニット毎と全体の状態を推定する。
 * @param   {object[]} apiLogs     - APIから取得した生ログ配列。
 * @param   {string}   fetchError  - 取得失敗時のエラーメッセージ。
 * @returns {object}              - ユニットステータスと全体ステータスラベル。
 */
export function useUnitAndGlobalStatus(apiLogs, fetchError) {
    const [unitStatuses, setUnitStatuses] = useState({ Unit1: '正常稼働', Unit2: '正常稼働', Unit3: '正常稼働', Unit4: '正常稼働' })
    const [globalStatusLabel, setGlobalStatusLabel] = useState('正常稼働')

    // ======== 副作用: ログから最新状態を推定 ========
    useEffect(() => {
        // 取得に失敗してログが空の場合は、状態が不明であることをUIに伝える
        if (fetchError && (!apiLogs || apiLogs.length === 0)) {
            setUnitStatuses({ Unit1: '不明', Unit2: '不明', Unit3: '不明', Unit4: '不明' })
            setGlobalStatusLabel('不明')
            
            return
        }

        const extractCode = (title) => {
            const m = (title || '').match(/([A-Z]-\d{3})/)

            return m?.[1] || ''
        }

        const codeToStatus = {
            'E-001': '正常稼働',
            'E-002': '残弾なし',
            'E-003': 'エラー',
            'E-099': 'エラー',
            'W-001': '残弾わずか',
            'W-002': '残弾わずか',
            'W-099': '残弾わずか',
            'I-001': '正常稼働',
            'I-002': '正常稼働',
            'I-003': '停止中',
        }

        const determineStatusFromLog = (l) => {
            if (!l) return '正常稼働'
            const code = extractCode(l.title)

            if (code && codeToStatus[code]) return codeToStatus[code]
            if (l.log_type === 'error') return 'エラー'
            if (l.log_type === 'warning') return '残弾わずか'

            return '正常稼働'
        }

        const latestByUnit = { 1: null, 2: null, 3: null, 4: null }

        apiLogs.forEach((l) => {
            if (l.unit_id == null) return
            if (!(l.unit_id in latestByUnit)) return

            if (!latestByUnit[l.unit_id] || new Date(l.timestamp) > new Date(latestByUnit[l.unit_id].timestamp)) {
                latestByUnit[l.unit_id] = l
            }
        })
        let latestI002Ts = null

        apiLogs.forEach((l) => {
            const c = extractCode(l.title)

            if (c === 'I-002') {
                const ts = new Date(l.timestamp)

                if (!latestI002Ts || ts > latestI002Ts) latestI002Ts = ts
            }
        })
        let latestGlobalShutdownTs = null

        apiLogs.forEach((l) => {
            if (l.unit_id != null) return
            const c = extractCode(l.title)

            if (c === 'I-003') {
                const ts = new Date(l.timestamp)

                if (!latestGlobalShutdownTs || ts > latestGlobalShutdownTs) latestGlobalShutdownTs = ts
            }
        })

        const calcWithResetRule = (unitIdx) => {
            const latest = latestByUnit[unitIdx]
            let status = determineStatusFromLog(latest)

            // 最新の「補充完了(I-002)」ログが後続にある場合は残弾アラートを解除する
            if (latest && latestI002Ts && (status === '残弾なし' || status === '残弾わずか')) {
                const unitTs = new Date(latest.timestamp)

                if (latestI002Ts > unitTs) status = '正常稼働'
            }

            return status
        }

        let next = {
            Unit1: calcWithResetRule(1),
            Unit2: calcWithResetRule(2),
            Unit3: calcWithResetRule(3),
            Unit4: calcWithResetRule(4),
        }

        // 最新記録が全体停止(I-003)の場合は停止扱いを上書きする
        if (latestGlobalShutdownTs && (!latestI002Ts || latestI002Ts <= latestGlobalShutdownTs)) {
            const overrideIfBeforeShutdown = (unitIdx, key) => {
                const latest = latestByUnit[unitIdx]
                const unitTs = latest ? new Date(latest.timestamp) : null

                if (!unitTs || unitTs <= latestGlobalShutdownTs) {
                    next[key] = '停止中'
                }
            }

            overrideIfBeforeShutdown(1, 'Unit1')
            overrideIfBeforeShutdown(2, 'Unit2')
            overrideIfBeforeShutdown(3, 'Unit3')
            overrideIfBeforeShutdown(4, 'Unit4')
        }

        const vals = Object.values(next)
        const allEmpty = vals.every((v) => !v)

        // 何の情報も得られなかった場合は「不明」とし、UIで異常を知らせる
        if (allEmpty) {
            next = { Unit1: '不明', Unit2: '不明', Unit3: '不明', Unit4: '不明' }
        }

        setUnitStatuses(next)

        let latestGlobal = null

        apiLogs.forEach((l) => {
            if (l.unit_id != null) return

            if (!latestGlobal || new Date(l.timestamp) > new Date(latestGlobal.timestamp)) {
                latestGlobal = l
            }
        })

        let globalLabel = '正常稼働'

        if (latestGlobal) {
            // 全体ログの最新値からダッシュボード表示用のラベルに変換する
            let gs = determineStatusFromLog(latestGlobal)

            if (latestI002Ts && (gs === '残弾なし' || gs === '残弾わずか')) {
                const gts = new Date(latestGlobal.timestamp)

                if (latestI002Ts > gts) gs = '正常稼働'
            }

            // UIラベルは「エラー」「警告」などに丸めて一貫性を持たせる
            if (gs === 'エラー' || gs === '残弾なし') globalLabel = 'エラー'
            else if (gs === '残弾わずか') globalLabel = '警告'
            else if (gs === '不明') globalLabel = '不明'
            else if (gs === '停止中') globalLabel = '停止中'
            else globalLabel = '正常稼働'
        } else if (fetchError && (!apiLogs || apiLogs.length === 0)) {
            globalLabel = '不明'
        }

        setGlobalStatusLabel(globalLabel)
    }, [apiLogs, fetchError])

    return { unitStatuses, globalStatusLabel }
}
