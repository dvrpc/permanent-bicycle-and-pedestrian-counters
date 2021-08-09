    var map, featureList;

     $(document).ready(function() {
      //OPEN ABOUT DIALOG
        $('#aboutModal').modal();
      });

    $(window).resize(function() {
        sizeLayerControl();
    });

    $(document).on("click", ".feature-row", function(e) {
        $(document).off("mouseout", ".feature-row", clearHighlight);
        sidebarClick(parseInt($(this).attr("id"), 10));
    });

    $(document).on("mouseover", ".feature-row", function(e) {
        highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
    });

    $(document).on("mouseout", ".feature-row", clearHighlight);

    function highlightRow(e){
    // reset rows
       $("tr").css('background-color', 'white');
    //    $("tr").css('color', 'black');
    // set colour of row raising the click event 
     //   $(this).css('background-color', '#00FFFF');
    //  CYAN
        // $(this).css('background-color','rgba(0, 255, 255, 0.6)');
        $(this).css('background-color','rgba( 255, 246, 136, 0.6)');
    //    $(this).css('color', 'white');
    }
    
    $(document).on("click", "tr", highlightRow);

    $("#about-btn").click(function() {
        $("#aboutModal").modal("show");
        $(".navbar-collapse.in").collapse("hide");
        return false;
    });

    $("#full-extent-btn").click(function() {
        map.fitBounds(stations.getBounds());
        $(".navbar-collapse.in").collapse("hide");
        return false;
    });

    $("#legend-btn").click(function() {
        $("#legendModal").modal("show");
        $(".navbar-collapse.in").collapse("hide");
        return false;
    });

    function printMonth(arr) {
        arr = arr.map(function (val) {
            return val === null ? '' : val;
        });
        var first = arr.slice(0, 1);
        var result = arr.slice(1).map(function (val) {
            return val.indexOf('Jan') === 0 ? val : val.split(' ')[0];
        });
        return first.concat(result);
    }

    function sizeLayerControl() {
        $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
    }

    function clearHighlight() {
        highlight.clearLayers();
    }

    function sidebarClick(id) {
        var layer = stations.getLayer(id);
        map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 12);
        layer.fire("click");
        /* Hide sidebar and go to the map on small screens */
        if (document.body.clientWidth <= 767) {
            $("#sidebar").hide();
            map.invalidateSize();
        }
    }

    /* Basemap Layers */
    var CartoDB_Positron = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        maxZoom: 18, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
      });

   var Mapbox_Imagery = L.tileLayer(
    'https://api.mapbox.com/styles/v1/crvanpollard/cimpi6q3l00geahm71yhzxjek/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY3J2YW5wb2xsYXJkIiwiYSI6Ii00ZklVS28ifQ.Ht4KwAM3ZUjo1dT2Erskgg', {
    tileSize: 512,
    zoomOffset: -1,
    attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
   /* Overlay Layers */
    $.getJSON('https://www.dvrpc.org/webmaps/PermBikePed/data/data.aspx', function(data) {
        stations.addData(data);
        map.addLayer(stationsLayer);

        var props = data.features[1].properties;

        $('.var-month1').text(props.MONTH1);
        $('.var-month1-year').text(props.MONTH1.split(' ')[1]);

    });

    var DVRPC = L.geoJson(null, {
        style: {
            stroke: true,
            fillColor: 'none',
            color: '#969696',
            weight: 3,
            fill: true,
            opacity: 1,
            fillOpacity: .70,
            clickable: false
        },
    });
    $.getJSON("https://arcgis.dvrpc.org/portal/rest/services/Boundaries/CountyBoundaries/FeatureServer/0/query?where=DVRPC_REG%3D%27Yes%27&outFields=STATE%2C+CO_NAME&outSR=4326&f=geojson", function(data) {
        DVRPC.addData(data);
    });

// The Circuit
    var circuit = L.geoJson(null, {
    style: function(feature) {
        switch (feature.properties.circuit) {
        case 'Existing': return {color: "#8dc63f", weight: 3, opacity: 1,};
        case 'Planned':   return {color: "#329aa7", weight: 3,opacity: 1,};
        case 'Pipeline':   return {color: "#AF46A4", weight: 3,opacity: 1,};
        case 'In Progress':   return {color: "#fdae61", weight: 3,opacity: 1,};
        }
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(feature.properties.main_trail +'<br><i>'+feature.properties.name+'</i>');
        },
    });
    $.getJSON("https://arcgis.dvrpc.org/portal/rest/services/Transportation/CircuitTrails/FeatureServer/0/query?where=1%3D1&outFields=*&geometryPrecision=5&outSR=4326&f=geojson", function(data) {
        circuit.addData(data);
    });

    function populatepie(e) {
        // resetHighlight();//  lsoaLayer.setStyle({fillColor: "#396ab2"});
        var layer = e.target;
        // layer.setStyle({fillColor: "#312867"});
        var props = layer.feature.properties,
        bikepeddata = [props.TT_BIKE, props.TT_PED];
        updatepie(bikepeddata);
    }

    var highlight = L.geoJson(null,{
        onEachFeature: function(feature, layer) { 
            if (feature.properties) {
                layer.bindLabel(feature.properties.LOCATIONNAME, {
                    className: 'leaflet-label'
                });
            }
        },
    });
    
    var highlightStyle = {
        stroke: false,
        fillColor: "#FFDA00",
        fillOpacity: 0.9,
        radius: 10
    };

    function style(feature) {
        return {
            "color": "#d53e4f",
            "radius": 10,
            "weight": 0,
            "opacity": 1,
            "fillOpacity": 0.8
        };
    }
    var stationsLayer = L.geoJson(null);
    var stations = L.geoJson(null, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, style(feature));
        },
        onEachFeature: function(feature, layer) {
            if (feature.properties) {
                layer.bindLabel(feature.properties.LOCATIONNAME, {
                    className: 'leaflet-label'
                });
                layer.on({click: identify});
              //  layer.on({click: populatepie});
                layer.on({click: populatebarchart});
                 //   console.log(marker.properties);
                if (layer.feature.properties.PED1 > 0){ var PEDM = numeral(layer.feature.properties.PED1).format('0,0')  ;}
                else { var PEDM = 'N/A'}

                if (layer.feature.properties.BIKE1 > 0){ var BIKEM = numeral(layer.feature.properties.BIKE1).format('0,0')  ;}
                else { var BIKEM = 'N/A'}

                if (layer.feature.properties.PED_YR > 0){ var PEDYR = numeral(layer.feature.properties.PED_YR).format('0,0')  ;}
                else { var PEDYR = 'N/A'}

                if (layer.feature.properties.BIKE_YR > 0){ var BIKEYR = numeral(layer.feature.properties.BIKE_YR).format('0,0')  ;}
                else { var BIKEYR = 'N/A'}

                var trail_id= [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,23,24,25];

                if( trail_id.includes(layer.feature.id) ){ var TCT = '<img class="TCT-tag" src="https://www.dvrpc.org/webmaps/TheCircuit/img/logo_stacked.png" alt="The Circuit Trails"/>'  ;}
                else { var TCT = ''}


                $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) +
                 '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '">'+
                '<td class="feature-name">' + layer.feature.properties.LOCATIONNAME 
              //  + TCT
              //  + '<a class="detaileddata" href="http://www.dvrpc.org/asp/bikeped/detailCount.aspx?ID=' 
                //+ layer.feature.id + '" target="_blank">Access Detailed Data</a>'
                +'</td>'+
              // Ped  Yesterday  '<td class="table-ped" style="vertical-align: middle;text-align:center">'+numeral(layer.feature.properties.PED_Y).format('0,0') +'</td>'+
              // Bike Yesterday '<td style="vertical-align: middle;text-align:center">'+ numeral(layer.feature.properties.BIKE_Y).format('0,0') +'</td>'+
              //  '<td class="table-ped" style="vertical-align: middle;text-align:center">'+numeral(layer.feature.properties.PED1).format('0,0') +'</td>'+
                '<td class="table-ped" style="vertical-align: middle;text-align:center">'+ BIKEM +'</td>'+
                '<td style="vertical-align: middle;text-align:center">'+ PEDM +'</td>'+
                '<td class="table-ped" style="vertical-align: middle;text-align:center">'+ BIKEYR +'</td>'+
                '<td style="vertical-align: middle;text-align:center">'+ PEDYR +'</td></tr>');
            }
        },
    });

    map = L.map("map", {
        zoom: 9,
        center: [39.952473, -75.164106],
        layers: [CartoDB_Positron, DVRPC, circuit, highlight,stations],
        zoomControl: false,
        attributionControl: false
    });

    //var viewCenter = new L.Control.ViewCenter();
    //map.addControl(viewCenter);

    /* Clear feature highlight when map is clicked */
    map.on("click", function(e) {
        highlight.clearLayers();
    });

    /* Attribution control */
    function updateAttribution(e) {
        $.each(map._layers, function(index, layer) {
            if (layer.getAttribution) {
                $("#attribution").html((layer.getAttribution()));
            }
        });
    }

    var attributionControl = L.control({
        position: "bottomright"
    });
    attributionControl.onAdd = function(map) {
        var div = L.DomUtil.create("div", "leaflet-control-attribution");
        div.innerHTML = "<span class='hidden-xs'></span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
        return div;
    };
    map.addControl(attributionControl);

    var zoomControl = L.control.zoom({
        position: "topleft"
    }).addTo(map);

    /* Larger screens get expanded layer control and visible sidebar */
    if (document.body.clientWidth <= 767) {
        var isCollapsed = true;
    } else {
        var isCollapsed = false;
    }

    var baseLayers = {
        "Street Map": CartoDB_Positron,
        "Imagery with Streets": Mapbox_Imagery
    };

    var layerControl = L.control.groupedLayers(baseLayers, {
        collapsed: isCollapsed
    }).addTo(map);

    L.Control.MapLegend = L.Control.extend({
        options: {
            position: 'bottomleft',
        },
        onAdd: function (map) {
            //TODO: Probably should throw all this data in a class and just loop through it all
            var legendDiv = L.DomUtil.create('div', 'map-legend legend-control leaflet-bar');

            legendDiv.innerHTML += '<div id="legend-icon" title="Toggle Legend"><i class="glyphicon glyphicon-minus"></i><span class="legend-label" style="display:none;">&nbsp;&nbsp;Legend</span></div>';

            var legend_top = L.DomUtil.create('div', 'map-legend-items legend-top', legendDiv),
                legend_body = L.DomUtil.create('div', 'map-legend-items legend-body', legendDiv),
                legend_bottom = L.DomUtil.create('div', 'map-legend-items legend-bottom', legendDiv);

            legend_body.innerHTML += '<div id="legend-content" class="row"><div class="col-xs-3"><i class="glyphicon glyphicon-minus ct-existing"></i>&nbsp;&nbsp;Existing</div><div class="col-xs-3"><i class="glyphicon glyphicon-minus ct-inprogress"></i>&nbsp;&nbsp;<br>In Progress</div><div class="col-xs-3"><i class="glyphicon glyphicon-minus ct-pipeline"></i><span>&nbsp;&nbsp;Pipeline</span></div><div class="col-xs-3"><i class="glyphicon glyphicon-minus ct-planned"></i><span>&nbsp;&nbsp;Planned</span></div></div>';
            
            legend_top.innerHTML += '<p><b>The Circuit Trails</b>'
            
            legendDiv.setAttribute('data-status', 'open');

            return legendDiv;
        }
    });

    var mapLegend = new L.Control.MapLegend();
    map.addControl(mapLegend);

   stationsLayer.bringToFront();

    // legend toggle
$(document.body).on('click', '#legend-icon', function(){
    var toggleStatus = $('.map-legend').attr('data-status');

    if(toggleStatus === 'closed'){
        $('.map-legend').css('width', '320px').css('height', 'auto').attr('data-status', 'open');
        $('#legend-icon i').toggleClass('glyphicon glyphicon-list glyphicon glyphicon-minus');
        $('#legend-icon .legend-label').hide();
        $('.map-legend-items').show();
    }else{
        $('.map-legend').css('width', '80px').css('height', '32px').attr('data-status', 'closed');
        $('#legend-icon i').toggleClass('glyphicon glyphicon-minus glyphicon glyphicon-list');
        $('#legend-icon .legend-label').show();
        $('.map-legend-items').hide();
    }
});


    $("#featureModal").on("hidden.bs.modal", function(e) {
        $(document).on("mouseout", ".feature-row", clearHighlight);
    });

    function identify(e) {
        var layer = e.target;
        var props = layer.feature.properties;
     //   var content = "<div class='labelfield2'><b>Station Name</b><br>" + (props.Name)
     //       + "<br><br><div class='labelfield2'><img src='assets/img/bike_list.png'> <b>Bicycle = </b>" + numeral(props.TT_BIKE).format('0,0') + "<br><br><div class='labelfield2'><img src='assets/img/ped_list.png'> <b>Pedestrian = </b>" + numeral(props.TT_PED).format('0,0') + "<br><br><div class='labelfield2'><b>Total Volume = </b>" + numeral(props.TT_ALL).format('0,0') + "</div>"
        
        var content3 = "<div>Pedestrian Volume by Month"
                        +"</div>"

        var content4 = "<div>Bicycle Volume by Month"
                        +"</div>"
        var content5 = "<div>Station Information for "+(props.LOCATIONNAME)
                        +"</div>"                
                       
        document.getElementById('cardped').innerHTML = content3; 
        document.getElementById('cardbike').innerHTML = content4;
        document.getElementById('card').innerHTML = content5;
       
        if (props.LOCATIONNAME == 'Pine St'||props.LOCATIONNAME == 'Spruce St') {
            // alert ("nope");
            $('#cardbikepanel').show();
            $('#cardpedpanel').hide();
            $('#card').show();
            $('#cardclick').hide();
           } else {
            $('#cardbikepanel').show();
            $('#cardpedpanel').show();
            $('#card').show();
            $('#cardclick').hide();
           }

        // $('#cardbikepanel').show();
        // $('#cardpedpanel').show();
        // $('#card').show();
        // $('#cardclick').hide();
        
        highlightRow.call(document.getElementById(L.stamp(layer)))
         
    //      $('#myTab a[href="#station_stats"]').tab('show');        
    //    document.getElementById('table_data').innerHTML = content;
    };

    function populatebarchart(e) {
        //    console.log("populatebarchart()");
           // resetHighlight();
            var layer = e.target;
            
            // Will TsayMod
            var props = layer.feature.properties;
                  // draws Bike on top
            updatestackedchart([
           //     [props.BIKEIN1,props.BIKEIN2,props.BIKEIN3,props.BIKEIN4,props.BIKEIN5,props.BIKEIN6,props.BIKEIN7,props.BIKEIN8,props.BIKEIN9,props.BIKEIN10,props.BIKEIN11,props.BIKEIN12],
           //     [props.BIKEOUT1,props.BIKEOUT2,props.BIKEOUT3,props.BIKEOUT4,props.BIKEOUT5,props.BIKEOUT6,props.BIKEOUT7,props.BIKEOUT8,props.BIKEOUT9,props.BIKEOUT10,props.BIKEOUT11,props.BIKEOUT12],
                [props.BIKEIN12,props.BIKEIN11,props.BIKEIN10,props.BIKEIN9,props.BIKEIN9,props.BIKEIN7,props.BIKEIN6,props.BIKEIN5,props.BIKEIN4,props.BIKEIN3,props.BIKEIN2,props.BIKEIN1],
                [props.BIKEOUT12,props.BIKEOUT11,props.BIKEOUT10,props.BIKEOUT9,props.BIKEOUT8,props.BIKEOUT7,props.BIKEOUT6,props.BIKEOUT5,props.BIKEOUT4,props.BIKEOUT3,props.BIKEOUT2,props.BIKEOUT1],
                printMonth([props.MONTH12, props.MONTH11, props.MONTH10, props.MONTH9, props.MONTH8, props.MONTH7, props.MONTH6, props.MONTH5, props.MONTH4, props.MONTH3, props.MONTH2, props.MONTH1]),
                [props.INDIR,props.OUTDIR]
           ])
             updatestackedchart2([
               [props.PEDIN12,props.PEDIN11,props.PEDIN10,props.PEDIN9,props.PEDIN8,props.PEDIN7,props.PEDIN6,props.PEDIN5,props.PEDIN4,props.PEDIN3,props.PEDIN2,props.PEDIN1],
                [props.PEDOUT12,props.PEDOUT11,props.PEDOUT10,props.PEDOUT9,props.PEDOUT8,props.PEDOUT7,props.PEDOUT6,props.PEDOUT5,props.PEDOUT4,props.PEDOUT3,props.PEDOUT2,props.PEDOUT1],
                printMonth([props.MONTH12, props.MONTH11, props.MONTH10, props.MONTH9, props.MONTH8, props.MONTH7, props.MONTH6, props.MONTH5, props.MONTH4, props.MONTH3, props.MONTH2, props.MONTH1]),
                [props.INDIR,props.OUTDIR]
            ])
        }
// colors: ['#e66101','#fee0b6', '#5e3c99','#998ec3']
        function updatestackedchart(Values) {
        var options = {
            chart: {
                renderTo: 'Monthly',
                type:'column',
                plotBackgroundColor: null,
                plotBorderWidth: 0,//null,
                plotShadow: true,
                height:220,
                marginBottom: 90,
                backgroundColor: '#fef0d9'
            },
            colors: 
                ['#e66101','#fee0b6']
    
            ,
            credits: {
                enabled: false
            },
            title: {
              //  text: 'Bicycle Volume by Month',
              text:null,
                x: -20 //center
            },
            xAxis: {
                categories: Values[2]
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
            yAxis: {
                min: 0,
                title: {
                    text: 'Total Volume'
                },
                stackLabels: {
                    enabled: false,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            legend: {
                align: 'right',
                x: 0,
                verticalAlign: 'bottom',
                y: 10,
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
            series: [
                {
                    name:'East Bound',
                    data: []
                },
                   {
                    name:'West Bound',
                    data: []
                }
            ]
        };
        
        // Will Mod
        bikeindata = [];
        for (var i = 0; i < Values[0].length; i++){
            bikeindata.push({
            y: Values[0][i]})
        }
        bikeoutdata = [];
        for (var i = 0; i < Values[1].length; i++){
            bikeoutdata.push({
            y: Values[1][i]})
        }
        
        options.series[0].data = bikeindata;
        options.series[1].data = bikeoutdata;

        options.series[0].name = Values[3][0];
        options.series[1].name = Values[3][1];
        chart = new Highcharts.Chart(options)
     //    console.log(pedindata);
     //    console.log(bikeindata);
     //    console.log(bikeindata);
    }

    function updatestackedchart2 (Values) {
        var options = {
            chart: {
                renderTo: 'Monthly2',
                type:'column',
                plotBackgroundColor: null,
                plotBorderWidth: 0,//null,
                plotShadow: true,
                height:220,
                marginBottom: 90,
                backgroundColor: '#f2f0f7'
            },
             colors: ['#5e3c99','#998ec3'],
            credits: {
                enabled: false
            },
            title: {
            //   text: 'Pedestrian Volume by Month',
              text:null,
                x: -20 //center
            },
            xAxis: {
               categories: Values[2]
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
            yAxis: {
                min: 0,
                title: {
                    text: 'Total Volume'
                },
                stackLabels: {
                    enabled: false,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            legend: {
                align: 'right',
                x: 0,
                verticalAlign: 'bottom',
                y: 10,
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
            series: [
                {
                    name:'East Bound',
                    data: []
                },
                   {
                    name:'West Bound',
                    data: []
                }
            ]
        };
        
        pedindata = [];
        for (var i = 0; i < Values[0].length; i++){
            pedindata.push({
            y: Values[0][i]})
        }
          pedoutdata = [];
        for (var i = 0; i < Values[1].length; i++){
            pedoutdata.push({
            y: Values[1][i]})
        }
        // options.xAxis.categories = Values[0]['data']; 
        //    
        options.series[0].data = pedindata;
        options.series[1].data = pedoutdata;
        
        options.series[0].name = Values[3][0];
        options.series[1].name = Values[3][1];
        chart = new Highcharts.Chart(options)

     //    $('.highcharts-xaxis-labels text').on('click', function () {
     //    console.log($(this).text());
     //    });

         $('.highcharts-xaxis-labels text').on("click", function(d, i) {
            console.log($(this).text());
            $('#aboutModal').one('shown.bs.modal', function() {
                $('#legendTabs a[href="#RideScoreTab"]').tab('show');
            }).modal('show');
        });
     //    console.log(pedindata);
     //    console.log(bikeindata);
     //    console.log(bikeindata);
    }



    /* Typeahead search functionality */
    $(document).one("ajaxStop", function() {
        $("#loading").hide();
        sizeLayerControl();
        /* Fit map to boroughs bounds */
        //  map.fitBounds(boroughs.getBounds());
        featureList = new List("regionallist", {
            valueNames: ["feature-name"]
        });

       featureList.sort("feature-name", {
            order: "asc"
        });
    });

    // Leaflet patch to make layer control scrollable on touch browsers
    var container = $(".leaflet-control-layers")[0];
    if (!L.Browser.touch) {
        L.DomEvent
            .disableClickPropagation(container)
            .disableScrollPropagation(container);
    } else {
        L.DomEvent.disableClickPropagation(container);
    }
