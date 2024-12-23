import { Chart, registerables } from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

const FeelingPatternChart = ({ events }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    if (!events || events.length === 0) return;

    // Group events by day and count each feeling type
    const feelingsByDay = events.reduce((acc, event) => {
      const day = new Date(event.start).toDateString();
      if (!acc[day]) {
        acc[day] = { happy: 0, sad: 0, neutral: 0 };
      }
      acc[day][event.feeling]++;
      return acc;
    }, {});

    // Find the day with the maximum count for each feeling
    const labels = Object.keys(feelingsByDay);
    const data = labels.map(day => {
      const feelings = feelingsByDay[day];
      const maxFeeling = Object.keys(feelings).reduce((a, b) => feelings[a] > feelings[b] ? a : b); // Find most frequent feeling
      return {
        day,
        feeling: maxFeeling,
        count: feelings[maxFeeling] // Highest count for that day
      };
    });

    const feelingCounts = {
      Happy: data.filter(item => item.feeling === 'happy').map(item => item.count),
      Sad: data.filter(item => item.feeling === 'sad').map(item => item.count),
      Neutral: data.filter(item => item.feeling === 'neutral').map(item => item.count),
    };

    // Chart.js configuration
    const ctx = document.getElementById('feelingPatternChart')?.getContext('2d');
    if (ctx) {
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(item => item.day),
          datasets: [
            {
              label: 'Happy',
              data: feelingCounts.Happy,
              borderColor: '#FF6384',
              fill: false,
            },
            {
              label: 'Sad',
              data: feelingCounts.Sad,
              borderColor: '#36A2EB',
              fill: false,
            },
            {
              label: 'Neutral',
              data: feelingCounts.Neutral,
              borderColor: '#FFCE56',
              fill: false,
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
              text: 'Feeling Patterns by Day',
            },
          },
        },
      });
    }
  }, [events]);

  return (
    <Box sx={{ width: '80%', height: '80%', margin: 'auto', padding: 4 }}>
      <canvas id="feelingPatternChart" width="400" height="400"></canvas>
    </Box>
  );
};

export default FeelingPatternChart;
