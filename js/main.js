// Pexels API key
// 563492ad6f9170000100000157d4d535979146c0a53ce90ae914527d
// fetch

window.addEventListener('DOMContentLoaded', (event) => {
    
  // Sidenav
  const sideNav = document.querySelector('.sidenav');
  M.Sidenav.init(sideNav, {});
  
  // Slider
  const slider = document.querySelector('.slider');
  M.Slider.init(slider, {
      indicators: false,
      height: 650,
      transition: 500,
      interval: 6000
  });
});


var map;
var markers = [];
var autocomplete = [];
var autocompleteOptions = {
  //componentRestrictions: {country: "az"}
};
let geocodeObject = [];
waypoints = [];
let destinationInfo = [];

let latLngArray = [];

const startingPoint = document.querySelector('#inputStartingPoint');

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// multiple waypoint start here
$(document).ready(function(){
  // Select starting point input
  // on page load
  // startingPoint.focus();


  $('.add_more_waypoint').on('click', function(){
      // Getting last waypoint no
      last_waypoint_no = parseInt($('.total_waypoint').val()) + 1;
      console.log("Adding waypoint value-->"+last_waypoint_no);
      var myhtml = "<div class='trip_loopn'><h4>Waypoint #: "+
         last_waypoint_no +
         " : </h4><input class='controls form-control pac-input' type='text' placeholder='Search Box'><h4> Waypoint " +
          last_waypoint_no +
          "  Nearest Address</h4><input class='controls form-control address" +
          last_waypoint_no +
          "' type='text' placeholder='Waypoint " +
          last_waypoint_no +
          " Nearest address'><input TYPE='hidden' name='latitude"+last_waypoint_no+
          "' class='latitude"+last_waypoint_no+
          " form-control' value /><input type='hidden' name='longitude"+
          last_waypoint_no+
          "' class='longitude"+last_waypoint_no+" form-control' value /><input type='hidden' name='marker_status"+last_waypoint_no+"' class='form-control' id='info'/><input type='hidden' name='my_waypoint_no' class='my_waypoint_no' value='"+last_waypoint_no+"'></input></div>";
      // appending new waypoint html
      $('.add_waypoint_container').append(myhtml);
      var newInput = [];
      var newEl = $('.pac-input')[last_waypoint_no];
      newInput.push(newEl);
      setupAutocomplete(autocomplete, newInput, 0, last_waypoint_no);
      // adding new waypoint
      $('.total_waypoint').val(last_waypoint_no);
  });

});

function update_way_addressfun(latlng_data, way_no){
  $('.latitude'+way_no).val(latlng_data.lat());
  $('.longitude'+way_no).val(latlng_data.lng());
  geocoder.geocode({
  latLng: latlng_data
  }, function(responses) {
      if (responses && responses.length > 0) {
          current_location = responses[0].formatted_address;
          // waypoints.push(current_location);
          update_way_address(current_location, way_no)
      }
  });
}

function update_way_address(str, way_no) {
  console.log(str+"<>"+way_no);
  $('.address'+way_no).val(str);
}

function setupAutocomplete(autocomplete, inputs, i, last_waypoint_no) {
  console.log('setupAutocomplete...');

      // autocomplete[i] = new google.maps.places.Autocomplete(inputs[i], autocompleteOptions);
      // Saved My DAY
      autocomplete.push(new google.maps.places.Autocomplete(inputs[i], autocompleteOptions));
      var idx = autocomplete.length - 1;
      //autocomplete[i].bindTo('bounds', map);
      autocomplete[idx].bindTo('bounds', map);

      google.maps.event.addListener(autocomplete[idx], 'place_changed', function() {
          console.log(last_waypoint_no, "<--- Waypoint ");
          var place_n = autocomplete[idx].getPlace();
          // This will return the nearest address and add as waypoint
          update_way_addressfun(place_n.geometry.location, last_waypoint_no);
      });
  }

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

var geocoder = new google.maps.Geocoder();




function geocodePosition(pos,box_no) {
geocoder.geocode({
  latLng: pos
}, function(responses) {
  if (responses && responses.length > 0) {
      // geocodeObject.push(responses);
      if(box_no == '1'){
          updateMarkerAddress1(responses[0].formatted_address);
      }
      else{
          updateMarkerAddress2(responses[0].formatted_address);
      }

  } else {
      if(box_no == '1'){
          updateMarkerAddress1('Cannot determine address at this location.');
      }
      else{
          updateMarkerAddress2('Cannot determine address at this location.');
      }
  }
});
}

function updateMarkerPosition(latLng) {
  var str =  latLng.lat() +" "+ latLng.lng();
$('#info').val(str);
}

function updateMarkerAddress1(str) {
$('#address1').val(str);
}
function updateMarkerAddress2(str) {
$('#address2').val(str);
}
// drag end
  var mj;
  var directionsDisplay;
  var directionsService = new google.maps.DirectionsService();
  var rendererOptions = {
    draggable: true
  };

function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
  var catarman = new google.maps.LatLng(12.379054, 124.820326);
  var mapOptions = {
    zoom: 11,
    center: catarman
  }

map = new google.maps.Map(document.getElementById('map-canvas'), {
  mapTypeId: google.maps.MapTypeId.ROADMAP,
  zoom: 11,
  center: catarman
});

// direction service code
directionsDisplay.setMap(map);
// search box defined here
var input1 = document.querySelector('#inputStartingPoint');
var input2 = document.querySelector('#inputDestination');
// map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
var searchBox1 = new google.maps.places.SearchBox((input1));
var searchBox2 = new google.maps.places.SearchBox((input2));

// search function start here
google.maps.event.addListener(searchBox1, 'places_changed', function() {
  var places = searchBox1.getPlaces();
  // console.log("searchbox 1: " + JSON.stringify(places));
  geocodeObject.push(places);

  if (places.length == 0) {
    return;
  }
  for (var i = 0, marker; marker = markers[i]; i++) {
    marker.setMap(null);
  }
  // For each place, get the icon, place name, and location.
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0, place; place = places[i]; i++) {
    // Create a marker for each place.
     marker = new google.maps.Marker({
      map: map,
      title: place.name,
      position: place.geometry.location,
      draggable: true
    });
  $(".latitude").val(place.geometry.location.lat());
  $(".longitude").val(place.geometry.location.lng());
  updateMarkerPosition(marker.getPosition());
  geocodePosition(marker.getPosition(),'1');

google.maps.event.addListener(marker, 'dragend', function() {
  geocodePosition(marker.getPosition(),'1');
  $(".latitude").val(marker.getPosition().lat());
  $(".longitude").val(marker.getPosition().lat());
});
markers.push(marker);
bounds.extend(place.geometry.location);
  }
  if($('#address2').val().length > 0 && $('#address2').val() != 'undefined')
  {
      console.log("searchbox 1 make route");
      setTimeout(function() {
          calcRoute();
      }, 500);
  }
  else{
      map.fitBounds(bounds);
      map.setZoom(9);
  }
});


google.maps.event.addListener(searchBox2, 'places_changed', function() {

let places1 = searchBox2.getPlaces(),
    destination = places1[0].geometry.location;
// console.log("searchbox 2: " + JSON.stringify());
geocodeObject.push(places1);

if (places1.length == 0) {
  return;
}
for (var i = 0, marker; marker = markers[i]; i++) {
  marker.setMap(null);
}
// For each place, get the icon, place name, and location.
var bounds = new google.maps.LatLngBounds();
for (var i = 0, place; place = places1[i]; i++) {
  // Create a marker for each place.
  marker = new google.maps.Marker({
        map: map,
        title: place.name,
        position: place.geometry.location,
        draggable: true
  });
  $(".latitude2").val(place.geometry.location.lat());
  $(".longitude2").val(place.geometry.location.lng());
  updateMarkerPosition(marker.getPosition());
  geocodePosition(marker.getPosition(),'2');

  google.maps.event.addListener(marker, 'dragend', function() {
    geocodePosition(marker.getPosition(),'2');
    $(".latitude2").val(marker.getPosition().lat());
    $(".longitude2").val(marker.getPosition().lat());
  });
  markers.push(marker);
  bounds.extend(place.geometry.location);
}
  if($('#address1').val().length > 0 && $('#address1').val() != 'undefined')
  {
      console.log("searchbox 2 make route");
      setTimeout(function() {
          calcRoute();
          distanceMatrix();
          console.log("destination pos: " + JSON.stringify(destination));
          getNearbyPlaces(destination);
          
      }, 500);
  }
  else{
      map.fitBounds(bounds);
      map.setZoom(9);
  }
});
//   google.maps.event.addListener(map, 'bounds_changed', function() {
//   var bounds = map.getBounds();
//   searchBox2.setBounds(bounds);
//   map.setZoom(10);
// });



}
//initial function close here
// calculate route function

// get distance and duration
function distanceMatrix(){
var start = $('#address1').val();
var end = $('#address2').val();

var origin1 = new google.maps.LatLng(latLngArray[0]);
var origin2 = start;
var destinationA = end;
var destinationB = new google.maps.LatLng(latLngArray[1]);

var service = new google.maps.DistanceMatrixService();
service.getDistanceMatrix(
  {
    origins: [origin1, origin2],
    destinations: [destinationA, destinationB],
    travelMode: 'DRIVING',
    // transitOptions: TransitOptions,
    // drivingOptions: DrivingOptions,
    // unitSystem: UnitSystem,
    // avoidHighways: Boolean,
    // avoidTolls: Boolean,
  }, function callback(response, status) {
    // See Parsing the Results for
    // the basics of a callback function.
    console.log('distance matrix: ' + status);
    console.log(response);
    console.log("array: " + JSON.stringify(response.rows[1].elements));
    let destinationObject = response.rows[1].elements[0],
        destinationDistance = destinationObject.distance,
        destinationDuration = destinationObject.duration;


    // console.log("dd: " + JSON.stringify(destinationDistance) + JSON.stringify(destinationDuration));
    // needs validation
    destinationInfo.push({
      label: "duration",
      value: destinationDuration.text
    });

    destinationInfo.push({
      label: "distance",
      value: destinationDistance.text
    });
    // add info sidebar
    getInfo(destinationInfo);

    console.table("info: " + JSON.stringify(destinationObject));
  });


}

function getNearbyPlaces(pos) {
let service = new google.maps.places.PlacesService(map);
console.log(pos);
// pos = { lat: latLngArray[1][0], lng: latLngArray[1][1] };
service.nearbySearch({
  location: pos,
  // radius: '15000',
  // type: ['tourist_attraction'],
  keyword: 'resort',
  rankBy: google.maps.places.RankBy.DISTANCE
}, function(results){
  console.log("nearBySearch: " + JSON.stringify(results));
});
}


function calcRoute() {
var start = $('#address1').val();
var end = $('#address2').val();
var way_points_arr = [];
for(var i=1; i<=parseInt($('.total_waypoint').val());i++){
    way_points_arr.push({
        location:$('.address'+i).val(),
        stopover:true});
}

var request = {
    origin: start,
    destination: end,
    waypoints: way_points_arr,
    optimizeWaypoints: true,
    travelMode: google.maps.TravelMode.DRIVING
};
directionsService.route(request, function(response, status) {
  if (status == google.maps.DirectionsStatus.OK) {
    directionsDisplay.setDirections(response);
    // console.log(response.geocoded_waypoints[1].place_id);
    // response.geocoded_waypoints[1].place_id
    var route = response.routes[0];
    // computeTotalDistance(response);

    let geo = geocodeObject.map((g) => {
      return g[0].geometry.location;
    });
    latLngArray = geo;
    console.table("GEO: " + latLngArray);
  }
});
}
// console.log("GEO EXECUTE: " + geo)


//to compute total distance function
function computeTotalDistance(result) {
var total = 0;
var myroute = result.routes[0];
for (var i = 0; i < myroute.legs.length; i++) {
  total += myroute.legs[i].distance.value;
}
total = total / 1000.0;
// document.getElementById('total').innerHTML = total + ' km';
// pushing new destination info
destinationInfo.push({
  label: "distance",
  value: total + " km"
});
}

function generateUUID() {
return"uuid-"+((new Date).getTime().toString(16)+Math.floor(1E7*Math.random()).toString(16));
}

function getInfo(infoArray) {
console.log("object: " + JSON.stringify(infoArray));
infoArray.forEach((info) => {
  let infoCard = document.querySelector('#informationCard'),
      createUUID = generateUUID(),
      div = document.createElement('div');

  // reset infocard
  // infoCard.innerHTML = '';

  div.innerHTML = `
  <input readonly value="${info.value}" id="${createUUID}" type="text" >
  <label for="${createUUID}" class="active" style="text-transform: capitalize;">${info.label}</label>`;
  div.classList.add('input-field');

  

  infoCard.appendChild(div);
});
}

google.maps.event.addDomListener(window, 'load', initialize);


// $(document).ready(function() {
//     $('#datetimepicker1').datetimepicker({
//         icons: {
//     time: "fa fa-clock-o",
//     date: "fa fa-calendar",
//     up: "fa fa-arrow-up",
//     down: "fa fa-arrow-down"
//         }
//     });
// });

$(document).ready(function(){
$('.sidenav').sidenav();
});