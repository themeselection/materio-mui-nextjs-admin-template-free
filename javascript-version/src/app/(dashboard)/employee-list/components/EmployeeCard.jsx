"use client"

/*
======== ファイル概要 ========
単一従業員カードのプレゼンテーション層。各種属性を強調色付きで表示し、編集メニュー操作を提供する。
*/

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'

/**
 * 氏名からカード用の頭文字を抜き出す。
 * @param {string} name - フルネーム。
 * @returns {string}    - 先頭語。空なら空文字。
 */
function getInitials(name) {
  const parts = String(name || '').trim().split(/\s+/)

  return parts[0] || ''
}

/**
 * 従業員情報をカード形式で表示するコンポーネント。
 * @param {object}   props             - コンポーネント引数。
 * @param {object}   props.employee    - 表示対象の従業員データ。
 * @param {Function} props.onMenuClick - メニュークリック時のハンドラ。
 * @param {boolean}  props.canEdit     - 編集操作を許可するか否か。
 * @returns {JSX.Element}              - 従業員カード。
 */
const EmployeeCard = ({ employee, onMenuClick, canEdit }) => {
  const isRetired = employee.status === '退職済' // 退職済みは視覚的に弱めて現役との区別を付ける。

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2, opacity: isRetired ? 0.6 : 1, position: 'relative' }}>
      {canEdit ? (
        <IconButton
          size='small'
          sx={{ position: 'absolute', top: 8, right: 8 }}
          onClick={e => onMenuClick(e, employee)}
        >
          <MoreVertIcon fontSize='small' />
        </IconButton>
      ) : null}
      <CardContent>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              marginRight: 2,
              bgcolor: employee.iconColor,
              fontWeight: 700,
              fontSize: 24,
              color: '#fff'
            }}
          >
            {getInitials(employee.name)}
          </Avatar>
          <div>
            <Typography variant='h6' sx={{ fontWeight: 700, color: isRetired ? 'text.disabled' : 'text.primary' }}>{employee.name}</Typography>
            <Typography variant='body2' color='text.secondary'>ID: {employee.id}</Typography>
          </div>
        </div>
        <Typography variant='body2'><b>担当:</b> <span style={{ color: isRetired ? '#888' : '#6366f1', fontWeight: 500 }}>{employee.department}</span></Typography>
        <Typography variant='body2'><b>役職:</b> {employee.role}</Typography>
        <Typography variant='body2'>
          <b>在籍状況:</b> <span style={{ background: isRetired ? '#f3f4f6' : '#bbf7d0', color: isRetired ? '#888' : '#15803d', borderRadius: 8, padding: '2px 10px', fontWeight: 600, fontSize: 13 }}>{employee.status}</span>
        </Typography>
        <Typography variant='body2'><b>備考:</b> {employee.notes}</Typography>
      </CardContent>
    </Card>
  )
}

export default EmployeeCard
