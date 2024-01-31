// ** MUI Imports
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

// ** Component Import
import ReactApexcharts from 'src/@core/components/react-apexcharts';

const areaColors = {
  series2: '#60B566',
  series3: '#259FCA'
};

const SalesChart = () => {
  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: false,
      colors: [areaColors.series3, areaColors.series2]
    },
    markers: {
      size: 5,
      colors: [areaColors.series3, areaColors.series2],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 5
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left'
    },
    grid: {
      show: true,
      xaxis: {
        lines: {
          show: false
        }
      }
    },
    colors: [areaColors.series3, areaColors.series2],
    xaxis: {
      categories: [
        'Jan',
        'Feb',
        'March',
        'April',
        'May',
        'June',
        'July',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ],
      labels: {
        style: {
          colors: ['#8B8BA7'],
          fontSize: '15px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: ['#8B8BA7'],
          fontSize: '15px' //
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5,
        columnWidth: '40%',
        endingShape: 'rounded'
      }
    },
    fill: {
      opacity: 1
    }
  };

  const series = [
    {
      name: 'Income',
      data: [100, 120, 90, 170, 130, 160, 140, 240, 220, 180, 270, 280]
    },
    {
      name: 'Expense',
      data: [60, 80, 70, 110, 80, 100, 90, 180, 160, 140, 200, 220]
    }
  ];

  return (
    <Card>
      <CardHeader
        title="Plan/Package Sales"
        titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }}
        subheaderTypographyProps={{ variant: 'caption', sx: { color: 'text.disabled' } }}
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}
      />
      <CardContent>
        <ReactApexcharts options={options} series={series} type="bar" height={400} />
      </CardContent>
    </Card>
  );
};

export default SalesChart;
