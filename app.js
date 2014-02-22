$(document).ready(function(){
  var baseSQLAPI = 'http://amercader.cartodb.com/api/v2/sql?q=';

  var queries = {
    counts: 'SELECT COUNT(phaseTypeRef),phaseTypeRef FROM roadworks GROUP BY phaseTypeRef',


    plannedWorks: 'SELECT * FROM roadworks WHERE phasetyperef = \'Future\'',
    currentWorks: 'SELECT * FROM roadworks WHERE phasetyperef = \'Current\'',
    currentWorksPastTime: 'SELECT COUNT(*), (planned_endtime > NOW()) AS on_time FROM roadworks WHERE phasetyperef = \'Current\' GROUP BY (planned_endtime > NOW())',
    plannedWorksPastTime: 'SELECT COUNT(*), (planned_starttime > NOW()) AS on_time FROM roadworks WHERE phasetyperef = \'Future\' GROUP BY (planned_starttime > NOW())'


  }

  function buildPieChartFromResult(id, result) {
    var worksOnTime = (result.rows[0].on_time) ? result.rows[0].count : result.rows[1].count;
    var worksPastTime = (result.rows[0].on_time) ? result.rows[1].count : result.rows[0].count;
    var data = [
      {label: 'On time', data: worksOnTime, color: '#229a00'},
      {label: 'Past time', data: worksPastTime, color: '#f84f40'}
    ];
    buildPieChart(id, data);
  }
  function buildPieChart(id, data) {

    function labelFormatter(label, series) {
      return "<div class='pieLabelCustom'>" + label + " (" + Math.round(series.percent) + "%)</div>";
    }

    $.plot(id, data, {
      series: {
        pie: {
          show: true,
          radius: 1,
          label: {
              show: false,
              radius: 0.5,
              background: {
                opacity: 0.5,
                color: '#FFFFFF'
              }
          }
        }
      },
      legend: {
        show: true,
        labelFormatter: labelFormatter
      }
    });
  }

  // Get global counts
  $.getJSON(baseSQLAPI + queries.counts, function(result) {

    var data = [];
    var row;
    for (var i = 0; i < result.rows.length; i++) {
      row = result.rows[i];
      if (row.phasetyperef == 'Current') {
        $('#current-value').html(row.count);
      } else if (row.phasetyperef == 'Future') {
        $('#planned-value').html(row.count);
      }

    }
  });

  // Get current works on time
  $.getJSON(baseSQLAPI + queries.currentWorksPastTime, function(result) {
    buildPieChartFromResult('#current-graph', result);
  });

  // Get planned works on time
  $.getJSON(baseSQLAPI + queries.plannedWorksPastTime, function(result) {
    buildPieChartFromResult('#planned-graph', result);
  });

  return
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
      sql: queries.currentWorks
//          cartocss: "#roadworks{marker-fill: #109DCD; marker-width: 5; marker-line-color: white; marker-line-width: 0;}"
    }

    layer.getSubLayer(0).set(subLayerOptions);

    l = layer.getSubLayer(0);

  }).on('error', function() {
    //log the error
  });

  $('#planned').click(function(){
    l.setSQL(queries.plannedWorks);
  });

  $('#current').click(function(){
    l.setSQL(queries.currentWorks);
  });

});
