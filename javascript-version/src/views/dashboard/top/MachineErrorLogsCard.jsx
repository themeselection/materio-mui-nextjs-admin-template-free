// 機械エラーログカード: 直近のエラー・警告・情報をリスト表示

"use client";

// --- ▼ Reactフックを追加 ▼ ---
import { useEffect, useState } from "react";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

import HardwareIcon from "@mui/icons-material/Hardware";
import Link from "@/components/Link";

const headerMinHeight = 80;

// --- ▼ タイムスタンプをフォーマットする関数 ▼ ---
// (例: "2025-07-15T10:15:32Z" -> "2025-07-15 10:15")
const formatTimestamp = (isoString) => {
  if (!isoString) return "時刻不明";
  try {
    const date = new Date(isoString);
    // ja-JPロケール、日本時間（JST）で "YYYY-MM-DD HH:mm" 形式に
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Tokyo' // タイムゾーンをJSTに指定
    }).format(date).replace(/\//g, '-'); // スラッシュをハイフンに置換
  } catch (error) {
    console.error("Timestamp format error:", error);
    return isoString; // エラー時は元の文字列を返す
  }
};


const MachineErrorLogsCard = () => {
  // --- ▼ Stateを定義 ▼ ---
  // APIから取得したログ (data.logs) を格納する
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- ▼ APIからデータを取得 (useEffect) ▼ ---
  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 機械名 "半自動表層バネどめ機" をURLに含め、limit=3 を指定
        const res = await fetch('/api/machines/半自動表層バネどめ機/logs?limit=3');

        if (!res.ok) {
          throw new Error('エラーログの取得に失敗しました');
        }
        const data = await res.json();
        
        // 取得した data.logs で state を更新
        setLogs(data.logs || []);

      } catch (err) {
        console.error(err);
        setError(err.message);
        setLogs([]); // エラー時は空にする
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []); // [] = ページ読み込み時に1回だけ実行


  // --- ▼ ローディング・エラー・成功時で表示を分ける ▼ ---
  const renderContent = () => {
    if (isLoading) {
      return <Typography sx={{ p: 2, textAlign: 'center' }}>読み込み中...</Typography>;
    }

    if (error) {
      return <Typography color="error" sx={{ p: 2, textAlign: 'center' }}>{error}</Typography>;
    }
    
    if (logs.length === 0) {
      return <Typography sx={{ p: 2, textAlign: 'center' }}>直近のエラーログはありません</Typography>;
    }

    // データ取得成功時の表示
    return (
      <Stack spacing={1.5}>
        {logs.map(log => (
          <Box key={log.log_id} display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="caption" color="text.disabled">
                {formatTimestamp(log.timestamp)} {/* ★フォーマット関数適用 */}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {log.title} {/* ★APIの "title" を表示 */}
              </Typography>
            </Box>
            
            {/* ★APIの "log_type" に合わせてChipを表示 */}
            {log.log_type === 'error' && <Chip label="重大" color="error" size="small" />}
            {log.log_type === 'warning' && <Chip label="警告" color="warning" size="small" />}
            {log.log_type === 'info' && <Chip label="情報" color="info" size="small" />}
          </Box>
        ))}
      </Stack>
    );
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea component={Link} href="/machine-status" sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <CardHeader title="半自動表層バネどめ機｜直近エラーログ" action={<HardwareIcon color="action" />} sx={{ minHeight: headerMinHeight }} />
        {/* --- ▼ CardContent の中身を `renderContent()` に置き換え ▼ --- */}
        <CardContent sx={{ flexGrow: 1 }}>
          {renderContent()}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MachineErrorLogsCard;