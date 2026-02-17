// クイックリンク行: 3つのショートカットカードを横並びで表示

"use client";

import Grid from "@mui/material/Grid";

import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

import QuickLinkCard from "./QuickLinkCard";

const QuickLinksRow = () => {
  return (
    <>
      <Grid item xs={12} sm={4} md={2} lg={2}>
        <QuickLinkCard
          href="/shipping-instructions"
          color="warning.main"
          icon={<ListAltOutlinedIcon sx={{ fontSize: 36 }} />}
          label="製造出荷指示周知"
        />
      </Grid>
      <Grid item xs={12} sm={4} md={2} lg={2}>
        <QuickLinkCard
          href="/daily-reports"
          color="info.main"
          icon={<CreateOutlinedIcon sx={{ fontSize: 36 }} />}
          label="日報一覧"
        />
      </Grid>
      <Grid item xs={12} sm={4} md={2} lg={2}>
        <QuickLinkCard
          href="/parts-inventory"
          color="success.main"
          icon={<Inventory2OutlinedIcon sx={{ fontSize: 36 }} />}
          label="部品在庫管理"
        />
      </Grid>
    </>
  );
};

export default QuickLinksRow;
