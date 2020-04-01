function ageAnalysis() {
    fetch('https://api.rootnet.in/covid19-in/unofficial/covid19india.org')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
        ageAnalysisData(data.data.rawPatientData);
        plotTotalAgeChart();
        plotStateAgeChart();
    });
};

function plotTotalAgeChart() {
    var canvas = document.getElementById('covid19-summary');
    var ctx = canvas.getContext('2d');
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(summaryChart) summaryChart.destroy();
    
    summaryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["0-10", "10-20", "20-30", "30-40", "40-50","50-60", "60-70", "70-80", "80-90", "90-100"],
            datasets: [
                { label: "Total", backgroundColor: getRandomColor(), data: totalCases},
                { label: "Active", backgroundColor: getRandomColor(), data: totalActive},
                { label: "Recovered", backgroundColor: getRandomColor(), data: totalRecovered},
                { label: "Deaths", backgroundColor: getRandomColor(), data: totalDeath}
            ]
        },
        options: {
            title: {
              display: true,
              text: 'Stats based on Age (Grouped)'
            }
        }
    });
}

function plotStateAgeChart() {
    var canvas = document.getElementById('covid19-plot');
    var ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(curChart) curChart.destroy();

    curChart = new Chart(ctx, {
        type: 'horizontalBar',
        options: {
            title: {
                display: true,
                text: 'Age Group Infected Statewise',
                position: 'top'
            }
        },
        data: {
            labels: alabels,
            datasets:[
                { label: "Min Age", backgroundColor: getRandomColor(), data: minData},
                { label: "Average Age", backgroundColor: getRandomColor(), data: avgData},
                { label: "Max Age", backgroundColor: getRandomColor(), data: maxData}
            ]
        }
    });
}

var alabels, minData, maxData, avgData;
function ageAnalysisData(data) {
    labels = [], totalCases = [0,0,0,0,0,0,0,0,0,0], totalActive = [0,0,0,0,0,0,0,0,0,0];
    totalRecovered = [0,0,0,0,0,0,0,0,0,0], totalDeath = [0,0,0,0,0,0,0,0,0,0];
    stateSum = [], stateAgeMin = [], stateAgeMax = [], stateSum = [], stateAgeSum = [];

    alabels = [], minData = [], maxData = [], avgData = [];

    for(var pcur=0; pcur < data.length; pcur++) {
        var curPatient = data[pcur];

        if(!curPatient.ageEstimate) continue;

        if(stateAgeMin[curPatient.state]) stateAgeMin[curPatient.state] = Math.min(stateAgeMin[curPatient.state], curPatient.ageEstimate);
        else stateAgeMin[curPatient.state] = curPatient.ageEstimate;

        if(stateAgeMax[curPatient.state]) stateAgeMax[curPatient.state] = Math.max(stateAgeMax[curPatient.state], curPatient.ageEstimate);
        else stateAgeMax[curPatient.state] = curPatient.ageEstimate;

        if(stateAgeSum[curPatient.state]) {
            stateAgeSum[curPatient.state] += parseInt(curPatient.ageEstimate);
            stateSum[curPatient.state]++;
        }
        else {
            stateAgeSum[curPatient.state]=parseInt(curPatient.ageEstimate);
            stateSum[curPatient.state]=parseInt(1);
        }

        var curIndex = parseInt(curPatient.ageEstimate/10);

        totalCases[curIndex]++;
        if(curPatient.status == 'Recovered') totalRecovered[curIndex]++;
        if(curPatient.status == 'Deceased') totalDeath[curIndex]++;
        if(curPatient.status == 'Hospitalized') totalActive[curIndex]++;
    }

    const keys = Object.keys(stateSum);
    for (const key of keys) {
        if(stateSum[key] >= 20) {
            alabels.push(key);
            minData.push(stateAgeMin[key]);
            maxData.push(stateAgeMax[key]);
            avgData.push(parseInt(stateAgeSum[key]/stateSum[key])); 
        }
    }

}