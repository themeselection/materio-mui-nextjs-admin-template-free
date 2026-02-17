/*
======== ファイル概要 ========
日報一覧の検索条件入力エリアを提供し、検索値とソート順変更をハンドラーへ通知するコンポーネントを定義する。
*/

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
// ★ 追加インポート
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

/**
 * 日報一覧用の検索フォームと並び替えをまとめたフィルターコンポーネント。
 * @param {string} searchUser         - 担当者名の検索キーワード。
 * @param {string} searchDate         - 指定日での絞り込み値。
 * @param {string} searchProduct      - 製品名の検索キーワード。
 * @param {string} sortOrder          - 並び順識別子。
 * @param {Function} onChange         - フィルタ入力変更時に呼ばれるハンドラー。
 * @param {Function} onSortChange     - 並び順変更時に呼ばれるハンドラー。
 * @returns {JSX.Element}             - 4カラム構成のフィルタフォーム。
 */
export default function ReportFilter({ 
  searchUser, 
  searchDate, 
  searchProduct, 
  sortOrder,       // ★追加: ソート状態を受け取る
  onChange, 
  onSortChange     // ★追加: ソート変更関数を受け取る
}) {
  return (
    <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Grid container spacing={2}>
          
          {/* 1. 担当者 (幅を 3/12 に変更) */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="担当者"
              value={searchUser}
              onChange={event => onChange('searchUser', event.target.value)}
              fullWidth
              size="small"
              placeholder="山田 太郎"
              variant="outlined"
            />
          </Grid>

          {/* 2. 日付 (幅を 3/12 に変更) */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="日付"
              type="date"
              value={searchDate}
              onChange={event => onChange('searchDate', event.target.value)}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>

          {/* 3. 製品名 (幅を 3/12 に変更) */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="製品名"
              value={searchProduct}
              onChange={event => onChange('searchProduct', event.target.value)}
              fullWidth
              size="small"
              placeholder="製品A-102"
              variant="outlined"
            />
          </Grid>

          {/* 4. 並び替え (★ここに追加！) */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small" variant="outlined">
              <InputLabel>並び替え</InputLabel>
              <Select
                value={sortOrder}
                label="並び替え"
                onChange={(e) => onSortChange(e.target.value)}
              >
                <MenuItem value="date_desc">日付が新しい順</MenuItem>
                <MenuItem value="date_asc">日付が古い順</MenuItem>
              </Select>
            </FormControl>
          </Grid>

        </Grid>
      </CardContent>
    </Card>
  );
}