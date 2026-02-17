/*
======== ファイル概要 ========
カメラごとのプレビュー画像と稼働ステータスをグリッドで並べる表示レイヤー。
呼び出し元から受け取ったカメラ名配列と状態マップを元にレスポンシブに描画する。
*/

import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

import CameraTile from './CameraTile'

/**
 * カメラ一覧をカード状に並べ、欠番があっても見やすく扱うグリッド。
 * @param {object} props                             - プロパティ集合。
 * @param {string[]} props.cameraNames               - 表示するカメラ名称の配列。
 * @param {Object.<string, string>} props.statusByName - カメラ名→判定ステータスのマップ。
 * @param {Object.<string, string>} props.imageByName  - カメラ名→画像パスのマップ。
 * @returns {JSX.Element}                              CameraTile を並べたグリッド。
 */
const CameraGrid = ({ cameraNames = [], statusByName, imageByName = {} }) => {
  const uniqueNames = Array.from(new Set((cameraNames || []).filter(Boolean)))
  const isSingleCamera = uniqueNames.length === 1
  // 3台のときも2x2(=4枠)で表示するため、ダミー枠を追加する。空白を作ることで視線移動が一定になり情報量を揃えられるため。
  const needsDummy = !isSingleCamera && uniqueNames.length === 3
  // 3台の場合は四角形レイアウトになるようダミー枠を挿入
  const items = needsDummy ? [...uniqueNames, '__dummy__'] : uniqueNames
  const isTwoCols = items.length >= 4 || items.length === 3 // 3台時も2列に固定してカード縦横比を保つ。

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  const dummyImg = `${basePath}/images/pages/CameraNotFound.png`

  // ======== 処理ステップ: レイアウト判定 → タイル描画 → ダミー補完 ========
  // 1. レイアウト判定ではcol数とダミー枠を算出し、グリッドの視認性を維持する。
  // 2. タイル描画ではCameraTileへ名前/状態/画像を渡して統一表示させる。
  // 3. ダミー補完は画像欠損時の空枠を説明するため、ユーザーが未設置カメラだと分かるようにする。
  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      {items.map((name, i) => {
        const rawStatus = statusByName?.[name]
        const resolvedStatus = typeof rawStatus === 'string' && rawStatus.trim() ? rawStatus : 'MISSING'

        const imagePath = name === '__dummy__' ? null : imageByName?.[name]

        return (
          <Grid
            item
            xs={12}
            sm={isSingleCamera ? 12 : 6}
            md={isSingleCamera ? 12 : isTwoCols ? 6 : 4}
            key={i}
          >
            {name === '__dummy__' ? (
              <Box
                sx={{
                  bgcolor: 'grey.900',
                  borderRadius: 2,
                  aspectRatio: '16/9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={dummyImg}
                  alt="placeholder"
                  draggable={false}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            ) : (
              <CameraTile name={name} status={resolvedStatus} isSingle={isSingleCamera} imagePath={imagePath} />
            )}
          </Grid>
        )
      })}
    </Grid>
  )
}

export default CameraGrid
