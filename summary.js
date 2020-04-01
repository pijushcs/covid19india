var summaryChart;
function generateSummaryData(summary) {
  var canvas = document.getElementById('covid19-summary');
  var ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if(summaryChart) summaryChart.destroy();

  summaryChart = new Chart(ctx, {
    type: 'polarArea',
    options: {
      title: {
        display: true,
        text: 'Summary'
      },
      legend: {
        display: true,
        position: "left"
      }
    },
    data: {
      labels: ['Total Cases', 'Discharged', 'Deaths'],
      datasets: [ { backgroundColor: [getRandomColor(), getRandomColor(), getRandomColor()], 
                    data: [summary.confirmed, summary.recovered, summary.deaths] }]
    }
});
}