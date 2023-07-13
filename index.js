
const apiKey = "AAPK8bbb74889b114972a097d3b569b1f56cEK43n-TDHRsY6priZyHNqn5cP4439uEmTkqYOqWMIv2tAAMgwJNO8C8jqXKjnBXV";

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

// Set up Layer Groups
// Categorical
// var allEvents = L.layerGroup();
var eventsPets = L.layerGroup();
var eventsParents = L.layerGroup();
var eventsSpouses = L.layerGroup();
var eventsChildren = L.layerGroup();
var eventsFriends = L.layerGroup();
var eventsOther = L.layerGroup();
// In-person / Hybrid
// var eventsInPerson = L.layerGroup();
var eventsHybrid = L.layerGroup();

var layerSupport = new L.MarkerClusterGroup.LayerSupport();

// Initialize map
var map = L.map('map', {
  center: [44.6923, -62.6572],
  zoom: 7,
  // layers: allEvents,
  maxZoom: 24
});

// Default Base Map
var defaultBaseMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
})
defaultBaseMap.addTo(map);


var MarkerIcon = L.Icon.extend({
  options: {
    iconSize: [50, 50],
    iconAnchor: [0, 0],
    popupAnchor: [0,0]
  }
})

var GGIcon = new MarkerIcon({iconUrl: 'GG-icon.png'});

var virtualIcon = new MarkerIcon({iconUrl: 'GG-icon.png', className: 'shadow'});

var customLayer = L.geoJson(null, {
    pointToLayer: function(feature, latlng){

      var inperson_n_h = feature.properties.inperson_n_h;

      if (inperson_n_h == "h"){
        return L.marker(latlng, {icon: virtualIcon});
      }

      return L.marker(latlng, {icon: GGIcon});
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
      Reserve Your Spot
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
    Reserve Your Spot
    </button>
    </div>
  </div>`
	  
  if (inperson_n_h == "h") {
    layer.bindPopup(hybridPopupContent);
  } else if (inperson_n_h == "n") {
    layer.bindPopup(popupContent);
  }

    // allEvents.addLayer(layer);

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
    // if (inperson_n_h == "n") {
    //   eventsInPerson.addLayer(layer);
    // } else 
    if (inperson_n_h == "h") {
      eventsHybrid.addLayer(layer);
    }

    layerSupport.addTo(map);
    // layerSupport.checkIn(allEvents);
    layerSupport.checkIn(eventsPets);
    layerSupport.checkIn(eventsParents);
    layerSupport.checkIn(eventsSpouses);
    layerSupport.checkIn(eventsChildren);
    layerSupport.checkIn(eventsFriends);
    layerSupport.checkIn(eventsOther);
    // layerSupport.checkIn(eventsInPerson);
    layerSupport.checkIn(eventsHybrid);

      // map.addLayer(allEvents);
      map.addLayer(eventsPets);
      map.addLayer(eventsParents);
      map.addLayer(eventsSpouses);
      map.addLayer(eventsChildren);
      map.addLayer(eventsFriends);
      map.addLayer(eventsOther);
      map.addLayer(eventsHybrid);
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

    hybridCircle = "<svg class='shadow' width='10' height='10'> <circle cx='5' cy='5' r='4' stroke-width='0.5' stroke='darkgrey' fill='white'/></svg>";

    var groupedOverlays = {
      "All Events": {
        "Pets": eventsPets,
        "Parents": eventsParents,
        "Spouses / Significant Others": eventsSpouses,
        "Children": eventsChildren,
        "Friends": eventsFriends,
        "Other": eventsOther,
        [hybridCircle + "Hybrid (Virtual Option)"]: eventsHybrid
      }
    }

    var options = {
      // exclusiveGroups: ["Virtual"],
      groupCheckboxes: true
    };

    L.control.groupedLayers(baseMaps, groupedOverlays, options).addTo(map);
    // var layerControl = L.control.layers(baseMaps, overlayMaps, {collapsed:true}).addTo(map);
    
    const searchControl = L.esri.Geocoding.geosearch({
      position: "topright",
      placeholder: "Enter an address or place e.g. 1 York St",
      useMapBounds: false,
      providers: [
        L.esri.Geocoding.arcgisOnlineProvider({
          apikey: apiKey,
          nearby: {
            lat: -33.8688,
            lng: 151.2093
          }
        })
      ]
    }).addTo(map);
    //Find the input element for the "All Events" overlay and set its checked property to true
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