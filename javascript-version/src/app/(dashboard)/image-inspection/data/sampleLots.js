/*
======== ファイル概要 ========
APIレスポンスを模したサンプルロットデータセット。開発時のモックソースとして利用する。
*/

/**
 * representative_image が欠如している場合に最初のカメラ画像から生成する。
 * @param {object} lot - ロットエントリ。
 * @returns {object}   representative_imageを補完したロット。
 */
const withRepresentativeImage = lot => {
  if (lot.representative_image) return lot
  const firstImage = lot.cameras && lot.cameras.length > 0 ? lot.cameras[0].image_path : null
  if (!firstImage) return lot
  const cleaned = firstImage.replace(/\\/g, '/')
  const normalizedPath = cleaned.replace(/\/{2,}/g, '/')
  const normalized = normalizedPath.startsWith('/imageDB/')
    ? normalizedPath
    : `/imageDB/beforeTest/${normalizedPath.replace(/^\/+/, '')}`
  return {
    ...lot,
    representative_image: normalized,
  }
}

export const SAMPLE_LOTS = {
  total_pages: 1,
  current_page: 1,
  lots: [
    // --- 2025-09-30 分 ---
    {
      lot_id: 'MAT-09030-01',
      section: 'バネ留め',
      captured_at: '2025-09-30T09:15:12.000Z',
      pass: true,
      cameras: [
        { camera_id: 'B-spring01', status: 'PASS', details: null, image_path: 'MAT-09030-01_B-spring01-01.jpg' },
        { camera_id: 'B-spring02', status: 'PASS', details: null, image_path: 'MAT-09030-01_B-spring02-01.jpg' },
        { camera_id: 'B-spring03', status: 'PASS', details: null, image_path: 'MAT-09030-01_B-spring03-01.jpg' },
        { camera_id: 'B-spring04', status: 'PASS', details: null, image_path: 'MAT-09030-01_B-spring04-01.jpg' }
      ],
    },
    {
      lot_id: 'MAT-09030-02',
      section: 'バネ留め',
      captured_at: '2025-09-30T10:45:45.000Z',
      pass: false,
      cameras: [
        { camera_id: 'B-spring01', status: 'FAIL', details: 'バネ外れ', image_path: 'MAT-09030-02_B-spring01-01.jpg' },
        { camera_id: 'B-spring02', status: 'PASS', details: null, image_path: 'MAT-09030-02_B-spring02-01.jpg' },
        { camera_id: 'B-spring03', status: 'PASS', details: null, image_path: 'MAT-09030-02_B-spring03-01.jpg' },
        { camera_id: 'B-spring04', status: 'PASS', details: null, image_path: 'MAT-09030-02_B-spring04-01.jpg' }
      ],
    },
    {
      lot_id: 'LOLL-09030-01',
      section: 'A層検査',
      captured_at: '2025-09-30T11:05:30.000Z',
      pass: false,
      cameras: [
        { camera_id: 'A-main01', status: 'FAIL', details: 'A層ヨゴレ', image_path: 'LOLL-09030-01_A-main01-01.jpg' },
      ],
    },
    {
      lot_id: 'LOLL-09030-02',
      section: 'A層検査',
      captured_at: '2025-09-30T13:22:10.000Z',
      pass: true,
      cameras: [
        { camera_id: 'A-main01', status: 'PASS', details: null, image_path: 'LOLL-09030-02_A-main01-01.jpg' },
      ],
    },

    {
      lot_id: 'MAT-10001',
      section: 'バネ留め',
      captured_at: '2025-10-01T17:47:53.427Z',
      pass: false,
      cameras: [
        { camera_id: 'B-spring01', status: 'FAIL', details: 'バネ取り付け角度規定外', image_path: 'MAT-10001_B-spring01-01.jpg' },
        { camera_id: 'B-spring01', status: 'PASS', details: null, image_path: 'MAT-10001_B-spring01-02.jpg' },
        { camera_id: 'B-spring02', status: 'FAIL', details: 'バネ取り付け角度規定外', image_path: 'MAT-10001_B-spring02-01.jpg' },
        { camera_id: 'B-spring02', status: 'PASS', details: null, image_path: 'MAT-10001_B-spring02-02.jpg' },
        { camera_id: 'B-spring03', status: 'PASS', details: null, image_path: 'MAT-10001_B-spring03-01.jpg' },
        { camera_id: 'B-spring03', status: 'PASS', details: null, image_path: 'MAT-10001_B-spring03-02.jpg' },
        { camera_id: 'B-spring04', status: 'PASS', details: null, image_path: 'MAT-10001_B-spring04-01.jpg' },
        { camera_id: 'B-spring04', status: 'PASS', details: null, image_path: 'MAT-10001_B-spring04-02.jpg' }
      ],
    },
    {
      lot_id: 'MAT-10002',
      section: 'バネ留め',
      captured_at: '2025-10-01T17:50:12.123Z',
      pass: true,
      cameras: [
        { camera_id: 'B-spring01', status: 'PASS', details: null, image_path: 'MAT-10002_B-spring01-01.jpg' },
        { camera_id: 'B-spring02', status: 'PASS', details: null, image_path: 'MAT-10002_B-spring02-01.jpg' },
        { camera_id: 'B-spring03', status: 'PASS', details: null, image_path: 'MAT-10002_B-spring03-01.jpg' },
        { camera_id: 'B-spring04', status: 'PASS', details: null, image_path: 'MAT-10002_B-spring04-01.jpg' }
      ],
    },
    {
      lot_id: 'MAT-10003',
      section: 'バネ留め',
      captured_at: '2025-10-01T17:52:30.555Z',
      pass: false,
      cameras: [
        { camera_id: 'B-spring01', status: 'FAIL', details: 'バネ外れ', image_path: 'MAT-10003_B-spring01-01.jpg' },
        { camera_id: 'B-spring02', status: 'PASS', details: null, image_path: 'MAT-10003_B-spring02-01.jpg' },
        { camera_id: 'B-spring03', status: 'PASS', details: null, image_path: 'MAT-10003_B-spring03-01.jpg' },
        { camera_id: 'B-spring04', status: 'PASS', details: null, image_path: 'MAT-10003_B-spring04-01.jpg' }
      ],
    },
    {
      lot_id: 'LOLL-10001',
      section: 'A層検査',
      captured_at: '2025-10-01T17:47:53.427Z',
      pass: false,
      cameras: [
        { camera_id: 'A-main01', status: 'FAIL', details: 'A層ヨゴレ', image_path: 'LOLL-10001_A-main01-01.jpg' },
        { camera_id: 'A-main01', status: 'FAIL', details: 'ゴミ付着', image_path: 'LOLL-10001_A-main01-02.jpg' },
        { camera_id: 'A-main01', status: 'PASS', details: null, image_path: 'LOLL-10001_A-main01-03.jpg' },
        { camera_id: 'A-main01', status: 'PASS', details: null, image_path: 'LOLL-10001_A-main01-04.jpg' },
      ],
    },
    {
      lot_id: 'LOLL-10002',
      section: 'A層検査',
      captured_at: '2025-10-01T17:49:10.789Z',
      pass: true,
      cameras: [
        { camera_id: 'A-main01', status: 'PASS', details: null, image_path: 'LOLL-10002_A-main01-01.jpg' },
      ],
    },
    {
      lot_id: 'LOLL-10003',
      section: 'A層検査',
      captured_at: '2025-10-01T17:51:05.321Z',
      pass: false,
      cameras: [
        { camera_id: 'A-main01', status: 'FAIL', details: 'A層ヨゴレ', image_path: 'LOLL-10003_A-main01-01.jpg' },
      ],
    },

    // --- 2025-10-02 分 ---
    {
      lot_id: 'MAT-10002-01',
      section: 'バネ留め',
      captured_at: '2025-10-02T01:10:00.000Z',
      pass: true,
      cameras: [
        { camera_id: 'B-spring01', status: 'PASS', details: null, image_path: 'MAT-10002-01_B-spring01-01.jpg' },
        { camera_id: 'B-spring02', status: 'PASS', details: null, image_path: 'MAT-10002-01_B-spring02-01.jpg' },
        { camera_id: 'B-spring03', status: 'PASS', details: null, image_path: 'MAT-10002-01_B-spring03-01.jpg' },
        { camera_id: 'B-spring04', status: 'PASS', details: null, image_path: 'MAT-10002-01_B-spring04-01.jpg' }
      ],
    },
    {
      lot_id: 'MAT-10002-02',
      section: 'バネ留め',
      captured_at: '2025-10-02T03:30:45.000Z',
      pass: false,
      cameras: [
        { camera_id: 'B-spring01', status: 'PASS', details: null, image_path: 'MAT-10002-02_B-spring01-01.jpg' },
        { camera_id: 'B-spring02', status: 'FAIL', details: 'バネ取り付け角度規定外', image_path: 'MAT-10002-02_B-spring02-01.jpg' },
        { camera_id: 'B-spring03', status: 'PASS', details: null, image_path: 'MAT-10002-02_B-spring03-01.jpg' },
        { camera_id: 'B-spring04', status: 'PASS', details: null, image_path: 'MAT-10002-02_B-spring04-01.jpg' }
      ],
    },
    {
      lot_id: 'LOLL-10002-01',
      section: 'A層検査',
      captured_at: '2025-10-02T04:00:00.000Z',
      pass: true,
      cameras: [
        { camera_id: 'A-main01', status: 'PASS', details: null, image_path: 'LOLL-10002-01_A-main01-01.jpg' },
      ],
    },
    {
      lot_id: 'LOLL-10002-02',
      section: 'A層検査',
      captured_at: '2025-10-02T05:45:15.000Z',
      pass: false,
      cameras: [
        { camera_id: 'A-main01', status: 'FAIL', details: 'ゴミ付着', image_path: 'LOLL-10002-02_A-main01-01.jpg' },
      ],
    },
  ].map(withRepresentativeImage),
}

export default SAMPLE_LOTS
