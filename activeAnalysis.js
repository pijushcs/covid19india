function activeAnalysis() {
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

        var index = labels.indexOf("Andaman and Nicobar Islands");
        if (index !== -1) {
            labels[index] = "A & N Islands";
        }

        curChart = new Chart(ctx, {
            type: 'horizontalBar',
            options: {
              title: {
                display: true,
                text: 'Statewise Status Comparison'
              }
            },
            data: {
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