import Chart from 'chart.js/auto';
import React from 'react'
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>


export default function chart_etatTache() {

    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

  return (
    <canvas id="myChart"></canvas>
)
}
