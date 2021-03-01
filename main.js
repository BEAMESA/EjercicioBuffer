
require ([
    "dojo/parser",
    "esri/map",
    "dojo/on",
    "dojo/dom",
    "esri/tasks/BufferParameters",
    "esri/SpatialReference",
    "esri/tasks/GeometryService",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/Color",
    "esri/toolbars/draw",
    "esri/graphic",
    "dojo/_base/array",
    "dojo/domReady!"
], function (
    parser,
    Map,
    on,
    dom,
    BufferParameters,
    SpatialReference,
    GeometryService,
    SimpleLineSymbol,
    SimpleFillSymbol,
    Color,
    Draw,
    Graphic,
    array
) {

    parser.parse();

    var map = new Map ("miMapa", {
        basemap: "topo",
        center: [-122.45, 37.75],
        zoom: 7
    });



    on(dom.byId("clearGraphics"), "click", function(){
        if(map){
          map.graphics.clear();
        }
    });


    var dibujo = new Draw (map);
    dibujo.on("draw-end", buffer);
    dibujo.activate (Draw.POLYLINE);


    function buffer (evt) {
        map.graphics.clear

        var linea = new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_DASH,
            new Color ([255,0,0]),
            5
        );

        var grafico = new Graphic (evt.geometry, linea);
        map.graphics.add(grafico);


        var geomService = new GeometryService ("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");


        var bufferParams = new BufferParameters();
            bufferParams.outSpatialReference = map.SpatialReference;
            bufferParams.distance = [10]
            bufferParams.unit = GeometryService.UNIT_KILOMETER;
            bufferParams.geometries = [evt.geometry]


        geomService.buffer(bufferParams, showBuffer);
        // geomService.on('buffer-complete', showBuffer);

    }


    function showBuffer (evento) {
        var simbologia = new SimpleFillSymbol (
            SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
            new Color ([255,0,0, 0,65]), 2),
            new Color ([255,255,0, 0,25])
        );      

    

        array.forEach (evento, function(geom) {
            var graphico = new Graphic(geom, simbologia);
            map.graphics.add(graphico);

        });

    }


});