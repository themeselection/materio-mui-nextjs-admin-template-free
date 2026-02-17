/*
======== ファイル概要 ========
検査結果の良品率を円形ドーナツチャートで提示するための専用コンポーネント。
検査ビュー内で単体部品として利用し、良品率の視覚的な把握を助ける。
*/

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

/**
 * 良品率の割合を受け取り、ドーナツチャートとして描画する。
 * @param {object} props                - コンポーネントの引数。
 * @param {number} props.percentage     - 0〜100の良品率。数値が高いほど緑の弧が長くなる。
 * @param {number} [props.size=160]     - SVGの一辺の長さ。視認性確保のためデフォルト値を持たせている。
 * @returns {JSX.Element}                良品率を中央テキスト付きのドーナツチャートとして表示する要素。
 */
const DonutChart = ({ percentage, size = 160 }) => {
    const theme = useTheme()
    // SVGの半径や円周を計算してstrokeDasharrayに使う
    // ======== 処理ステップ: 円周計算で割合を可視化 ========
    // 内側に余白を持たせて円の半径を決め、円周からstrokeDasharrayを割り出すことで割合に応じた弧長を描く。
    const radius = (size - 20) / 2
    const circumference = 2 * Math.PI * radius
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`
    // 成否の描画色はテーマから取得して、ダーク/ライト両方で一貫性を保つ理由はテーマ依存色に合わせてUIが破綻しないようにするため。
    const bgStroke = theme.palette.divider
    const fgStroke = theme.palette.success.main

    return (
        <Box sx={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* 背景側のドーナツを描いて全体の形状を示す。意図として割合が欠損しても基準円が見えるようにする。 */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={bgStroke}
                    strokeWidth="8"
                />
                {/* 良品率を表す進捗用ドーナツで割合に応じた長さにする。-90度回転して12時スタートに揃える。 */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={fgStroke}
                    strokeWidth="8"
                    strokeDasharray={strokeDasharray}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </svg>
            {/* 中央に良品率のテキストを重ねて数値とラベルを提示する */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h3" component="div" fontWeight="bold" color="primary">
                    {percentage}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    良品率
                </Typography>
            </Box>
        </Box>
    )
}

export default DonutChart
