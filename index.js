
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
  showCoverageOnHover: true,
  zoomToBoundsOnClick: true,
  // spiderLegPolylineOptions: list(weight = 1.5, color = "#222", opacity = 0.5),
  freezeAtZoom: false,
  removeOutsideVisibleBounds: false
};

// // Set up Layer Groups
// // Categorical
var allEvents = L.layerGroup();
var eventsHybrid = L.layerGroup();
var eventsVirtual = L.layerGroup();

var layerSupport = new L.MarkerClusterGroup.LayerSupport(markerClusterOptions);

// Initialize map
var map = L.map('map', {
  center: [44.6923, -62.6572],
  zoom: 7,
  // layers: allEvents,
  maxZoom: 24,
  autoPan: false,
  zoomControl: false,
  tap: false
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

      if (inperson_n_h != "In-person"){
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
        <img src='header_square.jpg'>
      </div>
      <div class="table-layout">
      <table>
        <tr>
          <th>Event Date:</th>
          <td>`+ feature.properties.date + `</td>
        </tr>
        <tr>
          <th>Event Location:</th>
          <td>` + eventLocation + `</td>
        </tr>
      </table>
      </div>
      <div class="footer">
      <form action="`+ feature.properties.event_link + `" target="_blank">
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
        <img src='header_square.jpg'>
      </div>
      <div class="table-layout">
      <table>
        <tr>
          <th>Event Date:</th>
          <td>`+ feature.properties.date + `</td>
        </tr>
        <tr>
          <th>Event Location:</th>
          <td>` + eventLocation + `</td>
        </tr>
      </table>
      </div>
      <div class="footer">
      <form action="`+ feature.properties.event_link + `" target="_blank">
        <button class="learnMoreBtn">
        Learn More...
        </button>
      </form>
      <form action="` + feature.properties.reg_link + `" target="_blank">
      </button>
      <button class="buyTicketsBtn">
      Reserve Your Spot
      </button>
      </form>
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
      <img src='header_square.jpg'>
    </div>
    <div class="table-layout">
    <table>
      <tr>
        <th>Event Date:</th>
        <td>`+ feature.properties.date + `</td>
      </tr>
      <tr>
        <th>Event Location:</th>
        <td>` + eventLocation + `</td>
      </tr>
    </table>
    </div>
    <div class="footer">
    <form action="`+ feature.properties.event_link + `" target="_blank">
    <button class="learnMoreBtn">
    Learn More...
    </button>
    <form action="` + feature.properties.reg_link + `" target="_blank">
    </button>
    <button class="buyTicketsBtn">
    Reserve Your Spot
    </button>
    </form>
    </div>
  </div>`
  var virtualPopupContent = `<div class="wrapper">
  <div class="header">
  <div class="eventName">
  ` + feature.properties.event_name + `<br>
  <span class="eventTheme">` + feature.properties.public_y_n + `</span>
  </div>
</div>
  <div class="photo">
    <img src='header_square.jpg'>
  </div>
  <div class="table-layout">
  <table>
    <tr>
      <th>Event Date:</th>
      <td>`+ feature.properties.date + `</td>
    </tr>
    <tr>
      <th>Event Location:</th>
      <td>Virtual</td>
    </tr>
  </table>
  </div>
  <div class="footer">
  <form action="`+ feature.properties.event_link + `" target="_blank">
  <button class="learnMoreBtn">
  Learn More...
  <form action="` + feature.properties.reg_link + `" target="_blank">
  </button>
  <button class="buyTicketsBtn">
  Reserve Your Spot
  </button>
  </form>
  </div>
</div>`
var virtualPopupContentNoReg = `<div class="wrapper">
<div class="header">
<div class="eventName">
` + feature.properties.event_name + `<br>
<span class="eventTheme">` + feature.properties.public_y_n + `</span>
</div>
</div>
<div class="photo">
  <img src='header_square.jpg'>
</div>
<div class="table-layout">
<table>
  <tr>
    <th>Event Date:</th>
    <td>`+ feature.properties.date + `</td>
  </tr>
  <tr>
    <th>Event Location:</th>
    <td>Virtual</td>
  </tr>
</table>
</div>
<div class="footer">
<form action="`+ feature.properties.event_link + `" target="_blank">
<button class="learnMoreBtn">
Learn More...
</button>
</div>
</div>`
  

  // function createPopUpContent(attributes, template){
  //   let content = document.createElement('div');
  //   content.innerHTML = template;

  //   if (inperson_n_h == "Both in-person and virtual"){
  //     const virtualContainer = content.querySelector('#virtual');
  //     virtualContainer.classList.remove('hidden');
  //   }
  //   if (attributes.photo != "") {
  //     const photoContainer = content.querySelector('#photo');
  //     photoContainer.innerHTML = `<img src ="${attributes.photo}" alt="Custom Photo">`;
  //   }
  //   if (attributes.photo == "") {
  //     const photoContainer = content.querySelector('#photo');
  //     photoContainer.innerHTML = `<img src ="header_square.jpg" alt="Default Photo">`;
  //   }
  //   if (link_reg != ""){
  //     const virtualContainer = content.querySelector('#virtual');
  //     virtualContainer.classList.remove('hidden');
  //   }
  //   return content.innerHTML;
  // }
  // const popupTemplate = document.getElementById('popup-template').innerHTML;

  function openPopupAndCenterMap(layer) {

    // Get the target LatLng for the popup
    var targetLatLng = layer.getLatLng();
  
    // Open the popup after the map has panned
    setTimeout(function () {
      // if (!isPopupManuallyClosed) {
      layer.openPopup();
      // }
    }, 300); // Adjust the delay as needed (3 seconds in this example)
  }

  if (feature.properties.full_address == "" && link_reg != ""){
    layer.bindPopup(virtualPopupContent); // keepInView: true
  }  
  else if (feature.properties.full_address == "" && link_reg == ""){
    layer.bindPopup(virtualPopupContentNoReg);
  }  
  else if (inperson_n_h == "Both in-person and virtual") {
    layer.bindPopup(hybridPopupContent);
  } 
  else if (link_reg != ""){
    layer.bindPopup(popupContentReg);
  }  
  else {
    layer.bindPopup(popupContent);
  }

  // layer.bindPopup(createPopUpContent(feature, popupTemplate));

  layer.on('mouseover', function (e) {
    openPopupAndCenterMap(layer);
  });

    allEvents.addLayer(layer);

    // Categories separation

    // In-person / Hybrid separation
    if (inperson_n_h == "Both in-person and virtual") {
      eventsHybrid.addLayer(layer);
    }
    else if (inperson_n_h != "In-person") {
      eventsVirtual.addLayer(layer);
    }

    layerSupport.addTo(map);
    layerSupport.checkIn(allEvents);
    layerSupport.checkIn(eventsVirtual)

    layerSupport.checkIn(eventsHybrid);

      map.addLayer(allEvents);
  }
});

var runLayer = omnivore.csv('./responses.csv', null, customLayer)
  .on('ready', function() {

    var baseMaps = {
      "Default (OpenStreetMap)": defaultBaseMap,
      "OpenStreetMap HOT": OpenStreetMap_HOT,
      "Stamen Watercolor": Stamen_Watercolor
    };

    hybridCircle = "<svg class='shadow' width='10' height='10'> <circle cx='5' cy='5' r='4' stroke-width='0.5' stroke='darkgrey' fill='white'/></svg>";

    var groupedOverlays = {
      "Events": {
        "All Events": allEvents,
        [hybridCircle + "Virtual / Virtual Option"]: eventsVirtual
      }
    }

    var options = {
      groupCheckboxes: false
    };

    L.control.groupedLayers(baseMaps, groupedOverlays, options).addTo(map);
    
    // custom zoom bar control that includes a Zoom Home function
L.Control.zoomHome = L.Control.extend({
  options: {
      position: 'topleft',
      zoomInText: '+',
      zoomInTitle: 'Zoom in',
      zoomOutText: '-',
      zoomOutTitle: 'Zoom out',
      zoomHomeText: '<i class="fa fa-home" style="line-height:1.65;"></i>',
      zoomHomeTitle: 'Zoom home'
  },

  onAdd: function (map) {
      var controlName = 'gin-control-zoom',
          container = L.DomUtil.create('div', controlName + ' leaflet-bar'),
          options = this.options;

      this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
      controlName + '-in', container, this._zoomIn);
      this._zoomHomeButton = this._createButton(options.zoomHomeText, options.zoomHomeTitle,
      controlName + '-home', container, this._zoomHome);
      this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
      controlName + '-out', container, this._zoomOut);

      this._updateDisabled();
      map.on('zoomend zoomlevelschange', this._updateDisabled, this);

      return container;
  },

  onRemove: function (map) {
      map.off('zoomend zoomlevelschange', this._updateDisabled, this);
  },

  _zoomIn: function (e) {
      this._map.zoomIn(e.shiftKey ? 3 : 1);
  },

  _zoomOut: function (e) {
      this._map.zoomOut(e.shiftKey ? 3 : 1);
  },

  _zoomHome: function (e) {
      map.setView([44.6923, -62.6572], 7);
  },

  _createButton: function (html, title, className, container, fn) {
      var link = L.DomUtil.create('a', className, container);
      link.innerHTML = html;
      link.href = '#';
      link.title = title;

      L.DomEvent.on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
          .on(link, 'click', L.DomEvent.stop)
          .on(link, 'click', fn, this)
          .on(link, 'click', this._refocusOnMap, this);

      return link;
  },

  _updateDisabled: function () {
      var map = this._map,
          className = 'leaflet-disabled';

      L.DomUtil.removeClass(this._zoomInButton, className);
      L.DomUtil.removeClass(this._zoomOutButton, className);

      if (map._zoom === map.getMinZoom()) {
          L.DomUtil.addClass(this._zoomOutButton, className);
      }
      if (map._zoom === map.getMaxZoom()) {
          L.DomUtil.addClass(this._zoomInButton, className);
      }
  }
});
// add the new control to the map
var zoomHome = new L.Control.zoomHome();
zoomHome.addTo(map);
    
    
    
    var circleCenter = [43.995880760718585, -62.365874593318644]

    var circleOptions = {
      color: 'blue',
      fillColor: 'blue',
      fillOpacity: 0.3
   }

   var circle = L.circle(circleCenter, 50000, circleOptions).bindTooltip("Virtual Events", {direction: "center", permanent: true, offset: [0, -50] });
   ;

   circle.addTo(map);

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
      if (label.textContent.trim() === 'Events') {
        inputs[i].checked = true;
        break;
      }
    }

    // var extentControl = L.Control.extend({
    //   options: {
    //       position: 'bottomleft'
    //   },
    //   onAdd: function (map) {
    //       var llBounds = map.getBounds();
    //       var container = L.DomUtil.create('div', 'extentControl');
    //       $(container).css('background', 'url(i/extent.png) no-repeat 50% 50%').css('width', '26px').css('height', '26px').css('outline', '1px black');
    //       $(container).on('click', function () {
    //           map.fitBounds(llBounds);
    //       });
    //       return container;
    //      }
    //   })
      
    //   map.addControl(new extentControl());
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

  // function closePopup() {
  //   if(map.isPopupOpen()) {
  //     map.closePopup
  //     }
  // }