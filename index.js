
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
//  var allEvents = L.featureGroup.subGroup(layerSupport);
//  var eventsPets = L.featureGroup.subGroup(layerSupport);
//  var eventsParents = L.featureGroup.subGroup(layerSupport);
//  var eventsSpouses = L.featureGroup.subGroup(layerSupport);
//  var eventsChildren = L.featureGroup.subGroup(layerSupport);
//  var eventsFriends = L.featureGroup.subGroup(layerSupport);
//  var eventsOther = L.featureGroup.subGroup(layerSupport);
 // In-person / Hybrid
 //var eventsInPerson = L.markerClusterGroup(markerClusterOptions);
 var eventsHybrid = L.featureGroup.subGroup(layerSupport);

// // Set up Layer Groups
// // Categorical
// // var allEvents = L.layerGroup();
// var eventsPets = L.layerGroup();
// var eventsParents = L.layerGroup();
// var eventsSpouses = L.layerGroup();
// var eventsChildren = L.layerGroup();
// var eventsFriends = L.layerGroup();
// var eventsOther = L.layerGroup();
// // In-person / Hybrid
// // var eventsInPerson = L.layerGroup();
// var eventsHybrid = L.layerGroup();

var layerSupport = new L.MarkerClusterGroup.LayerSupport(markerClusterOptions);

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

      if (inperson_n_h == "Both in-person and virtual"){
        return L.marker(latlng, {icon: virtualIcon});
      }

      return L.marker(latlng, {icon: GGIcon});
    },
  onEachFeature: function(feature, layer) {

    // Categories
    // var category = layer.feature.properties.categories;
    var inperson_n_h = layer.feature.properties.inperson_n_h;
    var link_reg = layer.feature.properties.reg_link;

      // Pop-ups
      // Event Location
      // var eventLocation = feature.properties.street + ", " + feature.properties.city + ", " + feature.properties.state + ", " + feature.properties.zipcode
      var eventLocation = feature.properties.location_name + ", " + feature.properties.full_address
      // In-person pop-up - no registration
      var popupContent = `<div class="wrapper">
      <div class="header">
        <div class="eventName">
        ` + feature.properties.event_name + `<br>
        <span class="eventTheme">` + feature.properties.public_y_n + `</span>
        </div>
        </div>
      <div class="photo">
        <img src='https://images.squarespace-cdn.com/content/v1/64513cfe109e8268a6a4d0fc/1686702891197-5I10H5UT5BKV0D6SBNSP/nataliia-kvitovska-ah9muNXpCP0-unsplash+%281%29.jpg?format=1500w'>
      </div>
      <div class="table-layout">
      <table>
        <tr>
          <th>Event Date:</th>
          <td>`+ feature.properties.date + `</td>
        </tr>
        <tr>
          <th>Event Organizer:</th>
          <td>` + feature.properties.organization + `</td>
        </tr>
        <tr>
          <th>Event Location:</th>
          <td>` + eventLocation + `</td>
        </tr>
      </table>
      </div>
      <div class="footer">
      <form action="`+ feature.properties.event_link + `">
        <button class="learnMoreBtn">
        Learn More...
        </button>
      </form>
      </div>
    </div>`
      // In-person pop-up - with registration
      var popupContentReg = `<div class="wrapper">
      <div class="header">
        <div class="eventName">
        ` + feature.properties.event_name + `<br>
        <span class="eventTheme">` + feature.properties.public_y_n + `</span>
        </div>
        </div>
      <div class="photo">
        <img src='https://images.squarespace-cdn.com/content/v1/64513cfe109e8268a6a4d0fc/1686702891197-5I10H5UT5BKV0D6SBNSP/nataliia-kvitovska-ah9muNXpCP0-unsplash+%281%29.jpg?format=1500w'>
      </div>
      <div class="table-layout">
      <table>
        <tr>
          <th>Event Date:</th>
          <td>`+ feature.properties.date + `</td>
        </tr>
        <tr>
          <th>Event Organizer:</th>
          <td>` + feature.properties.organization + `</td>
        </tr>
        <tr>
          <th>Event Location:</th>
          <td>` + eventLocation + `</td>
        </tr>
      </table>
      </div>
      <div class="footer">
      <form action="`+ feature.properties.event_link + `">
        <button class="learnMoreBtn">
        Learn More...
        </button>
      </form>
      <form action="` + feature.properties.reg_link + `">
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
    ` + feature.properties.event_name + `<br>
    <span class="eventTheme">` + feature.properties.public_y_n + `</span>
    </div>
  </div>
    <div class="photo">
      <img src='https://images.squarespace-cdn.com/content/v1/64513cfe109e8268a6a4d0fc/1686702891197-5I10H5UT5BKV0D6SBNSP/nataliia-kvitovska-ah9muNXpCP0-unsplash+%281%29.jpg?format=1500w'>
    </div>
    <div class="table-layout">
    <table>
      <tr>
        <th>Event Date:</th>
        <td>`+ feature.properties.date + `</td>
      </tr>
      <tr>
        <th>Event Organizer:</th>
        <td>Organizer #` + feature.properties.organization + `</td>
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
	  
  if (inperson_n_h == "Both in-person and virtual") {
    layer.bindPopup(hybridPopupContent);
  } 
  else if (link_reg != ""){
    layer.bindPopup(popupContentReg);
  }  
  else {
    layer.bindPopup(popupContent);
  }

    // allEvents.addLayer(layer);

    // Categories separation
    // if (category == "Pets") {
    //   eventsPets.addLayer(layer);
    // } else if (category == "Parents"){
    //   eventsParents.addLayer(layer);
    // } else if (category == "Spouses / Significant Others"){
    //   eventsSpouses.addLayer(layer);
    // } else if (category == "Children"){
    //   eventsChildren.addLayer(layer);
    // } else if (category == "Friends") {
    //   eventsFriends.addLayer(layer);
    // } else if (category == "Other") {
    //   eventsOther.addLayer(layer);
    // }

    // In-person / Hybrid separation
    // if (inperson_n_h == "n") {
    //   eventsInPerson.addLayer(layer);
    // } else 
    if (inperson_n_h == "Both in-person and virtual") {
      eventsHybrid.addLayer(layer);
    }

    layerSupport.addTo(map);
    // layerSupport.checkIn(allEvents);
    // // layerSupport.checkIn(eventsPets);
    // // layerSupport.checkIn(eventsParents);
    // // layerSupport.checkIn(eventsSpouses);
    // // layerSupport.checkIn(eventsChildren);
    // // layerSupport.checkIn(eventsFriends);
    // // layerSupport.checkIn(eventsOther);
    // // layerSupport.checkIn(eventsInPerson);
    layerSupport.checkIn(eventsHybrid);

      // map.addLayer(allEvents);
      // map.addLayer(eventsPets);
      // map.addLayer(eventsParents);
      // map.addLayer(eventsSpouses);
      // map.addLayer(eventsChildren);
      // map.addLayer(eventsFriends);
      // map.addLayer(eventsOther);
       map.addLayer(eventsHybrid);
  }
});

var runLayer = omnivore.csv('./responses.csv', null, customLayer)
  .on('ready', function() {

    map.fitBounds(runLayer.getBounds(), {padding: [50, 50]});

    var baseMaps = {
      "Default (OpenStreetMap)": defaultBaseMap,
      "OpenStreetMap HOT": OpenStreetMap_HOT,
      "Stamen Watercolor": Stamen_Watercolor
    };

    hybridCircle = "<svg class='shadow' width='10' height='10'> <circle cx='5' cy='5' r='4' stroke-width='0.5' stroke='darkgrey' fill='white'/></svg>";

    var groupedOverlays = {
      "All Events": {
        // "Pets": eventsPets,
        // "Parents": eventsParents,
        // "Spouses / Significant Others": eventsSpouses,
        // "Children": eventsChildren,
        // "Friends": eventsFriends,
        // "Other": eventsOther,
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
      position: "topleft",
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

  // var sliderControl = L.control.sliderControl({position: "topleft", layer: layerSupport, range: true});

  // //Make sure to add the slider to the map ;-)
  // map.addControl(sliderControl);

  // sliderControl.options.markers.sort(function(a, b) {
  //   return (a.feature.properties.time > b.feature.properties.time);
  // });
  
  // //And initialize the slider
  // sliderControl.startSlider();