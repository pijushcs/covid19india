var totalCases, totalActive, totalRecovered, totalDeath, stateAgeMin, stateAgeMax, stateAgeSum, stateMetrics, stateSum;
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
    if(regionals[curRegion].confirmed == 0) continue;

    labels.push(regionals[curRegion].state);
    confirmedTotal.push(regionals[curRegion].confirmed);
    
    dischargedTotal.push(regionals[curRegion].recovered);
    deathsTotal.push(regionals[curRegion].deaths)
    
    currentActive.push(confirmedTotal[curRegion] - (regionals[curRegion].recovered + regionals[curRegion].deaths))
    locToActiveMap[regionals[curRegion].state] = currentActive[curRegion];
    colors.push(getRandomColor());
  }
}

var hlabels, totalHospitals, totalBeds;
function generateHospitalData(regionals) {
  hlabels = [], totalHospitals = [], totalBeds = [];
  
  for(var curRegion=0; curRegion < regionals.length; curRegion++) {
    if(regionals[curRegion].state == "INDIA") continue;
    if(regionals[curRegion].totalHospitals < 20) continue;
    hlabels.push(regionals[curRegion].state);
    totalBeds.push(regionals[curRegion].totalBeds);
    totalHospitals.push(regionals[curRegion].totalHospitals);
  }
}

function generateSimulation(summaryRegional, summaryHospital) {
  var curCount = summaryRegional.active;
  var simTotal = [], totalBeds = [], simLabel = [], curDay = 1;

  while(curCount < (summaryHospital.totalBeds + 100000)) {
    simLabel.push('Day '+curDay);
    simTotal.push(curCount);
    totalBeds.push(summaryHospital.totalBeds);

    var randomRT = Math.random() + 1.5;
    curCount = parseInt(curCount * (randomRT > 1.8 ? 1.8 : randomRT));
    curDay += 2;
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
                    label: "Total Infected (Simulation without lockdown)",
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
