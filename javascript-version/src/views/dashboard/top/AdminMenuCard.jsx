// 管理者メニューカード: ダッシュボード右側の管理者向け操作ボタン

"use client";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import LiveTvOutlinedIcon from "@mui/icons-material/LiveTvOutlined";

import Link from "@/components/Link";

const AdminMenuCard = () => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader title="管理者メニュー" />
      <CardContent>
        <Stack spacing={2}>
          <Button
            component={Link}
            href="/employee-list"
            variant="outlined"
            color="inherit"
            startIcon={<GroupOutlinedIcon />}
            sx={{ justifyContent: 'flex-start' }}
          >
            従業員名簿の管理
          </Button>
          <Divider />
          <Button
            component={Link}
            href="/machine-status"
            variant="outlined"
            color="inherit"
            startIcon={<LiveTvOutlinedIcon />}
            sx={{ justifyContent: 'flex-start' }}
          >
            サイネージ用モニター
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AdminMenuCard;
