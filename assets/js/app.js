    var map, featureList;

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

    $("#list-btn").click(function() {
        $('#sidebar').toggle();
        map.invalidateSize();
        return false;
    });

    $("#nav-btn").click(function() {
        $(".navbar-collapse").collapse("toggle");
        return false;
    });

    $("#sidebar-toggle-btn").click(function() {
        $("#sidebar").toggle();
        map.invalidateSize();
        return false;
    });

    $("#sidebar-hide-btn").click(function() {
        $('#sidebar').hide();
        map.invalidateSize();
    });

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

    function syncSidebar() {
        /* Empty sidebar features */
        $("#feature-list tbody").empty();
        /* Loop through museums layer and add only features which are in the map bounds */
        stations.eachLayer(function(layer) {
            if (map.hasLayer(stationsLayer)) {
                if (map.getBounds().contains(layer.getLatLng())) {
                    $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/museum.png"></td><td class="feature-name">' + layer.feature.properties.Name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
                }
            }
        });
        /* Update list.js featureList */
        featureList = new List("features", {
            valueNames: ["feature-name"]
        });
        featureList.sort("feature-name", {
            order: "asc"
        });
    }

    /* Basemap Layers */
    var CartoDB_Positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19
});
 //   var mapquestOSM = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/terrain.day/{z}/{x}/{y}/256/png8?app_id={app_id}&app_code={app_code}', {
 //       attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
 //       subdomains: '1234',
 //       mapID: 'newest',
 //       app_id: 'Y8m9dK2brESDPGJPdrvs',
 //       app_code: 'dq2MYIvjAotR8tHvY8Q_Dg',
 //       base: 'aerial',
 //       minZoom: 0,
 //       maxZoom: 20
 //   });
    //var mapquestOSM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
    //  maxZoom: 19,
    //  subdomains: ["otile1", "otile2", "otile3", "otile4"],
    //  attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
    //});
    var mapquestHYB = L.layerGroup([L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
        maxZoom: 18,
        subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"]
    }), L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/hyb/{z}/{x}/{y}.png", {
        maxZoom: 19,
        subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
        attribution: 'Labels courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
    })]);
   /* Overlay Layers */

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
    $.getJSON("data/COUNTY_DVRPC.js", function(data) {
        DVRPC.addData(data);
    });

    var circuit = L.geoJson(null, {
        style: {
            stroke: true,
            fillColor: 'none',
            color: '#31a354',
            weight: 3,
            fill: true,
            opacity: 1,
            fillOpacity: .70,
            clickable: true
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(feature.properties.NAME);
        },
    });
    $.getJSON("data/circuit.js", function(data) {
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

    var highlight = L.geoJson(null);
    var highlightStyle = {
        stroke: false,
        fillColor: "#00FFFF",
        fillOpacity: 0.7,
        radius: 10
    };

    function style(feature) {
        return {
            "color": "#0868AC",
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
                layer.bindLabel(feature.properties.Name, {
                    className: 'leaflet-label'
                });
                layer.on({click: identify});
                layer.on({click: populatepie});
                layer.on({click: populatebarchart});
                //layer.on({
                //   click: function (e) {
                //   $("#feature-title").html(feature.properties.Name);
                //   $("#feature-info").html(content);
                //   $("#featureModal").modal("show");
                //    highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
                //  }
                //   });
                $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td class="feature-name">' + layer.feature.properties.Name + '</td><td style="vertical-align: middle;">' + numeral(layer.feature.properties.TT_BIKE).format('0,0') + '</td><td style="vertical-align: middle;">' + numeral(layer.feature.properties.TT_PED).format('0,0') + '</td><td style="vertical-align: middle;">' + numeral(layer.feature.properties.TT_ALL).format('0,0') + '</td></tr>');

            }
        },
    });
    $.getJSON('data/bikeped.js', function(data) {
        stations.addData(data);
        map.addLayer(stationsLayer);
    });

    map = L.map("map", {
        zoom: 9,
        center: [39.952473, -75.164106],
        layers: [CartoDB_Positron, DVRPC, highlight, circuit, stations],
        zoomControl: false,
        attributionControl: false
    });

    //var viewCenter = new L.Control.ViewCenter();
    //map.addControl(viewCenter);


    /* Filter sidebar feature list to only show features in current map bounds */
    //  map.on("moveend", function (e) {
    //  syncSidebar();
    //  });

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
        div.innerHTML = "<span class='hidden-xs'>Developed by <a href='http://bryanmcbride.com'>bryanmcbride.com</a> | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
        return div;
    };
    map.addControl(attributionControl);

    var zoomControl = L.control.zoom({
        position: "bottomright"
    }).addTo(map);

    /* Larger screens get expanded layer control and visible sidebar */
    if (document.body.clientWidth <= 767) {
        var isCollapsed = true;
    } else {
        var isCollapsed = false;
    }

    var baseLayers = {
        "Street Map": CartoDB_Positron,
        "Imagery with Streets": mapquestHYB
    };

    var layerControl = L.control.groupedLayers(baseLayers, {
        collapsed: isCollapsed
    }).addTo(map);

    $("#featureModal").on("hidden.bs.modal", function(e) {
        $(document).on("mouseout", ".feature-row", clearHighlight);
    });

    function identify(e) {
        var layer = e.target;
        var props = layer.feature.properties;

    //    var content2 = "<div class='list-group-item'><b>Station Name</b><br>" + (props.Name)
            //       +"<div class='labelfield2'><b>Date Installed: </b>"+ (props.INSTALL)
    //        + "<br><br><div class='list-group-item'><img src='assets/img/bike_list.png'> <b>Bicycle = </b>" 
    //        + numeral(props.TT_BIKE).format('0,0') 
    //        + "<br><br><div class='list-group-item'><img src='assets/img/ped_list.png'> <b>Pedestrian = </b>" 
    //        + numeral(props.TT_PED).format('0,0') + "<br><br><div class='labelfield2'><b>Total Volume = </b>" 
    //        + numeral(props.TT_ALL).format('0,0') + "</div>"
        var content3 = "<div class='panel panel-primary'>"
                    +"<div class='panel-heading'><h4 class='panel-title' id='topPartnerTitle'>"+ (props.Name)+"</h4></div>"
                    +"<div class='panel-body'>"
                            +"<div class='mi-upper-total'>"
                            +"<div class='row'>"
                            +"<div class='col-lg-4 col-lg-offset-1 col-sm-3 col-sm-offset-1 col-xs-4 col-xs-offset-1'>"
                            +"<div id='mi-foreign-icon' class='mi-icons mi-center'>"
                            +"<i class='glyphicon glyphicon-calendar'></i>"
                            +"</div>"
                            +"</div>"
                            +"<div class='col-lg-7 col-sm-8 col-xs-7 mi-right-stats'>"
                            +"<div id='mi-foreign-value'>"+ (props.AVE_ALLm)+"</div>"
                            +"<div class='mi-total-text'>monthly</div>"
                            +"</div>"
                            +"</div>"
                            +"</div>"
                            +"<div class='mi-upper-total'>"
                            +"<div class='row'>"
                            +"<div class='col-lg-4 col-lg-offset-1 col-sm-3 col-sm-offset-1 col-xs-4 col-xs-offset-1'>"
                            +"<div id='mi-foreign-icon' class='mi-icons mi-center'>"
                            +"<i class='glyphicon glyphicon-list-alt'></i>"
                            +"</div>"
                            +"</div>"
                            +"<div class='col-lg-7 col-sm-8 col-xs-7 mi-right-stats'>"
                            +"<div id='mi-foreign-value'>"+ (props.AVE_ALLd)+"</div>"
                            +"<div class='mi-total-text'>daily</div>"
                            +"</div>"
                            +"</div>"
                            +"</div>"
                             +"<div class='mi-upper-total'>"
                            +"<div class='row'>"
                            +"<div class='col-lg-4 col-lg-offset-1 col-sm-3 col-sm-offset-1 col-xs-4 col-xs-offset-1'>"
                            +"<div id='mi-foreign-icon' class='mi-icons mi-center'>"
                            +"<i class='glyphicon glyphicon-time'></i>"
                            +"</div>"
                            +"</div>"
                            +"<div class='col-lg-7 col-sm-8 col-xs-7 mi-right-stats'>"
                            +"<div id='mi-foreign-value'>"+ (props.AVE_ALLhr)+"</div>"
                            +"<div class='mi-total-text'>hourly</div>"
                            +"</div>"
                            +"</div>"
                            +"</div>"
                       +"</div>"
                       +"</div>"

       var content2 = "<div class='panel panel-primary'>"
                    +"<div class='panel-heading'>"
                    +"<h4 class='panel-title' id='topPartnerTitle'>"+ (props.Name)+"</h4></div>"
                    +"<div class='panel-body'>"
                    +"<li class='list-group-item'>Average All Monthly: <B>" + (props.AVE_ALLm) +"</B></li>" 
                    +"<li class='list-group-item'>Average All Daily: " + (props.AVE_ALLd) +"</li>" 
                    +"<li class='list-group-item'>Average All Hourly: "+ (props.AVE_ALLhr) +"</li>"  
                    +"<hr>"
                    +"<li class='list-group-item'>Average Bike Monthly: " + (props.AVE_BIKEm) +"</li>" 
                    +"<li class='list-group-item'>Average Bike Daily: " + (props.AVE_BIKEd) +"</li>" 
                    +"<li class='list-group-item'>Average Bike Hourly: "+ (props.AVE_BIKEhr) +"</li>"  
                    +"<hr>"
                    +"<li class='list-group-item'>Average Pedestrian Monthly: " + (props.AVE_PEDm) +"</li>" 
                    +"<li class='list-group-item'>Average Pedestrian  Daily: " + (props.AVE_PEDd) +"</li>" 
                    +"<li class='list-group-item'>Average Pedestrian  Hourly: "+ (props.AVE_PEDhr) +"</li>"  
                    +"</div>"    
                    +"</div>"  
        

        var content = "<div class='labelfield2'><b>Station Name</b><br>" + (props.Name)
            //       +"<div class='labelfield2'><b>Date Installed: </b>"+ (props.INSTALL)
            + "<br><br><div class='labelfield2'><img src='assets/img/bike_list.png'> <b>Bicycle = </b>" + numeral(props.TT_BIKE).format('0,0') + "<br><br><div class='labelfield2'><img src='assets/img/ped_list.png'> <b>Pedestrian = </b>" + numeral(props.TT_PED).format('0,0') + "<br><br><div class='labelfield2'><b>Total Volume = </b>" + numeral(props.TT_ALL).format('0,0') + "</div>"
        
        document.getElementById('datainfo').innerHTML = content3;
        document.getElementById('table_data').innerHTML = content;
    };

  //  Highcharts.setOptions({
  //      colors: ['#e66101', '#5e3c99']
 //   });

    function updatepie(Values) {
        var piechart = {
            chart: {
                renderTo: 'bikepeddata',
                type: 'pie',
                plotBackgroundColor: null,
                plotBorderWidth: 0, //null,
                plotShadow: true,
                height: 350,
                width: 250,
                colors: ['#e66101', '#5e3c99']
            },
            title: {
                text: 'Total Count by Mode',
                x: -20 //center   
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    animation: {
                        duration: 750
                    },
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        //   style: '{text-align: center}',
                        verticalAlign: 'middle',
                        distance: -20,
                        format: '<span>{point.percentage:.0f} %</span>',
                        //   format: '<span><b>{point.name}</b> <br/> {point.percentage:.0f} %</span>',
                    },
                    showInLegend: true
                }
            },
            legend: {
                layout: 'horizontal',
                verticalAlign: 'top',
                x: -20,
                y: 25
            },
            tooltip: {
                valueDecimals: 0,
                pointFormat: "Counts: {point.y:,.0f}"
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Counts',
                id: 'Values',
                innerSize: '60%',
                colors: ['#e66101', '#5e3c99'],
                data: []
            }]
        };
        var Labels = ["Bicycle", "Pedestrian"],
            countdata = [];
        for (var i = 0; i < Values.length; i++) {
            countdata.push({
                name: Labels[i],
                y: Values[i]
            })
        }
        piechart.series[0].data = countdata;
        var chart2 = new Highcharts.Chart(piechart)
    }

    function populatebarchart(e) {
        //    console.log("populatebarchart()");
           // resetHighlight();
            var layer = e.target;
            
            /* ORIGINAL:
            var props = layer.feature.properties;
            pedindata = [props.PEDIN1,props.PEDIN2,props.PEDIN3,props.PEDIN4,props.PEDIN5,props.PEDIN6,props.PEDIN7,props.PEDIN8,props.PEDIN9,props.PEDIN10,props.PEDIN11,props.PEDIN12];
            updatestackedchart(pedindata);
            bikeindata = [props.BIKEIN1,props.BIKEIN2,props.BIKEIN3,props.BIKEIN4,props.BIKEIN5,props.BIKEIN6,props.BIKEIN7,props.BIKEIN8,props.BIKEIN9,props.BIKEIN10,props.BIKEIN11,props.BIKEIN12];
            updatestackedchart(bikeindata);
            */
            
            // Will TsayMod
            var props = layer.feature.properties;
                  // draws Bike on top
            updatestackedchart([
                [props.BIKEIN1,props.BIKEIN2,props.BIKEIN3,props.BIKEIN4,props.BIKEIN5,props.BIKEIN6,props.BIKEIN7,props.BIKEIN8,props.BIKEIN9,props.BIKEIN10,props.BIKEIN11,props.BIKEIN12],
                [props.BIKEOUT1,props.BIKEOUT2,props.BIKEOUT3,props.BIKEOUT4,props.BIKEOUT5,props.BIKEOUT6,props.BIKEOUT7,props.BIKEOUT8,props.BIKEOUT9,props.BIKEOUT10,props.BIKEOUT11,props.BIKEOUT12],
                [props.PEDIN1,props.PEDIN2,props.PEDIN3,props.PEDIN4,props.PEDIN5,props.PEDIN6,props.PEDIN7,props.PEDIN8,props.PEDIN9,props.PEDIN10,props.PEDIN11,props.PEDIN12],
                [props.PEDOUT1,props.PEDOUT2,props.PEDOUT3,props.PEDOUT4,props.PEDOUT5,props.PEDOUT6,props.PEDOUT7,props.PEDOUT8,props.PEDOUT9,props.PEDOUT10,props.PEDOUT11,props.PEDOUT12],
            ])
        }

        Highcharts.setOptions({
            colors: ['#e66101','#fee0b6', '#5e3c99','#998ec3']
            // orange, purple
        });
        
        function updatestackedchart(Values) {
        var options = {
            chart: {
                renderTo: 'Monthly',
                type:'column',
                plotBackgroundColor: null,
                plotBorderWidth: 0,//null,
                plotShadow: true,
                height:400
            },
            credits: {
                enabled: false
            },
            title: {
                text: 'Total Volume',
                x: -20 //center
            },
            xAxis: {
                categories: [ 'Jan', 'Feb', 'March', 'April','May','June','July','August','September','October','November','December']
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
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
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            legend: {
                align: 'right',
                x: -30,
                verticalAlign: 'top',
                y: 25,
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
                    name:'Bike (in)',
                    data: []
                },
                  {
                    name:'Bike (out)',
                    data: []
                },
                {
                    name:'Ped (in)',
                    data: []
                },
                   {
                    name:'Ped (out)',
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
        pedindata = [];
        for (var i = 0; i < Values[2].length; i++){
            pedindata.push({
            y: Values[2][i]})
        }
          pedoutdata = [];
        for (var i = 0; i < Values[3].length; i++){
            pedoutdata.push({
            y: Values[3][i]})
        }
        // options.xAxis.categories = Values[0]['data']; 
        //    
        options.series[0].data = bikeindata;
        options.series[1].data = bikeoutdata;
        options.series[2].data = pedindata;
        options.series[3].data = pedoutdata;
        chart = new Highcharts.Chart(options)
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
        featureList = new List("features", {
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