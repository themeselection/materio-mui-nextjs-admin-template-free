/*
======== ファイル概要 ========
出荷指示を削除する前にユーザーへ最終確認を求めるダイアログ。対象名の表示にも対応します。
*/

// 削除確認ダイアログ

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

/**
 * 削除確認ダイアログ。
 * @param {object}   props                 - コンポーネント引数。
 * @param {boolean}  props.open            - ダイアログ表示フラグ。
 * @param {Function} props.onCancel        - キャンセル時のハンドラ。
 * @param {Function} props.onConfirm       - 削除確定時のハンドラ。
 * @param {string}   [props.itemTitle]     - 確認メッセージに表示する対象名。
 * @returns {JSX.Element}                  - 削除確認用のダイアログ。
 */
const ConfirmDeleteDialog = ({ open, onCancel, onConfirm, itemTitle }) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>この指示を削除しますか？</DialogTitle>
    <DialogContent>
      <Typography>
        {itemTitle ? `「${itemTitle}」を削除します。よろしいですか？` : 'この指示を削除します。よろしいですか？'}
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel}>キャンセル</Button>
      <Button onClick={onConfirm} color='error' variant='contained'>削除する</Button>
    </DialogActions>
  </Dialog>
)

export default ConfirmDeleteDialog
