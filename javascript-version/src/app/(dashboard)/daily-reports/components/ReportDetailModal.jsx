/*
======== ファイル概要 ========
日報の詳細をポップアップで確認するモーダルコンポーネントを定義する。
ヘッダーから本文まで統一したスタイルで日次報告の内容を表示する。
*/

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

/**
 * 日報の詳細情報をモーダル表示するコンポーネント。
 * @param {boolean} open          - モーダルの開閉状態。
 * @param {Function} onClose      - 閉じる操作を通知するコールバック。
 * @param {object|null} report    - 表示対象の日報データ。null時は描画しない。
 * @returns {JSX.Element|null}    - 詳細情報を表示するダイアログ、対象が無ければnull。
 */
export default function ReportDetailModal({ open, onClose, report }) {
  if (!report) return null; // データ未設定時にモーダルを空描画させず安全にスキップする。

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* アバターを表示 */}
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: report.avatarColor || '#ccc',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          {report.avatarText}
        </Box>
        <Box>
          <Typography variant="h6" component="div" sx={{ lineHeight: 1.2 }}>
            {report.user}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ID: {report.id}
          </Typography>
        </Box>
      </DialogTitle>
      
      <Divider />

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          
          {/* ★修正: 日付にもボックススタイルを適用 */}
          <Box sx={{ bgcolor: '#f9fafb', p: 2, borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              日付
            </Typography>
            <Typography variant="body1" fontWeight="500">
              {report.date} 
            </Typography>
          </Box>

          {/* ★修正: ライン・製品名にもボックススタイルを適用 */}
          <Box sx={{ bgcolor: '#f9fafb', p: 2, borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              担当ライン / 製品
            </Typography>
            <Box>
              <Chip 
                label={report.product} 
                color="primary" 
                variant="outlined" 
                size="small" 
                sx={{ bgcolor: 'white' }} 
              />
            </Box>
          </Box>

          {/* 作業内容 (ここは既存のまま) */}
          <Box sx={{ bgcolor: '#f9fafb', p: 2, borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              作業内容・報告事項
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {report.work}
            </Typography>
          </Box>

        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
}