/*
======== ファイル概要 ========
日報削除の最終確認モーダルを描画するコンポーネントを定義する。
ダイアログの見た目とボタン操作を統一して、呼び出し元に結果を返す役割を担う。
*/

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

/**
 * 日報削除時にユーザーへ確認を促すモーダル。
 * @param {boolean} open          - モーダルの開閉状態。
 * @param {Function} onClose      - キャンセル押下時や外側クリック時のクローズ処理。
 * @param {Function} onConfirm    - 削除実行ボタン押下時のコールバック。
 * @returns {JSX.Element}         - 警告メッセージ付きの確認ダイアログ。
 */
export default function DeleteConfirmModal({ open, onClose, onConfirm }) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 2, p: 1 } // 全体の角丸と余白
      }}
    >
      {/* タイトルと閉じるボタン */}
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          日報の削除
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pb: 3 }}>
        <Typography sx={{ mb: 3, color: 'text.secondary' }}>
          本当にこの日報データを削除しますか？<br />
          この操作は取り消せません。
        </Typography>

        {/* 赤色の警告ボックス */}
        <Box 
          sx={{ 
            bgcolor: '#fee2e2', // 薄い赤背景
            color: '#b91c1c',   // 濃い赤文字
            p: 2, 
            borderRadius: 1,
            display: 'flex',
            alignItems: 'start',
            gap: 1.5,
            border: '1px solid #fecaca'
          }}
        >
          <WarningAmberRoundedIcon sx={{ fontSize: 24, mt: 0.2 }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            削除するとデータは完全に失われ、元に戻すことはできません。
            十分に確認してから実行してください。
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        {/* キャンセルボタン (グレー) */}
        <Button 
          onClick={onClose} 
          variant="contained"
          sx={{ 
            bgcolor: '#e5e7eb', 
            color: '#374151',
            fontWeight: 'bold',
            boxShadow: 'none',
            '&:hover': { bgcolor: '#d1d5db' }
          }}
        >
          キャンセル
        </Button>

        {/* 削除ボタン (赤) */}
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color="error"
          sx={{ fontWeight: 'bold', boxShadow: 'none' }}
        >
          削除
        </Button>
      </DialogActions>
    </Dialog>
  );
}