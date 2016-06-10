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
        $('#datainfo').toggleClass('col-sm-4 col-sm-6');
        $('#map').toggleClass('col-sm-4 col-sm-6');
        map.invalidateSize();
        return false;
    });

    $("#nav-btn").click(function() {
        $(".navbar-collapse").collapse("toggle");
        return false;
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

    /* Basemap Layers */
    var CartoDB_Positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19
    });
    var mapquestHYB = L.layerGroup([L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
        maxZoom: 18,
        subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"]
    }), L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/hyb/{z}/{x}/{y}.png", {
        maxZoom: 19,
        subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
        attribution: 'Labels courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
    })]);
   /* Overlay Layers */
       $.getJSON('data/bikeped.js', function(data) {
        stations.addData(data);
        map.addLayer(stationsLayer);
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
    $.getJSON("data/cnty.js", function(data) {
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

    var highlight = L.geoJson(null,{
        onEachFeature: function(feature, layer) { 
            if (feature.properties) {
                layer.bindLabel(feature.properties.Name, {
                    className: 'leaflet-label'
                });
            }
        },
    });
    
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
              //  layer.on({click: populatepie});
                layer.on({click: populatebarchart});
                $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) +
                 '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td class="feature-name">' + 
                 layer.feature.properties.Name + '</td>'+
                '<td class="table-ped" style="vertical-align: middle;text-align:center">'+numeral(layer.feature.properties.PED_Y).format('0,0') +'</td>'+
                '<td style="vertical-align: middle;text-align:center">'+ numeral(layer.feature.properties.BIKE_Y).format('0,0') +'</td>'+
                '<td class="table-ped" style="vertical-align: middle;text-align:center">'+numeral(layer.feature.properties.PED_W).format('0,0') +'</td>'+
                '<td style="vertical-align: middle;text-align:center">'+ numeral(layer.feature.properties.BIKE_W).format('0,0') +'</td>'+
                '<td class="table-ped" style="vertical-align: middle;text-align:center">'+numeral(layer.feature.properties.PED_YTD).format('0,0') +'</td>'+
                '<td style="vertical-align: middle;text-align:center">'+ numeral(layer.feature.properties.BIKE_YTD).format('0,0') +'</td></tr>');

            }
        },
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
        var content = "<div class='labelfield2'><b>Station Name</b><br>" + (props.Name)
            + "<br><br><div class='labelfield2'><img src='assets/img/bike_list.png'> <b>Bicycle = </b>" + numeral(props.TT_BIKE).format('0,0') + "<br><br><div class='labelfield2'><img src='assets/img/ped_list.png'> <b>Pedestrian = </b>" + numeral(props.TT_PED).format('0,0') + "<br><br><div class='labelfield2'><b>Total Volume = </b>" + numeral(props.TT_ALL).format('0,0') + "</div>"
        
        var content3 = "<div>Pedestrian Volume by Month"
                        +"</div>"

        var content4 = "<div>Bicycle Volume by Month"
                        +"</div>"
        var content5 = "<div>Station Information for "+(props.Name)
                        +"</div>"                
                       
          document.getElementById('cardped').innerHTML = content3; 
          document.getElementById('cardbike').innerHTML = content4;
          document.getElementById('card').innerHTML = content5;
          $('#cardbikepanel').show();
          $('#cardpedpanel').show();
          $('#card').show();
         
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
                [props.BIKEIN8,props.BIKEIN7,props.BIKEIN6,props.BIKEIN5,props.BIKEIN4,props.BIKEIN3,props.BIKEIN2,props.BIKEIN1,props.BIKEIN12,props.BIKEIN11,props.BIKEIN10,props.BIKEIN9],
                [props.BIKEOUT8,props.BIKEOUT7,props.BIKEOUT6,props.BIKEOUT5,props.BIKEOUT4,props.BIKEOUT3,props.BIKEOUT2,props.BIKEOUT1,props.BIKEOUT12,props.BIKEOUT11,props.BIKEOUT10,props.BIKEOUT9],
           
           ])
             updatestackedchart2([
               [props.PEDIN8,props.PEDIN7,props.PEDIN6,props.PEDIN5,props.PEDIN4,props.PEDIN3,props.PEDIN2,props.PEDIN1,props.PEDIN12,props.PEDIN11,props.PEDIN10,props.PEDIN9],
                [props.PEDOUT8,props.PEDOUT7,props.PEDOUT6,props.PEDOUT5,props.PEDOUT4,props.PEDOUT3,props.PEDOUT2,props.PEDOUT1,props.PEDOUT12,props.PEDOUT11,props.PEDOUT10,props.PEDOUT9],
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
                height:200,
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
                categories: [ 'Jan', 'Feb', 'March', 'April','May','June','July','August','September','October','November','December']
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
                align: 'left',
                x: 0,
                verticalAlign: 'bottom',
                y: 12,
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
                height:200,
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
                categories: [ 'Jan', 'Feb', 'March', 'April','May','June','July','August','September','October','November','December']
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
                align: 'left',
                x: 0,
                verticalAlign: 'bottom',
                y: 12,
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