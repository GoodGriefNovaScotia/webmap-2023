
// OSM HOT Basemap
var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
});

// Stamen Watercolor Basemap
var Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 16,
	ext: 'jpg'
});

// Set up Layer Groups
// Categorical
var allEvents = L.layerGroup();
var eventsPets = L.layerGroup();
var eventsParents = L.layerGroup();
var eventsSpouses = L.layerGroup();
var eventsChildren = L.layerGroup();
var eventsFriends = L.layerGroup();
var eventsOther = L.layerGroup();
// In-person / Hybrid
var eventsInPerson = L.layerGroup();
var eventsHybrid = L.layerGroup();

// Initialize map
var map = L.map('map', {
  center: [44.6923, -62.6572],
  zoom: 7,
  layers: allEvents
});

// Default Base Map
var defaultBaseMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
})
defaultBaseMap.addTo(map);

var customLayer = L.geoJson(null, {
  onEachFeature: function(feature, layer) {

    // Categories
    var category = layer.feature.properties.categories;
    var inperson_n_h = layer.feature.properties.inperson_n_h;

    // Pop-up
    var eventLocation = feature.properties.street + ", " + feature.properties.city + ", " + feature.properties.state + ", " + feature.properties.zipcode
    var popupContent = `<div class="wrapper">
    <div class="header">
      Event Name <br>
      <span class="eventTheme">` + feature.properties.categories + `</span>
    </div>
    <div class="photo">
      <img src='https://images.squarespace-cdn.com/content/v1/64513cfe109e8268a6a4d0fc/1686702891197-5I10H5UT5BKV0D6SBNSP/nataliia-kvitovska-ah9muNXpCP0-unsplash+%281%29.jpg?format=1500w'>
    </div>
    <div class="table-layout">
    <table>
      <tr>
        <th>Event Date:</th>
        <td>`+ feature.properties.markerid + `</td>
      </tr>
      <tr>
        <th>Event Organizer:</th>
        <td>Organizer #` + feature.properties.storeid + `</td>
      </tr>
      <tr>
        <th>Event Location:</th>
        <td>` + eventLocation + `</td>
      </tr>
    </table>
    </div>
  </div>`
    layer.bindPopup(popupContent);

    allEvents.addLayer(layer);

    // Categories separation
    if (category == "Pets") {
      eventsPets.addLayer(layer);
    } else if (category == "Parents"){
      eventsParents.addLayer(layer);
    } else if (category == "Spouses / Significant Others"){
      eventsSpouses.addLayer(layer);
    } else if (category == "Children"){
      eventsChildren.addLayer(layer);
    } else if (category == "Friends") {
      eventsFriends.addLayer(layer);
    } else if (category == "Other") {
      eventsOther.addLayer(layer);
    }

    // In-person / Hybrid separation
    if (inperson_n_h == "n") {
      eventsInPerson.addLayer(layer);
    } else if (inperson_n_h == "h") {
      eventsHybrid.addLayer(layer);
    }
  }
});

var runLayer = omnivore.csv('./test_data.csv', null, customLayer)
  .on('ready', function() {

    map.fitBounds(runLayer.getBounds());

    var baseMaps = {
      "Default (OpenStreetMap)": defaultBaseMap,
      "OpenStreetMap HOT": OpenStreetMap_HOT,
      "Stamen Watercolor": Stamen_Watercolor
    };

    var overlayMaps = {
      "All Events": allEvents,
      "Pets": eventsPets,
      "Parents": eventsParents,
      "Spouses / Significant Others": eventsSpouses,
      "Children": eventsChildren,
      "Friends": eventsFriends,
      "Other": eventsOther,
      "In-Person": eventsInPerson,
      "Hybrid": eventsHybrid
    };

    var layerControl = L.control.layers(baseMaps, overlayMaps, {collapsed:true}).addTo(map);
    // layerControl.addOverlay(allEvents, "All Events") // Add "All Events" layer to the control manually

    // Find the input element for the "All Events" overlay and set its checked property to true
    var inputs = document.getElementsByClassName('leaflet-control-layers-overlays')[0].getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
      var label = inputs[i].parentNode;
      if (label.textContent.trim() === 'All Events') {
        inputs[i].checked = true;
        break;
      }
    }
})
  .addTo(map);

