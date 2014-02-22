$(document).ready(function(){

  var queries = {
    planned_works: 'SELECT * FROM roadworks WHERE phasetyperef = \'Future\'',
    current_works: 'SELECT * FROM roadworks WHERE phasetyperef = \'Current\'',



  }

  var map;

  map = new L.Map('map', {
    center: [55,-1.59],
    zoom: 12
  })

  L.tileLayer('//otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
    subdomains: '1234',
    attribution: 'Map data &copy; OpenStreetMap contributors, Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="//developer.mapquest.com/content/osm/mq_logo.png">'
  }).addTo(map);

  /*
  L.tileLayer('//{s}.tiles.mapbox.com/v3/amercader.map-6wq525r7/{z}/{x}/{y}.png', {
    subdomains: 'abcd',
    attribution: 'Map data &copy; ' + new Date().getFullYear() + ' OpenStreetMap contributors, ' +
  'Tiles Courtesy of <a href=\'http://www.mapbox.com/\' target=\'_blank\'>MapBox</a>'
  }).addTo(map);
  */

  var layerUrl = 'http://amercader.cartodb.com/api/v2/viz/5eb92cd2-9bc7-11e3-bc61-0e49973114de/viz.json';

  var l;
  cartodb.createLayer(map, layerUrl)
   .addTo(map)
   .on('done', function(layer) {
    // change the query for the first layer
    var subLayerOptions = {
      sql: queries.current_works
//          cartocss: "#roadworks{marker-fill: #109DCD; marker-width: 5; marker-line-color: white; marker-line-width: 0;}"
    }

    layer.getSubLayer(0).set(subLayerOptions);

    l = layer.getSubLayer(0);

  }).on('error', function() {
    //log the error
  });

  $('#planned').click(function(){
    l.setSQL(queries.planned_works);
  });

  $('#current').click(function(){
    l.setSQL(queries.current_works);
  });

});
