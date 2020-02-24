// Creating map object
var map = L.map("map", {
  center: [36.7783, -119.4179],
  zoom: 5
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);

// Import earthquake dataset
var link = "static/data/all_week.geojson";

// Function that will determine the color of the markers
function marker(magnitude) {

  switch (magnitude) {
  case magnitude<0:
    return "#F8F88A";
  case magnitude<1:
    return "#FFE173";
  case magnitude<2:
    return "#FFC65C";
  case magnitude<3:
    return "#FFAA0C";
  case magnitude<4:
    return "#FB841B";
  case magnitude<5:
    return "#F9743A";
  case magnitude>=5:
    return "#FA1405";
  default:
    return "#05FAC6";
  }
};

// Grabbing our GeoJSON data.
d3.json(link, function(data) {
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Style each feature
    style: function(feature) {
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color the markers
        fillColor: marker(properties.mag),
        fillOpacity: 1.0,
        weight: 1.5,
		// Adjust radius
        radius: properties.mag * 10000 // just for testing; to be adjusted later
      };
    },
    // Called on each feature
    onEachFeature: function(feature, layer) {
      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5
          });
        }
      });
      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup("<h1>" + properties.place + "</h1> <hr> <h2>" + properties.mag + "</h2>");

    }
  }).addTo(map);
});
