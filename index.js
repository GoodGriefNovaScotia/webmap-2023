
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

var markerClusterOptions = {
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true
};

// // Set up Layer Groups
// // Categorical
// var allEvents = L.markerClusterGroup(markerClusterOptions);
// var eventsPets = L.featureGroup.subGroup(allEvents);
// var eventsParents = L.featureGroup.subGroup(allEvents);
// var eventsSpouses = L.featureGroup.subGroup(allEvents);
// var eventsChildren = L.featureGroup.subGroup(allEvents);
// var eventsFriends = L.featureGroup.subGroup(allEvents);
// var eventsOther = L.featureGroup.subGroup(allEvents);
// // In-person / Hybrid
// var eventsInPerson = L.markerClusterGroup(markerClusterOptions);
// var eventsHybrid = L.featureGroup.subGroup(allEvents);

// // Set up Layer Groups
// // Categorical
// var allEvents = L.markerClusterGroup(markerClusterOptions);
// var eventsPets = L.markerClusterGroup(markerClusterOptions);
// var eventsParents = L.markerClusterGroup(markerClusterOptions);
// var eventsSpouses = L.markerClusterGroup(markerClusterOptions);
// var eventsChildren = L.markerClusterGroup(markerClusterOptions);
// var eventsFriends = L.markerClusterGroup(markerClusterOptions);
// var eventsOther = L.markerClusterGroup(markerClusterOptions);
// // In-person / Hybrid
// var eventsInPerson = L.markerClusterGroup(markerClusterOptions);
// var eventsHybrid = L.markerClusterGroup(markerClusterOptions);

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

var layerSupport = new L.MarkerClusterGroup.LayerSupport();

// Initialize map
var map = L.map('map', {
  center: [44.6923, -62.6572],
  zoom: 7,
  layers: allEvents,
  maxZoom: 24
});

// Default Base Map
var defaultBaseMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
})
defaultBaseMap.addTo(map);

var customLayer = L.geoJson(null, {
    pointToLayer: function(feature, latlng){
    var category = feature.properties.categories;
    var inperson_n_h = feature.properties.inperson_n_h;
    var radius = 8;

    var markerOptions = {
      radius: radius,
      color: 'darkgrey',
      weight: 0.5,
      fillColor: '#f00',
      fillOpacity: 1
    };

    // if (eventsInPerson.hasLayer(this)) {
    //   radius = 8,
    //   // markerOptions.fillColor = '#00f'; // Blue
    //   markerOptions.fillOpacity= 0.3; // Transparent
    // }
    // if (eventsHybrid.hasLayer(this)) {
    //   radius = 24,
    //   // markerOptions.fillColor = '#800'; // Red
    //   markerOptions.fillOpacity= 0.3; // Transparent
    // }

    if (category == "Pets") {
      markerOptions.fillColor = '#0f0'; // Green
    } else if (category == "Parents"){
      markerOptions.fillColor = '#ff0'; // Yellow
    } else if (category == "Spouses / Significant Others"){
      markerOptions.fillColor = '#f80'; // Orange
    } else if (category == "Children"){
      markerOptions.fillColor = '#81a'; // Purple
    } else if (category == "Friends") {
      markerOptions.fillColor = '#8bf'; // Light Blue
    } else if (category == "Other") {
      markerOptions.fillColor = '#60f'; // Bluer purple
    }

    if (inperson_n_h == "h"){
      markerOptions.className ='shadow';
    }
    return L.circleMarker(latlng, markerOptions);
    },
  onEachFeature: function(feature, layer) {

    // Categories
    var category = layer.feature.properties.categories;
    var inperson_n_h = layer.feature.properties.inperson_n_h;

      // Pop-ups
      // Event Location
      var eventLocation = feature.properties.street + ", " + feature.properties.city + ", " + feature.properties.state + ", " + feature.properties.zipcode
      // In-person pop-up
      var popupContent = `<div class="wrapper">
      <div class="header">
        <div class="eventName">
        Event Name <br>
        <span class="eventTheme">` + feature.properties.categories + `</span>
        </div>
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
      <div class="footer">
      <button class="learnMoreBtn">
      Learn More...
      </button>
      <button class="buyTicketsBtn">
      Buy Tickets
      </button>
      </div>
    </div>`
    //Hybrid pop-up
    var hybridPopupContent = `<div class="wrapper">
    <div class="header">
    <div class="virtual">
    Virtual Option Available!
    </div>
    <div class="eventName">
    Event Name <br>
    <span class="eventTheme">` + feature.properties.categories + `</span>
    </div>
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
    <div class="footer">
    <button class="learnMoreBtn">
    Learn More...
    </button>
    <button class="buyTicketsBtn">
    Buy Tickets
    </button>
    </div>
  </div>`
	  
  if (inperson_n_h == "h") {
    layer.bindPopup(hybridPopupContent);
  } else if (inperson_n_h == "n") {
    layer.bindPopup(popupContent);
  }

    allEvents.addLayer(layer);
    // console.log("All points added to All Events layer.");

    // Categories separation
    if (category == "Pets") {
      eventsPets.addLayer(layer);
      // console.log("Pet Events layer populated.");
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
      // console.log("In Person");
    } else if (inperson_n_h == "h") {
      eventsHybrid.addLayer(layer);
      // console.log("Hybrid");
    }

    layerSupport.addTo(map);
    layerSupport.checkIn(allEvents);
    layerSupport.checkIn(eventsPets);
    layerSupport.checkIn(eventsParents);
    layerSupport.checkIn(eventsSpouses);
    layerSupport.checkIn(eventsChildren);
    layerSupport.checkIn(eventsFriends);
    layerSupport.checkIn(eventsOther);
    layerSupport.checkIn(eventsInPerson);
    layerSupport.checkIn(eventsHybrid);
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

    petsCircle = "<svg class='circle' width='10' height='10'> <circle cx='5' cy='5' r='4' stroke-width='0.5' stroke='darkgrey' fill='#0f0'/></svg>";
    parentsCircle = "<svg class='circle' width='10' height='10'> <circle cx='5' cy='5' r='4' stroke-width='0.5' stroke='darkgrey' fill='#ff0'/></svg>";
    spousesCircle = "<svg class='circle' width='10' height='10'> <circle cx='5' cy='5' r='4' stroke-width='0.5' stroke='darkgrey' fill='#f80'/></svg>";
    childrenCircle = "<svg class='circle' width='10' height='10'> <circle cx='5' cy='5' r='4' stroke-width='0.5' stroke='darkgrey' fill='#81a'/></svg>";
    friendsCircle = "<svg class='circle' width='10' height='10'> <circle cx='5' cy='5' r='4' stroke-width='0.5' stroke='darkgrey' fill='#8bf'/></svg>";
    otherCircle = "<svg class='circle' width='10' height='10'> <circle cx='5' cy='5' r='4' stroke-width='0.5' stroke='darkgrey' fill='#60f'/></svg>";
    hybridCircle = "<svg class='shadow' width='10' height='10'> <circle cx='5' cy='5' r='4' stroke-width='0.5' stroke='darkgrey' fill='white'/></svg>";

    var overlayMaps = {
      "All Events": allEvents,
      [petsCircle + "Pets"]: eventsPets,
      [parentsCircle + "Parents"]: eventsParents,
      [spousesCircle + "Spouses / Significant Others"]: eventsSpouses,
      [childrenCircle + "Children"]: eventsChildren,
      [friendsCircle + "Friends"]: eventsFriends,
      [otherCircle + "Other"]: eventsOther,
      "In-Person": eventsInPerson,
      [hybridCircle + "Hybrid (Virtual Option)"]: eventsHybrid
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

