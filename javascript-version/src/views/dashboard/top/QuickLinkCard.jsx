// クイックリンクカード: ダッシュボード上部のショートカットボタン用

"use client";

import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Link from "@/components/Link";

const QuickLinkCard = ({ href, color, icon, label }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea component={Link} href={href} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5, py: 3 }}>
          <Box sx={{ bgcolor: color, color: 'common.white', width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, textAlign: 'center' }}>{label}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default QuickLinkCard;
