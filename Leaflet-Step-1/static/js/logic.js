// Import earthquake dataset
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(link, function(data){

  // Define different map layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });
  
  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });
  
  var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });
  
// Define a baseMaps object to hold our base layers
var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Satellite": satellite
  };

function markerSize(magnitude) {
    return magnitude * 4;
  };

 // Function that will determine the color of the markers 
function markerColor(magnitude) {
    if (magnitude > 5) {
        return '#FE0422'
    } else if (magnitude > 4) {
        return '#FE5704'
    } else if (magnitude > 3) {
        return '#FA7A1C '
    } else if (magnitude > 2) {
        return '#FABD1C'
    } else if (magnitude > 1) {
        return '#FCF105'
    } else {
        return '#9BFC05'
    }
};

var earthquakes=L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, { radius: markerSize(feature.properties.mag) })
    }, 
    style: function (feature) {
      return {
          fillColor: markerColor(feature.properties.mag),
          fillOpacity: 0.7,
          weight: 0.1,
          color: 'black'

      }
  },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
          "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
          "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
  }
  });
   

var myMap = L.map("map", {
  center: [
    37.09, -95.71
    ],
    zoom: 4,
    layers: [streetmap,earthquakes]
  });

// Create overlay object to hold our overlay layer
var overlayMaps = {
  Earthquakes: earthquakes
  };
  
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
  }).addTo(myMap);
});