var curChart;
function stateAnalysis() {
  fetch('https://api.rootnet.in/covid19-in/unofficial/covid19india.org/statewise')
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    createData(data.data.statewise);
    generateSummaryData(data.data.total);

    var canvas = document.getElementById('covid19-plot');
    var ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(curChart) curChart.destroy();

    curChart = new Chart(ctx, {
      type: 'doughnut',
      options: {
        title: {
          display: true,
          text: 'Statewise Total Cases (Active + Recovered/Deceases)'
        }
      },
      data: {
          labels: labels,
          datasets: [ { backgroundColor: colors, data: confirmedTotal } ]
      }
    });
  });
};