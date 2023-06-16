var map = L.map('map', {
  center: [36, -3], // EDIT latitude, longitude to re-center map
  zoom: 10,  // EDIT from 1 to 18 -- decrease to zoom out, increase to zoom in
  scrollWheelZoom: true,
  tap: false
});

var controlLayers = L.control.layers(null, null, {
  position: "topright",
  collapsed: false
}).addTo(map);

// Display Carto basemap tiles with light features and labels
var light = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
}).addTo(map); // EDIT - insert or remove ".addTo(map)" before the last semicolon to display by default
controlLayers.addBaseLayer(light, 'Carto Light basemap');

// Stamen colored terrain basemap tiles with labels
var terrain = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
}); // EDIT - insert or remove ".addTo(map)" before the last semicolon to display by default
controlLayers.addBaseLayer(terrain, 'Stamen Terrain basemap');

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
controlLayers.addBaseLayer(Esri_WorldImagery, 'Esri');

// Read markers data from map.txt
$.get('map.txt', function (csvString) {
  var data = Papa.parse(csvString, {
    header: true,
    dynamicTyping: true,
    keepEmptyRows: false,
    skipEmptyLines: true,
    delimiter: "|"
  }).data;

  // Create an empty filter object with gateways and dates as properties to filter in the map
  // TODO: Future extensions (min/max RSSI for example to create a better legend)
  var gw = {};

  // Optional: Get the first gateway location for centering the map; better set it directly to the right center when initializing (faster)
  map.flyTo([data[0]['gwlat'], data[0]['gwlon']], 12);

  for (var i in data) {
    var row = data[i];

    var polylinePoints = [
      [row.gwlat, row.gwlon],
      [row.nodelat, row.nodelon]
    ];

    var gwid = row.id;
    var gweui = row.eui;
    var dategroup = "Period " + row.time.getFullYear() + "-" + row.time.getMonth();

    var icolor = rssi2color(row.rssi);
    var polyline = L.polyline(polylinePoints, { color: icolor, tags: [gwid, dategroup] }).bindPopup("RSSI " + row.rssi + "<br/>ID " + gwid + "<br/>eui-" + gweui);
    polyline.addTo(map);

    // Add to the filter object
    gw[gwid] = true;
    gw[dategroup] = true;
  }

  // Collect and push into filter group
  var filterarray = [];
  for (var gwprop in gw) {
    filterarray.push(`${gwprop}`);
  }
  filterarray.sort();
  var filterbox = L.control.tagFilterButton({ data: filterarray, filterOnEveryClick: true }).addTo(map);
});

map.attributionControl.setPrefix('<a href="readme.txt" target="_blank">Readme</a>');

var legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  labels = ['<strong>RSSI</strong>'];
  categories = [-50, -60, -70, -80, -90, -100, -110, -120, -130, -140];

  for (var i = 0; i < categories.length; i++) {
    var icolor = rssi2color(categories[i]);
    div.innerHTML += labels.push(
      '<i style="background:' + icolor + ';">' + "&nbsp;&nbsp;&nbsp;&nbsp;" + '</i> ' +
      (categories[i] ? categories[i] : '+')
    );
  }

  div.innerHTML = labels.join('<br>');
  return div;
};

legend.addTo(map);

function rssi2color(rssi) {
  intensity = fmap(rssi, -130, -80, 0, 90);
  return hslToHex(intensity, 100, 80);
}

function fmap(x, in_min, in_max, out_min, out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
