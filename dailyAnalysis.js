function dailyAnalysis() {
    fetch('https://api.rootnet.in/covid19-in/unofficial/covid19india.org/statewise/history')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
        dailyTotalData(data.data.history);
        plotTotalChart();
        plotStateChart();
    });
};

function plotTotalChart() {
    var canvas = document.getElementById('covid19-summary');
    var ctx = canvas.getContext('2d');
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(summaryChart) summaryChart.destroy();
    
    summaryChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: "Total", borderColor: getRandomColor(), data: totalCases, fill: false},
                { label: "Active", borderColor: getRandomColor(), data: totalActive, fill: false },
                { label: "Recovered", borderColor: getRandomColor(), data: totalRecovered, fill: false },
                { label: "Deaths", borderColor: getRandomColor(), data: totalDeath, fill: false }
            ]
        },
        options: {
            title: {
              display: true,
              text: 'Daily Analysis'
            }
        }
    });
}

function plotStateChart() {
    var datasets = [];

    const keys = Object.keys(stateMetrics)
    for (const key of keys) {
        console.log(key, stateSum[key]);
        if(stateSum[key] >= 25) datasets.push({ label: key, borderColor: getRandomColor(), data: stateMetrics[key], fill: false }) 
    }

    var canvas = document.getElementById('covid19-plot');
    var ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(curChart) curChart.destroy();

    console.log(datasets);

    curChart = new Chart(ctx, {
        type: 'line',
        options: {
            title: {
                display: true,
                text: 'Statewise Daily Analysis (with > 25 cases)',
                position: 'top'
            }
        },
        data: {
            labels: labels,
            datasets: datasets
        }
    });
}

function dailyTotalData(history) {
    labels = [], totalCases = [], totalActive = [], totalRecovered = [], totalDeath = [];
    stateMetrics = [], stateSum = [];
    for(var curDay=0; curDay < history.length; curDay++) {
        var curStat = history[curDay];
        labels.push(curStat.day.slice(5));

        totalCases.push(curStat.total.confirmed);
        totalActive.push(curStat.total.active);
        totalRecovered.push(curStat.total.recovered);
        totalDeath.push(curStat.total.deaths);

        var stateHistory = curStat.statewise;
        for(var scur=0; scur < stateHistory.length; scur++) {
            curStateStat = stateHistory[scur];
            if(!stateMetrics[curStateStat.state]) {
                stateMetrics[curStateStat.state] = []; 
                stateSum[curStateStat.state] = 0;
            }
            stateMetrics[curStateStat.state].push(curStateStat.confirmed);
            stateSum[curStateStat.state]=curStateStat.confirmed;
        }
    }
}