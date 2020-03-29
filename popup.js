'use strict';

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

var labels, confirmedTotal, dischargedTotal, deathsTotal, colors, currentActive, locToActiveMap;
function createData(regionals) {
  labels = [], confirmedTotal = [], dischargedTotal = [], deathsTotal = [], colors = [], currentActive = [], locToActiveMap = [];
  
  for(var curRegion=0; curRegion < regionals.length; curRegion++) {
    labels.push(regionals[curRegion].loc);
    confirmedTotal.push(regionals[curRegion].confirmedCasesForeign + regionals[curRegion].confirmedCasesIndian);
    
    dischargedTotal.push(regionals[curRegion].discharged);
    deathsTotal.push(regionals[curRegion].deaths)
    
    currentActive.push(confirmedTotal[curRegion] - (regionals[curRegion].discharged + regionals[curRegion].deaths))
    locToActiveMap[regionals[curRegion].loc] = currentActive[curRegion];
    colors.push(getRandomColor());
  }
}

var hlabels, totalHospitals, totalBeds;
function generateHospitalData(regionals) {
  hlabels = [], totalHospitals = [], totalBeds = [];
  
  for(var curRegion=0; curRegion < regionals.length; curRegion++) {
    if(regionals[curRegion].state == "INDIA") continue;
    hlabels.push(regionals[curRegion].state);
    totalBeds.push(regionals[curRegion].totalBeds);
    totalHospitals.push(regionals[curRegion].totalHospitals);
  }
}

function generateSimulation(summaryRegional, summaryHospital) {
  var curCount = summaryRegional.total - (summaryRegional.discharged, summaryRegional.deaths);
  var simTotal = [], totalBeds = [], simLabel = [], curDay = 1;

  while(curCount < (summaryHospital.totalBeds + 100000)) {
    simLabel.push('Day '+curDay++);
    simTotal.push(curCount);
    totalBeds.push(summaryHospital.totalBeds);

    var randomRT = Math.random() + 1.5;
    curCount = parseInt(curCount * (randomRT > 1.8 ? 1.8 : randomRT));
  }

  simLabel.push('Day '+curDay++);
  simTotal.push(curCount);
  totalBeds.push(summaryHospital.totalBeds);

  var canvas = document.getElementById('covid19-summary');
  var ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if(summaryChart) summaryChart.destroy();

  summaryChart = new Chart(ctx, {
    type: 'line',
    options: {
      title: {
        display: true,
        text: 'Simulation: The reason for the lockdown (Day 1 is Today)'
      }
    },
    data: {
      labels: simLabel,
      datasets: [ 
                  { backgroundColor: getRandomColor(), 
                    label: "Total Simulated Infected (without lockdown)",
                    data: simTotal
                  },
                  { backgroundColor: getRandomColor(), 
                    label: "Total Hospital Beds (Private + Rural) in India",
                    data: totalBeds
                  }

                ]
    }
  });
}


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
                    data: [summary.total, summary.discharged, summary.deaths] }]
    }
});
}

var curChart;
confirmedCases.onclick = function(element) {
  fetch('https://api.rootnet.in/covid19-in/stats/latest')
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    createData(data.data.regional);
    generateSummaryData(data.data.summary);

    var canvas = document.getElementById('covid19-plot');
    var ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(curChart) curChart.destroy();

    curChart = new Chart(ctx, {
      type: 'doughnut',
      options: {
        title: {
          display: true,
          text: 'Statewise Total Cases (Active + Recovered/Dead)'
        }
      },
      data: {
          labels: labels,
          datasets: [ { backgroundColor: colors, data: confirmedTotal } ]
      }
    });
  });
};

activeDischarged.onclick = function(element) {
  fetch('https://api.rootnet.in/covid19-in/stats/latest')
  .then((response) => {
    return response.json();
  })
  .then((data) => {

      createData(data.data.regional);
      generateSummaryData(data.data.summary);
      
      var canvas = document.getElementById('covid19-plot');
      var ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if(curChart) curChart.destroy();
      curChart = new Chart(ctx, {
          type: 'horizontalBar',
          data: {
            options: {
              title: {
                display: true,
                text: 'Statewise Status Comparison'
              }
            },
            labels: labels,
              datasets: [
                { label: "Active", backgroundColor: getRandomColor(), data: currentActive },
                { label: "Recovered", backgroundColor: getRandomColor(), data: dischargedTotal },
                { label: "Deaths", backgroundColor: getRandomColor(), data: deathsTotal }
              ]
          }
      });
  });
};

hospitalStats.onclick = function(element) {
  fetch('https://api.rootnet.in/covid19-in/stats/latest')
  .then((response) => {
    return response.json();
  })
  .then((data) => {

      createData(data.data.regional);
      
      var canvas = document.getElementById('covid19-plot');
      var ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = 400
      if(curChart) curChart.destroy();

      fetch('https://api.rootnet.in/covid19-in/stats/hospitals')
      .then((hresponse) => {
        return hresponse.json();
      })
      .then((hdata) => {
        generateSimulation(data.data.summary, hdata.data.summary);
        generateHospitalData(hdata.data.regional);
        curChart = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                options: {
                  title: {
                    display: true,
                    text: 'Statewise Status Comparison',
                    position: 'top'
                  }
                },
                labels: hlabels,
                  datasets: [
                    { label: "Total Hospitals", backgroundColor: getRandomColor(), data: totalHospitals },
                    { label: "Total Beds", backgroundColor: getRandomColor(), data: totalBeds }
                  ]
            }
        });
      });
  });
};

