/*
======== ファイル概要 ========
完了済み出荷指示を未完了へ戻す際に確認を促すダイアログ。ユーザーの誤操作を防ぐために利用します。
*/

// 完了を取り消すか聞くダイアログ

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

/**
 * 完了解除確認ダイアログ。
 * @param {object}   props                 - コンポーネント引数。
 * @param {boolean}  props.open            - ダイアログ表示フラグ。
 * @param {Function} props.onCancel        - キャンセル押下時のハンドラ。
 * @param {Function} props.onConfirm       - 未完了へ戻す確定ハンドラ。
 * @returns {JSX.Element}                  - 確認用のダイアログ。
 */
const ConfirmRevertDialog = ({ open, onCancel, onConfirm }) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>完了を取り消しますか？</DialogTitle>
    <DialogContent>
      <Typography>この指示を未完了に戻しますか？</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel}>キャンセル</Button>
      <Button onClick={onConfirm} variant='contained'>未完了に戻す</Button>
    </DialogActions>
  </Dialog>
)

export default ConfirmRevertDialog
