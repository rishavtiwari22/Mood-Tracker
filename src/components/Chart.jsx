import { Chart } from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

const FeelingsChart = ({ events }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy(); 
    }

    const feelingsCount = events.reduce((acc, event) => {
      acc[event.feeling] = (acc[event.feeling] || 0) + 1;
      return acc;
    }, {});

    const totalCount = Object.values(feelingsCount).reduce((sum, count) => sum + count, 0);

    const labels = Object.keys(feelingsCount).map(feeling => `${feeling} (${((feelingsCount[feeling] / totalCount) * 100).toFixed(2)}%)`);
    const data = Object.values(feelingsCount);

    const ctx = document.getElementById('feelingsChart')?.getContext('2d');
    if (ctx) {
      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Feelings Count',
              data,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'], // Customize colors
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Feelings Distribution for Last Month',
            },
          },
        },
      });
    }
  }, [events]);

  return (
    <Box sx={{ width: '40%', height: '80%', margin: 'auto', padding: 4 }}>
      <canvas id="feelingsChart" width="50" height="50"></canvas>
    </Box>
  );
};

export default FeelingsChart;
