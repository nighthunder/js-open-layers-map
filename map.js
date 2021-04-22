var projection = new ol.proj.Projection({
    code: 'EPSG:4674',
    // units: 'degrees',
    // axisOrientation: 'neu',
    // global: true
});

var view = new ol.View({
    // projection: projection,
    center: ol.proj.fromLonLat([-57, -14.5]),
    zoom: 4.8,
});



// Adicionando Layer vinda do GEOSERVER

// var untiled = new ol.layer.Image({
//     source: new ol.source.ImageWMS({
//       ratio: 1,
//       url: 'http://localhost:8080/geoserver/macroplan/wms',
//       params: {'FORMAT': format,
//                'VERSION': '1.1.1',  
//             "LAYERS": 'macroplan:BR_UF_2019',
//             "exceptions": 'application/vnd.ogc.se_inimage',
//       }
//     })
//   });

// var wmsSource = new ol.source.TileWMS({
//     url: 'http://localhost:8080/geoserver/macroplan/wms',
//     params: {'FORMAT': format, 
//              'VERSION': '1.1.1',
//              tiled: true,
//           "LAYERS": 'macroplan:BR_UF_2019',
//           "exceptions": 'application/vnd.ogc.se_inimage',
//        tilesOrigin: -73.990449969 + "," + -33.751177994
//     },
//     // params: {'LAYERS': 'macroplan:BR_UF_2019', 'TILED': true},
//     serverType: 'geoserver',
//     crossOrigin: 'anonymous',
// });
  
// var wmsLayer = new ol.layer.Tile({
//     source: wmsSource,
// });

var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Group({
            'title': 'Mapas',
            layers: [
                new ol.layer.Tile({
                    title: "OSM Maps",
                    type: "base",
                    visible: false,
                    source: new ol.source.OSM()
                }),
                new ol.layer.Tile({
                    title: "Bing Maps Road",
                    type: "base",
                    visible: true,
                    source: new ol.source.BingMaps({
                        key: 'AiAmN57Tfpo2eXbnihideUOBgZTCI3HFw_EEqn82QHMqPFYY_KLw7ScTtkmVs4KR',
                        imagerySet: 'road'
                    })
                }),
                new ol.layer.Tile({
                    title: "Bing Maps Aerial",
                    type: "base",
                    visible: false,
                    source: new ol.source.BingMaps({
                        key: 'AiAmN57Tfpo2eXbnihideUOBgZTCI3HFw_EEqn82QHMqPFYY_KLw7ScTtkmVs4KR',
                        imagerySet: 'aerial'
                    })
                }),
                new ol.layer.Tile({
                    title: "Em Branco",
                    type: "base",
                    visible: false,
                }),
            ]
        }),
    ],
    view: view
});

// Recebe um evento e retorna a feature da camada mais alta
map.getFeatureByEvent = function (evt) {
    var pixel = evt.pixel;
    var topFeature;
    map.forEachFeatureAtPixel(pixel, function (feature, layer) {
        topFeature = feature.getProperties();

    });
    return topFeature;
};

layerSwitcher = new ol.control.LayerSwitcher({
    // tipLabel: 'Legenda' // Optional label for button
});
map.addControl(layerSwitcher);

// Iniciando tooltips
map.tooltip = document.getElementById('map_tooltip');
map.overlay = new ol.Overlay({
    element: map.tooltip,
    offset: [10, 0],
    positioning: 'bottom-left'
});
map.addOverlay(map.overlay);

// var arrayUF = ['AM', 'AC', 'TO', 'RR', 'RO', 'MA', 'AP', 'PA', 'MT']
var arrayUF = ['BR']

featureStyle = new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'red'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'black',
                        width: 1,
                    }),
                    // text: new ol.style.Text({
                    //     font: '20px Calibri,sans-serif',
                    //     fill: new ol.style.Fill({
                    //         color: 'black',
                    //     }),
                    //     stroke: new ol.style.Stroke({
                    //         color: '#fff',
                    //         width: 3,
                    //     }),
                    // }),
                })

arrayUF.forEach(element => {
    let url = 'http://192.168.1.94:8888/'+ element +'_UF_2019.json'
    // let url = "http://192.168.1.94:8888/SP_Municipios_2019.json"

    var vectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: url
        }),
        style: function(feature){;
            return featureStyle
        },
        opacity: 0.3,
        // name: 
    })
    map.addLayer(vectorLayer);


    // $.ajax({
    //     type: 'GET',
    //     url: url,
    //     dataType: "json",
    //     success: function(data) {
    //         var geojsonFormat = new ol.format.GeoJSON();
    //         var features = geojsonFormat.readFeatures(data, {});
    //         vectorLayer.getSource().addFeatures(features);
            
    //     }
    // });

});

map.on('pointermove', function (evt, layer) {
    var feature = map.getFeatureByEvent(evt);
    // console.log("feature", feature);
    // console.log("layer", layer);
    if(feature){
        map.overlay.setPosition(evt.coordinate);
        $(map.tooltip).text(feature['NM_UF']+' - '+feature['SIGLA_UF']);
        // $(map.tooltip).text(feature['NM_MUN']+' - '+feature['SIGLA_UF']);
        $(map.tooltip).show();
        this.getTargetElement().style.cursor = 'pointer';
    }else{
        $(map.tooltip).hide();
        this.getTargetElement().style.cursor = '';
    }
});

// var selected = null;
var highlightStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: '#FFFF00',
    }),
});

// Aplica o estilo da feature de acordo com o mouse
var hoverInteraction = new ol.interaction.Select({
    condition: ol.events.condition.pointerMove,
    
    style: function(feature, layer){
        return highlightStyle;
    },

});
map.addInteraction(hoverInteraction);