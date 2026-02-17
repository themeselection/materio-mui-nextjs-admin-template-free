/*
======== ファイル概要 ========
日報カードのリスト表示を担うグリッドレイアウトコンポーネントを提供する。
*/

import Grid from '@mui/material/Grid';
import ReportCard from './ReportCard';

// ★ currentUser, isAdmin を受け取る
/**
 * 日報カード群をグリッドレイアウトで描画するコンテナ。
 * @param {Array<object>} reports         - 表示する日報データ配列。
 * @param {Function} onDelete             - 削除要求を処理するハンドラー。
 * @param {Function} onViewDetail         - 詳細モーダルを開くハンドラー。
 * @param {Function} onEdit               - 編集モーダルを開くハンドラー。
 * @param {object} currentUser            - ログインユーザー情報。ReportCardへ透過。
 * @param {boolean} isAdmin               - 管理者権限の有無。
 * @returns {JSX.Element}                 - 日報カードを並べたグリッド。
 */
export default function ReportList({ reports, onDelete, onViewDetail, onEdit, currentUser, isAdmin }) {
  return (
    <Grid container spacing={3}>
      {reports.map((report) => (
        <Grid item xs={12} sm={6} md={4} key={report.id}>
          <ReportCard 
            report={report} 
            onDelete={onDelete}
            onViewDetail={onViewDetail}
            onEdit={onEdit}
            // ★ カードに渡す
            currentUser={currentUser}
            isAdmin={isAdmin}
          /> 
        </Grid>
      ))}
    </Grid>
  );
}