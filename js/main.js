var map;
  var markers = [];
  var autocomplete = [];
  var autocompleteOptions = {
      //componentRestrictions: {country: "az"}
  };
  waypoints = [];
  
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // multiple waypoint start here
  $(document).ready(function(){
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
        zoom: 6,
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
    var input1 = $('.pac-input')[0];
    var input2 = $('.pac-input')[1];
    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    var searchBox1 = new google.maps.places.SearchBox((input1));
    var searchBox2 = new google.maps.places.SearchBox((input2));
  
   // search function start here
    google.maps.event.addListener(searchBox1, 'places_changed', function() {
        console.log("searchbox 1");
      var places = searchBox1.getPlaces();
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
      console.log("searchbox 2");
    var places1 = searchBox2.getPlaces();
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
        console.log("Done");
        var route = response.routes[0];
        computeTotalDistance(response);
      }
    });
  }
  
  //to compute total distance function
  function computeTotalDistance(result) {
    var total = 0;
    var myroute = result.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
      total += myroute.legs[i].distance.value;
    }
    total = total / 1000.0;
    document.getElementById('total').innerHTML = total + ' km';
  }
  
  // console.log(computeTotalDistance());
  
  
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