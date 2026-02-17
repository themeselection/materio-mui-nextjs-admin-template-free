/*
======== ファイル概要 ========
サマリーAPIのレスポンス形式を模したモックデータ。キーは `${sectionCode}|${date}` で管理する。
*/

export const SAMPLE_SUMMARIES = {
  // ユーザー指定のサンプル
  'alayer|2025-10-14': {
    section: 'alayer',
    date: '2025-10-14',
    total_count: 150,
    pass_count: 145,
    fail_count: 5,
    pass_rate: 97,
    fail_reasons: [
      { reason: '位置ずれ', count: 3 },
      { reason: '糸ほつれ', count: 1 },
      { reason: '異物混入', count: 1 }
    ]
  },
  'spring|2025-10-14': {
    section: 'spring',
    date: '2025-10-14',
    total_count: 180,
    pass_count: 171,
    fail_count: 9,
    pass_rate: 95,
    fail_reasons: [
      { reason: 'バネ外れ', count: 5 },
      { reason: '角度規定外', count: 3 },
      { reason: '部品欠品', count: 1 }
    ]
  }

  // 追加サンプルを入れたい場合は以下に追記してください（例）
  // 'spring|2025-10-01': {
  //   section: 'spring',
  //   date: '2025-10-01',
  //   total_count: 120,
  //   pass_count: 118,
  //   fail_count: 2,
  //   pass_rate: 98,
  //   fail_reasons: [
  //     { reason: 'バネ外れ', count: 2 }
  //   ]
  // }
}

export default SAMPLE_SUMMARIES
