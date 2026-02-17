"use client";

// MUI Imports
import Grid from "@mui/material/Grid";

// View Components (top dashboard)
import NoticeCard from "@/views/dashboard/top/NoticeCard";
import QuickLinksRow from "@/views/dashboard/top/QuickLinksRow";
import ProductionProgressCard from "@/views/dashboard/top/ProductionProgressCard";
import MachineErrorLogsCard from "@/views/dashboard/top/MachineErrorLogsCard";
import ImageInspectionStatusCard from "@/views/dashboard/top/ImageInspectionStatusCard";
import TodayTasksCard from "@/views/dashboard/top/TodayTasksCard";
import AdminMenuCard from "@/views/dashboard/top/AdminMenuCard";

// ダッシュボード（Materio + MUI 構成）
const DashboardPage = () => {
  return (
    <Grid container spacing={6} sx={{ mt: 0 }}>
      {/* 今日のお知らせ + クイックボタン行（先頭） */}
      <Grid item xs={12}>
        <Grid container spacing={4} alignItems="stretch">
          {/* お知らせカード */}
          <Grid item xs={12} md={6} lg={6}>
            <NoticeCard />
          </Grid>

          {/* クイックリンク3枚 */}
          <QuickLinksRow />
        </Grid>
      </Grid>
      {/* KPIセクション */}
      <Grid item xs={12}>
        <Grid container spacing={4}>
          {/* 生産進捗 */}
          <Grid item xs={12} md={4}>
            <ProductionProgressCard />
          </Grid>

          {/* 機械稼働ステータス */}
          <Grid item xs={12} md={4}>
            <MachineErrorLogsCard />
          </Grid>

          {/* 画像検査ステータス */}
          <Grid item xs={12} md={4}>
            <ImageInspectionStatusCard />
          </Grid>
        </Grid>
      </Grid>



      {/* 生産目標/管理者メニュー */}
      <Grid item xs={12}>
        <Grid container spacing={4}>
          {/* 本日のタスク */}
          <Grid item xs={12} lg={8}>
            <TodayTasksCard />
          </Grid>

          {/* 管理者メニュー */}
          <Grid item xs={12} lg={4}>
            <AdminMenuCard />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DashboardPage;
