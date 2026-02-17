// 生産進捗カード: KPI達成率のドーナツグラフ表示

"use client";

// --- ▼ Reactフックを追加 ▼ ---
import { useEffect, useState } from "react";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Link from "@/components/Link";

const headerMinHeight = 80;

const ProductionProgressCard = () => {
  // --- ▼ Stateを定義 ▼ ---
  // APIの today_summary.actual と today_summary.plan を格納する
  const [production, setProduction] = useState({ actual: 0, plan: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- ▼ 日付フォーマット ▼ ---
  // 今日の日付を取得 (例: "11月6日")
  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat('ja-JP', { month: 'numeric', day: 'numeric' }).format(today);

  // --- ▼ APIからデータを取得 (useEffect) ▼ ---
  useEffect(() => {
    const fetchProgress = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/production/summary');
        if (!res.ok) {
          throw new Error('進捗データの取得に失敗しました');
        }
        const data = await res.json();
        
        // 取得した today_summary の値で state を更新
        setProduction({
          actual: data.today_summary.actual,
          plan: data.today_summary.plan
        });
      } catch (err) {
        console.error(err);
        setError(err.message);
        setProduction({ actual: 0, plan: 0 }); // エラー時はリセット
      } finally {
        setIsLoading(false);
      }
    };
    fetchProgress();
  }, []); // [] = ページ読み込み時に1回だけ実行

  // --- ▼ 達成率を State から計算 ▼ ---
  const kpiAchieve = (production.plan > 0)
    ? Math.round((production.actual / production.plan) * 100)
    : 0; // 目標が0の場合は0%とする (0除算エラー回避)


  // --- ▼ ローディング・エラー・成功時で表示を分ける ▼ ---
  const renderContent = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120 }}>
          <Typography>読み込み中...</Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120 }}>
          <Typography color="error" variant="body2">{error}</Typography>
        </Box>
      );
    }

    // データ取得成功時の表示 (元のJSX)
    return (
      <Box display="flex" alignItems="center" justifyContent="center" gap={2.5}>
        <Box position="relative" width={120} height={120}>
          <svg viewBox="0 0 36 36" width="120" height="120">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="var(--mui-palette-action-disabledBackground)"
              strokeWidth="3"
            />
            <path
              strokeDasharray={`${kpiAchieve}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="var(--mui-palette-primary-main)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
            <Typography variant="h5" fontWeight={700}>{kpiAchieve}%</Typography>
            <Typography variant="caption">達成率</Typography>
          </Box>
        </Box>
        <Box>
          {/* Stateの値を使うように変更 */}
          <Typography variant="body1">現在: <Typography component="span" fontWeight={700} color="primary.main">{production.actual.toLocaleString()}</Typography> 個</Typography>
          <Typography variant="body1">目標: {production.plan.toLocaleString()} 個</Typography>
        </Box>
      </Box>
    );
  };
  
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea component={Link} href="/production-management" sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        {/* --- ▼ CardHeader に subheader を追加 ▼ --- */}
        <CardHeader
          title="生産進捗"
          subheader={`${formattedDate} (本日)`}
          action={<TrendingUpIcon color="primary" />}
          sx={{ minHeight: headerMinHeight }}
        />
        {/* --- ▲ CardHeader に subheader を追加 ▲ --- */}
        
        <CardContent>
          {renderContent()}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProductionProgressCard;