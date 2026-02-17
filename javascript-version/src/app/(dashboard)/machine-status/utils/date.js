'use client'

/*
======== ファイル概要 ========
機械ステータス画面で使用する日付・時間の変換ユーティリティ群。
*/

// 日付/時間ユーティリティ

/**
 * YYYY/MM/DD 形式の文字列を Date に変換する。
 * @param   {string}    s          - 変換対象の文字列。
 * @returns {Date|null}            - 成功時はDate、失敗時はnull。
 */
export const parseYmdSlash = (s) => {
    const m = (s || '').match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/)

    if (!m) return null // フォーマット不一致の場合は変換できないため null
    const y = Number(m[1])
    const mo = Number(m[2]) - 1
    const d = Number(m[3])
    const dt = new Date(y, mo, d)

    return isNaN(dt.getTime()) ? null : dt
}

/**
 * YYYY-MM-DD あるいは他日付文字列を Date に変換する。
 * @param   {string}    s          - 変換対象の文字列。
 * @returns {Date|null}            - 成功時はDate、失敗時はnull。
 */
export const parseYmd = (s) => {
    if (!s) return null

    if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(s)) {
        const [y, m, d] = s.split('-').map(Number)
        const dt = new Date(y, m - 1, d)

        return isNaN(dt.getTime()) ? null : dt
    }

    const bySlash = parseYmdSlash(s)

    if (bySlash) return bySlash
    const dt = new Date(s)

    return isNaN(dt.getTime()) ? null : dt
}

/**
 * Date を YYYY/MM/DD 形式の文字列に整形する。
 * @param   {Date}      d          - 整形対象の日付。
 * @returns {string}               - フォーマット済み文字列。
 */
export const formatYmdSlash = (d) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const da = String(d.getDate()).padStart(2, '0')

    return `${y}/${m}/${da}`
}

/**
 * 秒数を HH:MM:SS 形式に変換する。
 * @param   {number}   sec        - 変換対象の秒数。
 * @returns {string}              - HH:MM:SS 形式の文字列。無効値時は空文字。
 */
export const secondsToHMS = (sec) => {
    if (sec == null || !Number.isFinite(sec)) return ''
    const s = Math.max(0, Math.floor(sec))
    const hh = String(Math.floor(s / 3600)).padStart(2, '0')
    const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
    const ss = String(s % 60).padStart(2, '0')

    return `${hh}:${mm}:${ss}`
}

/**
 * 2つの日付の差（日数）を計算する。
 * @param   {Date}     a          - 基準日。
 * @param   {Date}     b          - 比較日。
 * @returns {number}              - b - a の日数差。
 */
export const daysDiff = (a, b) => {
    const MS = 24 * 60 * 60 * 1000

    return Math.round((b.setHours(0, 0, 0, 0) - a.setHours(0, 0, 0, 0)) / MS)
}

/**
 * 指定日付へ日数を加算する。
 * @param   {Date}     d          - 基準日。
 * @param   {number}   days       - 加算する日数。
 * @returns {Date}                - 加算後の日付。
 */
export const addDays = (d, days) => {
    const nd = new Date(d)

    nd.setDate(nd.getDate() + days)

    return nd
}
