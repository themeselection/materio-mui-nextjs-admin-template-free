'use client'

/*
======== ファイル概要 ========
エラーログをリスト表示するコンポーネント。件数ゼロ時の空表示とスクロール制御を担う。
*/

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

/**
 * ログ配列をカードスタイルで表示する。
 * @param   {object}   props                 - コンポーネント引数。
 * @param   {object[]} props.logs            - ログ要素の配列。
 * @param   {string}   [props.maxHeight]     - リスト最大高さ。指定時はスクロール可能にする。
 * @param   {string}   [props.emptyMessage]  - ログが空のときに表示する文言。
 * @returns {JSX.Element}                    - ログ一覧のJSX要素。
 */
export function ErrorLogList({ logs, maxHeight, emptyMessage = '該当するログが見つかりませんでした。' }) {
    // ======== 表示ステップ: 空表示 → ログカード描画の順で分岐 ========
    return (
        <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0, ...(maxHeight ? { maxHeight } : {}) }}>
            {logs.length === 0 ? (
                <Box textAlign='center' py={6} color='text.secondary'>
                    <Box component='span' className='material-icons' sx={{ fontSize: 48, color: 'text.disabled' }}>sentiment_dissatisfied</Box>
                    <Typography variant='body1' mt={2}>{emptyMessage}</Typography>
                </Box>
            ) : (
                logs.map((log, idx) => (
                    <Box
                        key={idx}
                        display='flex'
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        justifyContent='space-between'
                        sx={{
                                                    // 種類ごとに背景色を変えて視認性を確保する
                          bgcolor: (theme) => (
                            log.color === 'error'
                              ? 'var(--mui-palette-error-lightOpacity)'
                              : log.color === 'warning'
                              ? 'var(--mui-palette-warning-lightOpacity)'
                              : log.color === 'info'
                              ? 'var(--mui-palette-info-lightOpacity)'
                              : theme.palette.action.hover
                          )
                        }}
                        borderRadius={2}
                        px={2}
                        py={1.5}
                        mb={1.5}
                    >
                        <Box pr={2}>
                            <Typography fontWeight='bold' color={
                                log.color === 'error' ? 'error.main' :
                                    log.color === 'warning' ? 'warning.main' :
                                        log.color === 'default' ? 'text.primary' : 'info.main'
                            }>
                                {log.code}: {log.title}
                            </Typography>
                            {log.desc && (
                                <Typography variant='caption' color={
                                    log.color === 'error' ? 'error.dark' :
                                        log.color === 'warning' ? 'warning.dark' :
                                            'text.secondary'
                                }>
                                    {log.desc}
                                </Typography>
                            )}
                            <Box mt={0.5}>
                                <Chip
                                    size='small'
                                    label={log.unitId ? `Unit${log.unitId}` : '全体'}
                                    color={log.unitId ? 'primary' : 'default'}
                                    variant={log.unitId ? 'filled' : 'outlined'}
                                    sx={{ height: 20, '& .MuiChip-label': { px: 1, fontSize: 11 } }}
                                />
                            </Box>
                        </Box>
                        <Typography variant='body2' color='text.secondary' whiteSpace='nowrap'>
                            {log.date.replace(/-/g, '/')} {log.time}
                        </Typography>
                    </Box>
                ))
            )}
        </Box>
    )
}
