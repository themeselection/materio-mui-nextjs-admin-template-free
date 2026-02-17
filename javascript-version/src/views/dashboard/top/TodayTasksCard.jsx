// 本日のタスクカード: 当日対応すべき作業内容を表示

"use client";

// --- ▼ Reactフックを追加 ▼ ---
import { useEffect, useState } from "react";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import SurfaceBox from "@/components/surface/SurfaceBox";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

import Link from "@/components/Link";

// --- ▼ ヘルパー関数 (コンポーネントの外) ▼ ---

/**
 * Chipの色をライン名から決定
 * @param {string} lineName (例: "マット", "ボトム")
 * @returns {string} muiのcolor
 */
const getChipColor = (lineName) => {
  if (typeof lineName !== 'string') return 'default';
  if (lineName.includes('ボトム')) return 'warning';
  if (lineName.includes('マット')) return 'info';
  return 'default'; // フォールバック
};

/**
 * 備考欄の文字色を決定
 * @param {string} remarks (例: "至急対応")
 * @returns {string} muiのcolor
 */
const getRemarksColor = (remarks) => {
  if (typeof remarks === 'string' && remarks.includes('至急')) return 'error.main';
  return 'text.secondary';
};

/**
 * 今日の日付を "YYYY-MM-DD" 形式で取得
 * @returns {string}
 */
const getTodayDateString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // 月は0から始まるため+1
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};


const TodayTasksCard = () => {
  // --- ▼ Stateを定義 ▼ ---
  // APIから取得したタスクを格納
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- ▼ APIからデータを取得 (useEffect) ▼ ---
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      setError(null);
      
      const todayDate = getTodayDateString(); // "YYYY-MM-DD"
      
      try {
        // "本日" かつ "未完了" のタスクを取得
        const res = await fetch(`/api/instructions?date=${todayDate}&is_completed=false`);
        
        if (!res.ok) {
          throw new Error('タスクの取得に失敗しました');
        }
        
        const data = await res.json(); // APIは配列 ( [...] ) を返す
        
        // 1. created_at (作成日時) の古い順 (昇順) にソート
        const sortedData = data.sort((a, b) => {
            if (a.created_at < b.created_at) return -1;
            if (a.created_at > b.created_at) return 1;
            return 0;
        });

        // 2. 上位6件 (横3 x 縦2) を取得
        // ★変更点: 4 -> 6 に変更
        const topTasks = sortedData.slice(0, 6);

        setTasks(topTasks);

      } catch (err) {
        console.error(err);
        setError(err.message);
        setTasks([]); // エラー時は空にする
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []); // [] = ページ読み込み時に1回だけ実行


  // --- ▼ ローディング・エラー・成功時で表示を分ける ▼ ---
  const renderContent = () => {
    if (isLoading) {
      return (
        <Typography sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
          読み込み中...
        </Typography>
      );
    }

    if (error) {
      return (
        <Typography color="error" sx={{ p: 2, textAlign: 'center' }}>
          {error}
        </Typography>
      );
    }
    
    if (tasks.length === 0) {
      return (
        <Typography sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
          本日の未完了タスクはありません
        </Typography>
      );
    }

    // データ取得成功時の表示
    return (
      <Grid container spacing={2} alignItems="stretch">
        {tasks.map((task) => (
          // ★変更点: md={4} にすることで、1行に3つ (12 / 4 = 3) 並びます
          <Grid item xs={12} md={4} key={task.id}>
            <SurfaceBox
              p={2}
              borderRadius={2}
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              sx={{ height: '100%' }} // 高さを揃える
              variant="soft"
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Chip 
                    label={task.line} 
                    color={getChipColor(task.line)} 
                    size="small" 
                    sx={{ mb: 1, height: 24, fontSize: '0.75rem' }} 
                />
                <Typography variant="body2" fontWeight={700} lineHeight={1.3} noWrap title={task.product_name}>
                  {task.product_name} 
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" noWrap>
                    {task.size || '-'}
                </Typography>
                
                <Typography variant="caption" color={getRemarksColor(task.remarks)} fontWeight={600} mt={0.5} display="block" noWrap>
                  {task.remarks || '（特記なし）'}
                </Typography>
              </Box>
              
              <Box textAlign="right" sx={{ flexShrink: 0, ml: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: -0.5 }}>数量</Typography>
                <Typography variant="h5" color="primary.main" fontWeight={700}>
                  {task.quantity}
                </Typography>
              </Box>
            </SurfaceBox>
          </Grid>
        ))}
      </Grid>
    );
  };

  // 表示用の日付文字列を取得
  const todayStr = getTodayDateString();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea component={Link} href="/shipping-instructions" sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        {/* タイトルに日付を含める */}
        <CardHeader title={`本日のタスク (${todayStr})`} />
        
        <CardContent sx={{ flexGrow: 1 }}>
          {renderContent()}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default TodayTasksCard;