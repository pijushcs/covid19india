function hospitalAnalysis() {
    fetch('https://api.rootnet.in/covid19-in/unofficial/covid19india.org/statewise')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
  
        createData(data.data.statewise);
        
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
          generateSimulation(data.data.total, hdata.data.summary);
          generateHospitalData(hdata.data.regional);

          var index = hlabels.indexOf("Andaman & Nicobar Islands");
          if (index !== -1) {
              hlabels[index] = "A & N Islands";
          }

          curChart = new Chart(ctx, {
              type: 'horizontalBar',
              options: {
                title: {
                  display: true,
                  text: 'Statewise Status Comparison',
                  position: 'top'
                }
              },
              data: {
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