function factorial(n){
  var f = 1;
  if (n == 0 || n==1) {return 1;}
  else{
    for (var i = 1; i<n+1 ; i++){
      f = i*f;
    }
    return f;

  }
}

function combinaties(n,k){
  return factorial(n)/(factorial(k)*factorial(n-k));
}

var maxi = []; 
var MAX = [];
var mu = [];
var sigma = [];
var normarray = [];

function binompdf(n, p) {
  var binomdata = [];
  var labelbinom = [];
  for (var i = 0; i < n+1; i++) {
    var binomdum = combinaties(n,i)*Math.pow(p,i)*Math.pow(1-p,n-i);
    binomdata.push(binomdum);
    labelbinom.push(i);    
  }
  var arraytest = [binomdata , labelbinom] ;
  return arraytest;
}


function normpdf(n, p) {
  var normdata = [];
  var labelnorm = [];
  var normarray = [];
  for (var i = 0; i < 10*n+1; i++) {
    labelnorm.push(i/10);
  }
  var mu = n*p;
  var sigma = Math.sqrt(n*p*(1-p));
  for (var i = 0; i < 10*n+1; i++) {
    var normdum = (1/(sigma*Math.sqrt(2*Math.PI)))*Math.exp(-0.5*Math.pow(((labelnorm[i]-mu)/sigma),2))
    normdata.push(normdum);       
  }
  for (var i = 0; i < 10*n+1; i++) {
    normarray.push({'x': labelnorm[i]+0.5, 'y': normdata[i]});    
  }
  var arraytest = [normdata , labelnorm] ;
  return normarray;
}

var slidern = document.getElementById("nrange");
var outputn = document.getElementById("demo");
slidern.step = "2";
outputn.innerHTML = "n = " +  slidern.value.toString(); // Display the default slider value

var sliderp = document.getElementById("prange");
var outputp = document.getElementById("demo2");
sliderp.step = "5";
outputp.innerHTML = "p = " + ((sliderp.value)/100).toFixed(2).toString(); // Display the default slider value


var ctx = document.getElementById('mijnGrafiek');

var N = (slidern.value)*1;
var P = (sliderp.value)/100;
var binomdata = binompdf(N,P);
var normdata = normpdf(N,P);
var mu = (N*P).toFixed(2);
var sigma = (Math.pow(N*P*(1-P),0.5)).toFixed(3);
var maxi = [];
for (var i = 0; i < binomdata[0].length; i++) {
  maxi.push(binomdata[0][i]);
}
for (var i = 0; i < normdata.length; i++) {
  maxi.push(normdata[i].y);
}
var MAX =  1.1*Math.max(...maxi);

var myChart = new Chart(ctx, {
  type:'bar',
  data: {
    labels: binomdata[1],
    datasets: [{  
      label: 'Binomiaal verdeling, n = ' + N.toString() + ' , p = ' + P.toFixed(2).toString(),
      data: binomdata[0],
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
      order:1
  },{
    label: 'Normaal verdeling, μ = ' + mu.toString() + ' , σ = ' + sigma.toString(),
    data: normdata,
    type: 'line',
    xAxisID: 'normx',
    yAxisID: 'normy',
    borderColor: 'rgba(255, 99, 132, 1)',
    borderWidth: 3,
    pointRadius: 0,
    fill: 'false',
  order:2}]
  },
  options: {
    
    scales: {
      xAxes: [{
        display: true,
        stacked: true,
        scaleLabel: {
          display: true,
          labelString: 'x'
        },
      }, {
        id: 'normx',
        type: 'linear',
        display: false,
        stacked: false,
        scaleLabel: {
          display: false,
          labelString: 'x'
        },
        ticks: {
          beginAtZero: true,
          stepSize: 1,
//          suggestedMax: 100
        }
      }],
      yAxes: [{
        display: true,
        stacked: true,
        scaleLabel: {
          display: true,
          labelString: 'Kans'
        },
        ticks: {
          beginAtZero: true,
          min: 0,
          max: MAX,
          stepsize: 0.1 
        }
      }, {
        id: 'normy',
        display: false,
        stacked: false,
        scaleLabel: {
          display: false,
          labelString: 'Kans'
        },
        ticks: {
          beginAtZero: true,
          min: 0,
          max: MAX,
          stepsize: 0.1
        }
      }]
    },
    
  }
});

function drawchart(N,P){
  var ctx = document.getElementById('mijnGrafiek');
  var slidern = document.getElementById("nrange");
  //var outputn = document.getElementById("demo");
  outputn.innerHTML = "n = " +  N.toString(); // Display the default slider value
  var sliderp = document.getElementById("prange");
  //var outputp = document.getElementById("demo2");
  outputp.innerHTML = "p = " + P.toFixed(2).toString(); // Display the default slider value
  var binomdata = binompdf(N,P);
  var normdata = normpdf(N,P);
  var mu = (N*P).toFixed(2);
  var sigma = (Math.pow(N*P*(1-P),0.5)).toFixed(3);
  var maxi = [];
  for (var i = 0; i < binomdata[0].length; i++) {
    maxi.push(binomdata[0][i]);
  }
  for (var i = 0; i < normdata.length; i++) {
    maxi.push(normdata[i].y);
  }
  var MAX =  1.1*Math.max(...maxi);
  myChart.data.datasets[0].data = binomdata[0] ;
  myChart.data.datasets[1].data = normdata ;
  myChart.data.labels = binomdata[1] ;
  myChart.data.datasets[0].label = 'Binomiaal verdeling, n = ' + N.toString() + ' , p = ' + P.toFixed(2).toString();
  myChart.data.datasets[1].label = 'Normaal verdeling, μ = ' + mu.toString() + ' , σ = ' + sigma.toString(); 
  myChart.options.scales.yAxes[0].ticks.max = MAX;
  myChart.options.scales.yAxes[1].ticks.max = MAX;
  myChart.update(); 
} 




// Update the current slider value (each time you drag the slider handle)
sliderp.oninput = function() {
  var N = (slidern.value)*1;
  var P = (this.value)/100;
  drawchart(N,P)
}

// Update the current slider value (each time you drag the slider handle)
slidern.oninput = function() {
  var N = (this.value)*1;
  var P = (sliderp.value)/100;
  drawchart(N,P)
}

