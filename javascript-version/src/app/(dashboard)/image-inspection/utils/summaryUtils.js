/*
======== ファイル概要 ========
ショットサマリーや判定文字列の正規化など、画像検査で共通利用する計算ユーティリティ。
*/

/**
 * 0〜100の範囲内に丸めた整数パーセンテージを返す。
 * @param {number} value - 元の値。
 * @returns {number}     整数パーセント。
 */
const clampPercent = value => {
  const num = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(num)) return 0
  if (num < 0) return 0
  if (num > 100) return 100
  return Math.round(num)
}

/**
 * 有限な数値であれば数値として返し、そうでなければ null。
 * @param {*} value - 任意値。
 * @returns {number|null} 有限数値。
 */
const toFiniteNumber = value => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (value == null) return null
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

/**
 * 判定文字列を PASS/FAIL/MISSING に揃える下準備を行う。
 * @param {string} status - 判定。
 * @returns {string}      正規化結果。
 */
const canonicalizeStatus = status => {
  const normalized = (status || '').toString().trim().toUpperCase()
  if (!normalized) return ''
  if (normalized === 'OK') return 'PASS'
  if (normalized === 'NG') return 'FAIL'
  return normalized
}

/**
 * APIの生ステータスをUI表示用へ変換する。
 * @param {string} status - 判定。
 * @returns {string}      表示用文字列。
 */
export const mapStatusApiToUi = status => {
  const canonical = canonicalizeStatus(status)
  return canonical || '-'
}

/**
 * ショット配列から総数/良品/不良/率を計算する。
 * @param {Array} shots - ショット配列。
 * @returns {object|null} サマリー。
 */
export const computeShotSummary = shots => {
  const list = Array.isArray(shots) ? shots : []
  if (list.length === 0) return null

  let total = 0
  let passCount = 0

  list.forEach(item => {
    total += 1
    const status = mapStatusApiToUi(item?.status)
    if (status === 'PASS') passCount += 1
  })

  const failCount = Math.max(total - passCount, 0)
  const passRate = total ? Math.round((passCount / total) * 100) : 0
  const failRate = total ? Math.max(0, Math.min(100, 100 - passRate)) : 0

  return {
    total,
    passCount,
    failCount,
    passRate,
    failRate,
    // legacy aliases (to be deprecated once UI is updated)
    okCount: passCount,
    ngCount: failCount,
    okRate: passRate,
    ngRate: failRate,
  }
}

/**
 * API/ローカルサマリーの表記ゆれを吸収し、UIが期待するフォーマットへ揃える。
 * @param {object} rawSummary    - サマリー候補。
 * @param {Array} fallbackShots  - ショット配列。
 * @returns {object|null}         正規化済みサマリー。
 */
export const normalizeShotSummary = (rawSummary, fallbackShots) => {
  if (!rawSummary || typeof rawSummary !== 'object') {
    return computeShotSummary(fallbackShots)
  }

  const totalRaw = toFiniteNumber(rawSummary.total ?? rawSummary.total_count ?? rawSummary.totalCount)
  const passRaw = toFiniteNumber(rawSummary.pass_count ?? rawSummary.ok_count ?? rawSummary.passCount ?? rawSummary.okCount)
  const failRaw = toFiniteNumber(rawSummary.fail_count ?? rawSummary.ng_count ?? rawSummary.failCount ?? rawSummary.ngCount)

  let total = totalRaw
  let passCount = passRaw
  let failCount = failRaw

  if (!Number.isFinite(total)) {
    if (Number.isFinite(passCount) && Number.isFinite(failCount)) {
      total = passCount + failCount
    } else if (Number.isFinite(passCount)) {
      total = passCount + Math.max(toFiniteNumber(rawSummary.missing_count) ?? 0, 0)
    } else if (Number.isFinite(failCount)) {
      total = failCount + Math.max(toFiniteNumber(rawSummary.missing_count) ?? 0, 0)
    } else if (Array.isArray(fallbackShots)) {
      total = fallbackShots.length
    } else {
      total = 0
    }
  }

  if (!Number.isFinite(passCount)) {
    if (Number.isFinite(failCount) && Number.isFinite(total)) {
      passCount = Math.max(total - failCount, 0)
    } else if (Array.isArray(fallbackShots)) {
      const computed = computeShotSummary(fallbackShots)
      passCount = computed?.passCount ?? computed?.okCount ?? 0
      if (!Number.isFinite(failCount)) failCount = computed?.failCount ?? computed?.ngCount ?? 0
      if (!Number.isFinite(total)) total = computed?.total ?? 0
    } else {
      passCount = 0
    }
  }

  if (!Number.isFinite(failCount)) {
    if (Number.isFinite(total) && Number.isFinite(passCount)) {
      failCount = Math.max(total - passCount, 0)
    } else {
      failCount = 0
    }
  }

  let passRate = toFiniteNumber(rawSummary.pass_rate ?? rawSummary.ok_rate ?? rawSummary.passRate ?? rawSummary.okRate)
  if (!Number.isFinite(passRate) && Number.isFinite(total) && total > 0 && Number.isFinite(passCount)) {
    passRate = (passCount / total) * 100
  }

  let failRate = toFiniteNumber(rawSummary.fail_rate ?? rawSummary.ng_rate ?? rawSummary.failRate ?? rawSummary.ngRate)
  if (!Number.isFinite(failRate)) {
    if (Number.isFinite(passRate)) {
      failRate = 100 - passRate
    } else if (Number.isFinite(total) && total > 0 && Number.isFinite(failCount)) {
      failRate = (failCount / total) * 100
    }
  }

  const safeTotal = Number.isFinite(total) ? Math.max(Math.round(total), 0) : 0
  const safePass = Number.isFinite(passCount) ? Math.max(Math.round(passCount), 0) : 0
  const safeFail = Number.isFinite(failCount) ? Math.max(Math.round(failCount), 0) : 0

  const safePassRate = clampPercent(passRate)
  const safeFailRate = clampPercent(failRate)

  return {
    total: safeTotal,
    passCount: safePass,
    failCount: safeFail,
    passRate: safePassRate,
    failRate: safeFailRate,
    // legacy aliases (to be deprecated once UI is updated)
    okCount: safePass,
    ngCount: safeFail,
    okRate: safePassRate,
    ngRate: safeFailRate,
  }
}
