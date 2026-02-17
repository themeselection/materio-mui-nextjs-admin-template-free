/*
======== ファイル概要 ========
個別の出荷指示を表示するカードコンポーネント。完了トグル、編集/削除ボタン、仕様・配送情報の表示を担い
ます。完了済みカードには視覚的なオーバーレイとライン別アクセントを適用しています。
*/

"use client"
// カードのコンポーネント

import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SquareFootIcon from '@mui/icons-material/SquareFoot'
import PaletteIcon from '@mui/icons-material/Palette'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import PlaceIcon from '@mui/icons-material/Place'
import EventIcon from '@mui/icons-material/Event'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import NotesIcon from '@mui/icons-material/Notes'
import useAuthMe from '@core/hooks/useAuthMe'
import SurfaceBox from '@/components/surface/SurfaceBox'

import SpringIcon from './icons/SpringIcon'

// カードの縦幅を揃えてレイアウト崩れを防ぐ最低高さ
const cardMinHeight = 260

// ライン種別ごとにアクセントカラーを割り当て、カード境界色に反映する関数
const lineAccentKey = line => (line === 'マット' ? 'info' : line === 'ボトム' ? 'warning' : 'default')

/**
 * ライン表示用チップ。
 * @param {{ line: string }} props - ライン名を受け取るプロップス。
 * @returns {JSX.Element}          - ライン別に色調整したチップ。
 */
const LineChip = ({ line }) => (
  <Chip
    size='small'
    label={line}
    sx={{
      px: 1.25,
      fontWeight: 700,
      bgcolor: theme => {
        const key = lineAccentKey(line)
        if (key === 'info') return 'var(--mui-palette-info-lightOpacity)'
        if (key === 'warning') return 'var(--mui-palette-warning-lightOpacity)'
        return theme.palette.action.hover
      },
      color: theme => {
        const key = lineAccentKey(line)
        if (key === 'info') return theme.palette.info.dark
        if (key === 'warning') return theme.palette.warning.dark
        return theme.palette.text.primary
      }
    }}
  />
)

/**
 * タイトル文字列をライン名とサブテキストに分割する補助。
 * @param {string} title - カード表示用タイトル。
 * @param {string} line  - ライン名。
 * @returns {{main:string,sub:string}} - 見出しとサブタイトル。
 */
function splitTitle(title, line) {
  if (!title) return { main: line, sub: '' }
  if (title.startsWith(line)) {
    return { main: line, sub: title.slice(line.length).trim() }
  }
  return { main: line, sub: title }
}

/**
 * 出荷指示カード。
 * @param {object}        props                           - コンポーネント引数。
 * @param {object}        props.instruction               - 表示対象の指示データ。
 * @param {Function}      props.onToggleComplete          - 完了トグル時のハンドラ。
 * @param {Function}      props.onEdit                    - 編集ボタン押下時のハンドラ。
 * @param {Function}      [props.onDelete]                - 削除ボタン押下時のハンドラ。
 * @returns {JSX.Element}                                 - 完了状態と詳細情報を含むカード。
 */
const ShippingInstructionCard = ({ instruction, onToggleComplete, onEdit, onDelete }) => {
  const { isAdmin } = useAuthMe()
  const { main, sub } = splitTitle(instruction.title, instruction.line)

  // ======== 処理ステップ: 完了トグル → 表示レイアウト → 管理操作 ========
  // 1. カード全体をフォーカス可能にし、Enter/Spaceでも完了を切り替えられるようキーボード対応する。
  // 2. ライン別アクセントと仕様/配送ブロックで情報を整理し、完了時は斜線と淡色背景で視認性を保つ。
  // 3. 管理者のみ編集/削除を出し分け、クリック時はイベント伝播を止めて完了トグルと競合しないようにする。

  const handleCardClick = e => {
    if (!onToggleComplete) return
    onToggleComplete(instruction.id, e && e.clientX, e && e.clientY)
  }
  const handleKeyDown = e => {
    if (!onToggleComplete) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggleComplete(instruction.id)
    }
  }

  return (
    <Card
      className='fade-in'
      sx={{
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        opacity: instruction.completed ? 0.95 : 1,
        border: theme => `1px solid ${instruction.completed ? theme.palette.success.main : theme.palette.divider}`,
        backgroundColor: theme => (instruction.completed ? 'var(--mui-palette-success-lightOpacity)' : theme.palette.background.paper),
        minHeight: cardMinHeight,
        height: '100%',
        width: '100%',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s',
        position: 'relative',
          cursor: onToggleComplete ? 'pointer' : 'default',
        '&:before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '6px',
          borderTopLeftRadius: '12px',
          borderBottomLeftRadius: '12px',
          backgroundColor: theme => (
            instruction.completed
              ? theme.palette.success.main
              : (() => {
                  const key = lineAccentKey(instruction.line)
                  if (key === 'info') return theme.palette.info.main
                  if (key === 'warning') return theme.palette.warning.main
                  return theme.palette.divider
                })()
          )
        },
        '&:hover': {
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          transform: 'translateY(-4px)'
        }
      }}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role='button'
      tabIndex={0}
    >
      {instruction.completed && (
        <div className='absolute inset-0 pointer-events-none flex items-center justify-center'>
          <CheckCircleIcon sx={{ fontSize: 140, color: 'var(--mui-palette-success-lightOpacity)' }} />
        </div>
      )}

      <Box sx={{ p: 5, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <LineChip line={instruction.line} />
          <Typography
            variant='h3'
            sx={{
              fontWeight: 800,
              fontSize: 20,
              color: 'text.primary',
              mt: 1.5,
              lineHeight: 1.3,
              wordBreak: 'break-word',
              overflowWrap: 'anywhere',
              textDecoration: instruction.completed ? 'line-through' : 'none'
            }}
          >
            {instruction.productName || main}
            <Typography component='span' sx={{ fontSize: 15, color: 'text.secondary', fontWeight: 500, display: 'block', mt: 0.5, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
              {instruction.size || sub}
            </Typography>
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right', flexShrink: 0, display: 'flex', alignItems: 'flex-start', gap: 3 }}>
          <span
            className='px-2.5 py-1 rounded-full text-xs font-bold select-none'
            style={{
              backgroundColor: instruction.completed ? 'var(--mui-palette-success-lightOpacity)' : 'transparent',
              color: instruction.completed ? 'var(--mui-palette-success-dark)' : 'inherit',
              border: instruction.completed ? '1px solid var(--mui-palette-success-main)' : '1px solid var(--mui-palette-divider)'
            }}
          >
            {instruction.completed ? '完了' : '未完了'}
          </span>
          <Checkbox
            checked={instruction.completed}
            onClick={e => { if (!onToggleComplete) return; e.stopPropagation(); onToggleComplete(instruction.id, e.clientX, e.clientY) }}
            onChange={() => { }}
            icon={<RadioButtonUncheckedIcon />}
            checkedIcon={<CheckCircleIcon />}
            sx={{ p: 0, '&.Mui-checked': { color: 'success.main' } }}
            inputProps={{ 'aria-label': '完了' }}
          />
        </Box>
      </Box>

      <Box sx={{ p: 5, flexGrow: 1 }} style={{ textDecoration: instruction.completed ? 'line-through' : 'none' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant='overline' sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: '0.08em' }}>仕様</Typography>
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PaletteIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
              <Typography component='span' variant='body2' color='text.secondary' sx={{ width: 80, flexShrink: 0 }}>カラー:</Typography>
              <Typography component='span' variant='body2' sx={{ fontWeight: 500 }}>{instruction.color || '-'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <SquareFootIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
              <Typography component='span' variant='body2' color='text.secondary' sx={{ width: 80, flexShrink: 0 }}>サイズ:</Typography>
              <Typography component='span' variant='body2' sx={{ fontWeight: 500 }}>{instruction.size || '-'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <SpringIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
              <Typography component='span' variant='body2' color='text.secondary' sx={{ width: 80, flexShrink: 0 }}>スプリング:</Typography>
              <Typography component='span' variant='body2' sx={{ fontWeight: 500 }}>{instruction.springType || '-'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Inventory2Icon sx={{ color: 'text.secondary', fontSize: 18 }} />
              <Typography component='span' variant='body2' color='text.secondary' sx={{ width: 80, flexShrink: 0 }}>同梱物:</Typography>
              <Typography component='span' variant='body2' sx={{ fontWeight: 500 }}>{instruction.includedItems || instruction.note || '-'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <NotesIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
              <Typography component='span' variant='body2' color='text.secondary' sx={{ width: 80, flexShrink: 0 }}>備考:</Typography>
              <Typography component='span' variant='body2' sx={{ fontWeight: 500 }}>{instruction.remarks || '-'}</Typography>
            </Box>
          </Box>
        </Box>
        <Box>
          <Typography variant='overline' sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: '0.08em' }}>配送情報</Typography>
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalShippingIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
              <Typography component='span' variant='body2' color='text.secondary' sx={{ width: 80, flexShrink: 0 }}>配送方法:</Typography>
              <Typography component='span' variant='body2' sx={{ fontWeight: 500 }}>{instruction.shippingMethod || '-'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <PlaceIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
              <Typography component='span' variant='body2' color='text.secondary' sx={{ width: 80, flexShrink: 0 }}>配送先:</Typography>
              <Typography component='span' variant='body2' sx={{ fontWeight: 500 }}>{instruction.destination || '-'}</Typography>
            </Box>
            {instruction.remarks && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <EventIcon sx={{ color: 'error.main', fontSize: 18 }} />
                <Typography component='span' variant='body2' color='text.secondary' sx={{ width: 80, flexShrink: 0 }}>特記:</Typography>
                <Typography component='span' variant='body2' sx={{ fontWeight: 700, color: 'error.main' }}>{instruction.remarks}</Typography>
              </Box>
            )}
            {instruction.createdAt && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <EventIcon sx={{ fontSize: 18 }} />
                <Typography variant='body2' color='text.secondary'>{new Date(instruction.createdAt).toLocaleString()}</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <SurfaceBox variant='soft' sx={{ p: 4, borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', textDecoration: instruction.completed ? 'line-through' : 'none' }}>
          <Typography component='span' sx={{ ml: 1, color: 'text.secondary', fontSize: 12, fontWeight: 700, lineHeight: 1 }}>数量:</Typography>
          <Typography component='span' sx={{ ml: 0.75, mb: 0.375, color: instruction.completed ? 'success.main' : 'primary.main', fontSize: 25, fontWeight: 800 }}>
            {instruction.quantity ?? '-'}
          </Typography>
        </Box>
        {isAdmin && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant='text'
              size='small'
              onClick={e => { e.stopPropagation(); onEdit(instruction) }}
              startIcon={<EditOutlinedIcon />}
              sx={{ color: 'primary.main', fontWeight: 600 }}
            >
              編集
            </Button>
            {onDelete && (
              <Button
                variant='text'
                size='small'
                onClick={e => { e.stopPropagation(); onDelete(instruction) }}
                startIcon={<DeleteOutlineIcon />}
                sx={{ color: 'error.main', fontWeight: 600 }}
              >
                削除
              </Button>
            )}
          </Box>
        )}
      </SurfaceBox>
    </Card>
  )
}

export default ShippingInstructionCard
