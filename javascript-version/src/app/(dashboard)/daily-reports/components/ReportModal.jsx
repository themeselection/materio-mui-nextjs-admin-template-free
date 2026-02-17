/*
======== ファイル概要 ========
日報の登録・編集フォームをモーダル表示し、入力値をAPI送信用に整形して親へ返すコンポーネントを定義する。
*/

import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ★修正: 正しいパスに変更しました
import useAuthMe from '@core/hooks/useAuthMe';

/**
 * 日報の新規登録または編集を行うモーダルフォーム。
 * @param {boolean} open                - モーダルの開閉状態。
 * @param {Function} onClose            - モーダルを閉じるためのコールバック。
 * @param {Function} onSubmit           - 入力内容を親へ送信するコールバック。
 * @param {object|null} initialData     - 編集時の初期値。新規時はnull想定。
 * @returns {JSX.Element}               - 入力フォーム付きのモーダル。
 */
export default function ReportModal({ open, onClose, onSubmit, initialData }) {
  // ログインユーザー情報を取得
  const { user } = useAuthMe();

  // ======== 処理ステップ: 入力状態の初期化 → マスタ取得 → 初期値設定 ========
  // 1. 入力状態の初期化では登録と編集のどちらでも使える空フォームを用意し、開閉に依存しない状態を維持する。
  // 2. マスタ取得ではライン情報のみフェッチして選択肢を最新化する。モーダルが開いている間だけ取得し無駄なリクエストを避ける。
  // 3. 初期値設定では編集時は既存値、新規時は利用者の情報を自動反映させ、入力の手間を減らす。
  const [formData, setFormData] = useState({
    employee_id: '',
    line_id: '',
    report_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [lineList, setLineList] = useState([]);

  // 編集モード判定
  const isEditMode = Boolean(initialData);

  // マスタデータ取得 (ライン一覧のみ)
  useEffect(() => {
    if (open) {
      const fetchMasters = async () => {
        try {
          const lineRes = await fetch('/api/lines');      
          if (lineRes.ok) {
            const data = await lineRes.json();
            setLineList(Array.isArray(data) ? data : (data.lines || []));
          }
        } catch (error) {
          console.error('マスタデータ取得エラー:', error);
        }
      };
      fetchMasters();
    }
  }, [open]);

  // フォーム初期値の設定
  useEffect(() => {
    if (open) {
      if (initialData) {
        // --- 編集モード ---
        setFormData({
            employee_id: initialData.employee_id || '',
            line_id: initialData.line_id || '',
            report_date: initialData.date ? initialData.date.split('T')[0] : '',
            notes: initialData.work || '' 
        });
      } else {
        // --- 新規登録モード ---
        // ログインユーザーのIDを自動セット
        // user.employee_id がなければ user.id を使う
        const currentUserId = user?.employee_id || user?.id || '';
        
        setFormData({
          employee_id: currentUserId, 
          line_id: '',
          report_date: new Date().toISOString().split('T')[0],
          notes: ''
        });
      }
    }
  }, [open, initialData, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * フォーム送信時の入力チェックと親コンポーネントへの通知を実施する。
   * 必須項目が欠ける状態ではAPIエラーになるため、事前にアラートで防ぐ。
   */
  const handleSubmit = () => {
    if (!formData.employee_id || !formData.line_id || !formData.report_date) {
      // API仕様で必須となっている3項目が欠けると422エラーになるため、送信前にブロックする。
      alert('担当者情報、日付、製品名は必須です');
      return;
    }
    onSubmit(formData);
    onClose();
  };

  // 表示する担当者名
  const displayUserName = isEditMode 
    ? initialData?.user // 編集時は元データの名前
    : (user?.employee_name || user?.name || user?.username || '読み込み中...');

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        {isEditMode ? '日報の編集' : '日報の新規登録'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          
          {/* 日付 */}
          <TextField
            label="日付"
            type="date"
            name="report_date"
            value={formData.report_date}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          {/* 担当者 (自動入力表示) */}
          <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              担当者 (自動入力)
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {displayUserName}
            </Typography>
          </Box>

          {/* 製品名 (ライン) */}
          <TextField
            select
            label="製品名 (ライン)"
            name="line_id"
            value={formData.line_id}
            onChange={handleChange}
            fullWidth
          >
             {lineList.length === 0 && <MenuItem disabled>読み込み中...</MenuItem>}
             {lineList.map((line) => (
              <MenuItem key={line.line_id} value={line.line_id}>
                {line.line_name}
              </MenuItem>
            ))}
          </TextField>

          {/* 作業内容 */}
          <TextField
            label="作業内容"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            placeholder="本日の作業内容..."
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit">キャンセル</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          // IDがセットされるまでボタンを押せないようにする
          disabled={!formData.employee_id}
        >
          {isEditMode ? '更新する' : '登録する'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}