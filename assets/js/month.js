//Highcharts.setOptions({
 //      colors: ['#fee0b6','#e66101','#998ec3','#5e3c99']
 //   });

$(function () {
    $('#month').highcharts({
        chart: {
            type: 'column'
        },
         credits: {
      enabled: false
  },
        title: {
            align: 'left',
            x: 15,
            text: 'Monthly Count Information by Direction'
        },
         xAxis: {
          //  categories: ['August','July','June','May','April','March','February','January','December','November','October','September']
            categories: ['September','October','November','December','January','February','March','April','May','June','July','August']
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total Counts'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            }
        },
        legend: {
            align: 'right',
            x: -5,
            verticalAlign: 'top',
          //  y: 5,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.x + '</b><br/>' +
                    this.series.name + ': ' + this.y + '<br/>' +
                    'Total: ' + this.point.stackTotal;
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: false,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {
                        textShadow: '0 0 3px black'
                    }
                }
            }
        },
        series: [{
            name: 'Bicycle (out)',
         //   data: [31417,30453,26470,32840,20341,6873,2620,3466,6422,9917,19253,26043]
              data: [26043,19253,9917,6422,3466,2620,6873,20341,32840,26470,30453,31417],
              zIndex: 4,
              color: '#fee0b6'
        }, {
            name: 'Bicycle (in)',
            data:[26357,18319,8719,5336,2968,2140,6104,20768,34215,27459,31831,34289],
            zIndex: 3,
            color: '#e66101'
        //    data:[34289,31831,27459,34215,20768,6104,2140,2968,5336,8719,18319,26357]
      }, {
            name: 'Pedestrian (out)',
            data:[13277,12098,7660,4201,3958,4071,8931,14126,11462,8270,9974,9942],
            zIndex: 2,
            color: '#998ec3'
        //    data:[9942,9974,8270,11462,14126,8931,4071,3958,4201,7660,12098,13277]
                  }, {
            name: 'Pedestrian (in)',
            data:[13708,12502,7581,4003,3702,4241,9444,14589,11924,9041,10374,11699],
            zIndex: 1,
            color: '#5e3c99'
        //    data:[11699,10374,9041,11924,14589,9444,4241,3702,4003,7581,12502,13708]
        }]
    });
});