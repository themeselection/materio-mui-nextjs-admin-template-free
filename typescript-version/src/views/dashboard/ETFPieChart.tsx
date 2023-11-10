import React from 'react';
import { ApexOptions } from 'apexcharts';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import DotsVertical from 'mdi-material-ui/DotsVertical';
import ReactApexcharts from 'src/@core/components/react-apexcharts';

interface ETFPieChartProps {
  series: number[];
  labels: string[];
}

const ETFPieChart: React.FC<ETFPieChartProps> = ({ series, labels }) => {
  const theme = useTheme();

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 3; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const getRandomValues = (length: number) => {
    const values = [];
    for (let i = 0; i < length; i++) {
      values.push(Math.floor(Math.random() * 100));
    }
    return values;
  };

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
        },
      },
    },
    stroke: {
      width: 2,
      colors: [theme.palette.background.paper],
    },
    legend: { show: false },
    colors: ['#FF0000', '#008000', '#FFA500'],
    dataLabels: { enabled: true },
    states: {
      hover: {
        filter: { type: 'none' },
      },
      active: {
        filter: { type: 'none' },
      },
    },
  };

  if (series === undefined) {
    series = getRandomValues(3);
  }

  if (labels === undefined) {
    labels = ['Cash', 'Equity', 'Commodities'];
  }

  return (
    <Card>
      <CardHeader
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' },
        }}
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
      />
      <CardContent sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }}>
        <ReactApexcharts type='donut' height={205} options={options} series={series} labels={labels} />
        <Box sx={{ mb: 7, display: 'flex', alignItems: 'center' }}>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ETFPieChart;