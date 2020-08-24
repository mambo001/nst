// Pexels API key
// 563492ad6f9170000100000157d4d535979146c0a53ce90ae914527d
// fetch

let placesRow = document.querySelector('#recommended-places'),
    aboutContent =  document.querySelector('#about-content'),
    loadMoreBtn = document.querySelector('#read-more-overlay > .btn'),
    inputStartingPoint = document.querySelector('#inputStartingPoint'),
    createAccountForm = document.querySelector('#createAccountForm'),
    loginAccountForm = document.querySelector('#loginAccountForm'),
    firstName = document.querySelector('#firstName'),
    lastName = document.querySelector('#lastName'),
    email = document.querySelector('#email'),
    emailError = document.querySelector('#emailError'),
    password = document.querySelector('#password'),
    loginEmail = document.querySelector('#loginEmail'),
    loginPassword = document.querySelector('#loginPassword');
    


    createAccountForm.addEventListener('submit', createNewAccount);
    loginAccountForm.addEventListener('submit', doLogin);
    loadMoreBtn.addEventListener('click', loadMore);

window.addEventListener('DOMContentLoaded', (event) => {

  // Set default main location 
  inputStartingPoint.value = "Biri Port, Coastal Road, Biri, Northern Samar, Philippines";

  // Sidenav
  const sideNav = document.querySelector('.sidenav');
  M.Sidenav.init(sideNav, {});
  
  // User Dropdown
  var dropdownElements = document.querySelectorAll('.dropdown-trigger');
  var dropdownInstances = M.Dropdown.init(dropdownElements, {});

  // Registration Modal
  var modalElements = document.querySelectorAll('.modal');
  var modalInstances = M.Modal.init(modalElements, {
    startingTop: '10%',
    endingTop: '15%'
  });

  console.log(modalInstances)

  // Slider
  const slider = document.querySelector('.slider');
  M.Slider.init(slider, {
      indicators: false,
      height: 650,
      transition: 500,
      interval: 6000
  });

  var sliderTest = document.querySelector('#slide-test');
  M.Slider.init(sliderTest, {});

  // var elems = document.querySelectorAll('.modal');
  // var instances = M.Modal.init(elems, {});

  // db.collection('places').get().then(snapshot => {
  //   snapshot.docs.forEach(doc => {
  //     const docData = doc.data();
  //       docData.id = doc.id;

  //      console.log(docData);
  //      renderPlaces(docData);
  //   })
  // });

  
  


  checkToggleables();  
});

function loadMore(e){
  e.target.parentElement.style.display = 'none';
  aboutContent.classList.toggle("load-more");
}

function createNewAccount(e){
  e.preventDefault();
  let userInfo = {
    get fullName() {
      return `${this.firstName} ${this.lastName}`
    } 
  };
  userInfo.firstName = firstName.value;
  userInfo.lastName = lastName.value;
  userInfo.email = email.value;
  userInfo.password = password.value;

  console.log("full name: " + userInfo.fullName)

  firebase.auth().createUserWithEmailAndPassword(userInfo.email, userInfo.password)
  .then(res => {
    if (res.user.uid){
      // console.log(res.user.uid);
      var user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: userInfo.fullName
      }).then(function() {
        // Update successful.
        console.log("update success")
      }).catch(function(error) {
        // An error happened.
        console.log("name update failed")
      });

      var toastHTML = '<span>Account has been created successfully!</span><a class="btn-flat toast-action cyan-text modal-trigger" href="#loginForm">Login</a>';
      M.toast({html: toastHTML});
      $('#registrationForm').modal('close');


      console.log("Signed in user: " + user)
    }
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // console.log()
    if (errorMessage == "The email address is already in use by another account."){
      email.classList.add('invalid');
      emailError.classList.remove('hide');  
      emailError.textContent = errorMessage;

      var user = firebase.auth().currentUser;
      console.log("Signed in user: " + JSON.stringify(user))
    }
    // ...
  });

  console.log("submitted: " + JSON.stringify(userInfo))
}

function doLogin(e){

  e.preventDefault();

  let userInfo = {},
      loginEmailError = document.querySelector("#loginEmailError"),
      loginPasswordError = document.querySelector("#loginPasswordError"),
      loggedinUser = document.querySelector("#loggedinUser");

  userInfo.email = loginEmail.value;
  userInfo.password = loginPassword.value;

  firebase.auth().signInWithEmailAndPassword(userInfo.email, userInfo.password)
  .then((data) => {
    console.log("data: " + data)
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        
        loggedinUser.textContent = displayName;
        var toastHTML = '<span>Logged in successfully!</span>';
        M.toast({html: toastHTML});
        $('#loginForm').modal('close');
        // ...
      } else {
        // User is signed out.
        // ...
      }
    });
  })
  .catch(function(error) {
    // Handle Errors here.
    // auth/user-not-found
    // auth/wrong-password
    loginEmailError
    loginPasswordError
    var errorCode = error.code;
    var errorMessage = error.message + " " + errorCode;

    if (errorCode == "auth/user-not-found"){
      loginEmailError.textContent = errorMessage;
      loginEmailError.classList.remove('hide');
    } else if (errorCode == "auth/wrong-password"){
      loginPasswordError.textContent = errorMessage;
      loginPasswordError.classList.remove('hide');
    } else {
      console.log("Login error: " + errorMessage + " " + errorCode);
    }
    // ...
  });

  

}

function renderPlaces(data){
  // generate card
  let newDiv = document.createElement('div');

  // newDiv.dataset.target  = modalID;
  newDiv.classList = [""];
  newDiv.innerHTML = `
    <div data-id="${data.id}" class="card hoverable toggle-modal" style="cursor: pointer;">
      <div class="card-image">
        <img loading=lazy class="card-img" src="${data.image_thumbnail}" alt="">
        <span class="card-title card-img-title">${data.name}</span>
      </div>
      <div class="card-content">
        <p class="short-description">${data.short_description}</p>
      </div>
      
    </div>
  `;
  placesRow.appendChild(newDiv);
}

function checkModals(){
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems, {});
  var instance = M.Modal.getInstance(instances);


  console.log(elems)
  console.log(instances)
  console.log(instance)
  
  
}

function checkToggleables(){
  let elementArrays = Array.from(document.querySelectorAll('.toggle-modal'));
  var elems = document.querySelectorAll('.modal');
  var modalContent = document.querySelector('#modal1-content');
  var instances = M.Modal.init(elems, {});
  var instance = M.Modal.getInstance(instances[0]);
  
  // console.log(instances[0]);

  elementArrays.forEach(e => {
    e.addEventListener('click', () => {
      // console.log('card-modal clicked');
      // console.log(e.getAttribute('data-id'));
      var placeID = e.getAttribute('data-id');
      var data = placesData[placeID];
      // name
      // long_description
      // image_thumbnail
      modalContent.innerHTML = `
        <h4 style="margin: 12px;">${data.name}</h4>
        <img style="margin: 12px; max-height: 600px; width: 100%; padding: 2rem;" class="materialboxed" src="${data.image_thumbnail}">
        <p style="margin: 20px 0px 60px 0px;;" class="flow-text">${data.long_description}</p>
      `;


      instances[0].open();

      var materialboxed = document.querySelectorAll('.materialboxed');
      var materialboxedInstance = M.Materialbox.init(materialboxed, {});
    });
  })

  // console.log(elementArrays)
  // checkModals();
}




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
  // checkModals();


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
  // var catarman = new google.maps.LatLng(12.379054, 124.820326);
  var biri = new google.maps.LatLng(12.6813955,124.359174);
  var mapOptions = {
    zoom: 13,
    center: biri,
    labels: true
  }

map = new google.maps.Map(document.getElementById('map-canvas'), {
  mapTypeId: google.maps.MapTypeId.HYBRID,
  zoom: 16,
  center: biri
});

// direction service code
directionsDisplay.setMap(map);
// search box defined here
var input1 = document.querySelector('#inputStartingPoint');
var input2 = document.querySelector('#inputDestination');
// map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
var searchBox1 = new google.maps.places.SearchBox((input1));
var searchBox2 = new google.maps.places.SearchBox((input2));

// Initialize Starting Point marker
var initialMarkerPosition =  new google.maps.LatLng(12.681398, 124.361314),
    marker = new google.maps.Marker({
      position: initialMarkerPosition,
      title: initialMarkerPosition.name,
      map: map,
      label: {
        text: "Biri Island Port",
        fontWeight: "bold",
        color: "white",
        textShadow: "2px 2px 0px black"
      }
    });

// search function start here
google.maps.event.addListener(searchBox1, 'places_changed', function() {
    var places = searchBox1.getPlaces();
    // console.log("searchbox 1: " + JSON.stringify(places));
    // geocodeObject.push(places);

    if (places.length == 0) {
      geocodeObject.push(places);
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
    if($('#address2').val().length > 0 && $('#address2').val() != 'undefined'){
        console.log("searchbox 1 make route");
        setTimeout(function() {
            calcRoute();
        }, 500);
    } else {
        map.fitBounds(bounds);
        map.setZoom(9);
    }
});


// function testCalcRoute() {
//   var places = searchBox1.getPlaces();
//   // console.log("searchbox 1: " + JSON.stringify(places));
//   geocodeObject.push(places);

//   if (places.length == 0) {
//     return;
//   }
//   for (var i = 0, marker; marker = markers[i]; i++) {
//     marker.setMap(null);
//   }
//   // For each place, get the icon, place name, and location.
//   var bounds = new google.maps.LatLngBounds();
//   for (var i = 0, place; place = places[i]; i++) {
//       // Create a marker for each place.
//       marker = new google.maps.Marker({
//         map: map,
//         title: place.name,
//         position: place.geometry.location,
//         draggable: true
//       });

//       $(".latitude").val(place.geometry.location.lat());
//       $(".longitude").val(place.geometry.location.lng());
//       updateMarkerPosition(marker.getPosition());
//       geocodePosition(marker.getPosition(),'1');

//       google.maps.event.addListener(marker, 'dragend', function() {
//         geocodePosition(marker.getPosition(),'1');
//         $(".latitude").val(marker.getPosition().lat());
//         $(".longitude").val(marker.getPosition().lat());
//       });

//       markers.push(marker);
//       bounds.extend(place.geometry.location);
//   }
//   if($('#address2').val().length > 0 && $('#address2').val() != 'undefined'){
//       console.log("searchbox 1 make route");
//       setTimeout(function() {
//           calcRoute();
//       }, 500);
//   } else {
//       map.fitBounds(bounds);
//       map.setZoom(9);
//   }
// }


google.maps.event.addListener(searchBox2, 'places_changed', function() {

    // testCalcRoute();

    let places1 = searchBox2.getPlaces(),
        destination = places1[0].geometry.location,
        infoCard = document.querySelector('#informationCard');

    //reset Info Card 
    infoCard.innerHTML = "";
    console.log("searchbox 2: " + JSON.stringify());
    geocodeObject.push(places1);

    if (places1.length == 0) {
      return;
    }

    for (var i = 0, marker; marker = markers[i]; i++) {
      marker.setMap(null);
    }
    // For each place, get the icon, place name, and location.
    var bounds = new google.maps.LatLngBounds();
    console.log("bounds: " + bounds)
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

    if($('#address1').val().length > 0 && $('#address1').val() != 'undefined'){
        console.log("searchbox 2 make route");
        setTimeout(function() {
            calcRoute();
            distanceMatrix();
            console.log("destination pos: " + JSON.stringify(destination));
            getNearbyPlaces(destination);
            
        }, 500);
    } else { 
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
    travelMode: 'TRANSIT',
    // transitOptions: TransitOptions,
    // drivingOptions: DrivingOptions,
    // unitSystem: UnitSystem,
    // avoidHighways: Boolean,
    // avoidTolls: Boolean,
  }, function callback(response, status) {
    // See Parsing the Results for
    // the basics of a callback function.
    // console.log('distance matrix: ' + status);
    // console.log(response);
    // console.log("array: " + JSON.stringify(response.rows[1].elements));
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
    destinationInfo = [];
    console.table("info: " + JSON.stringify(destinationObject));
  });


}

function getNearbyPlaces(pos) {
  let service = new google.maps.places.PlacesService(map);
  console.log(pos.lat());
  // pos = { lat: latLngArray[1][0], lng: latLngArray[1][1] };
  service.nearbySearch({
    location: pos,
    // radius: '15000',
    type: ['tourist_attraction'],
    // keyword: 'resort',
    rankBy: google.maps.places.RankBy.DISTANCE
  }, function(results){
    // console.log("nearBySearch: " + JSON.stringify(results));
    var suggestedCard = document.querySelector('#suggestedCard');
    var nearPlaces = JSON.stringify(results);
    console.table(nearPlaces)
    var idk = results.map(e => {
      // let object = [];
      // console.log("photos: " + e.photos.getUrl())
      return {
        name: e.name,
        type: e.types,
        vicinity: e.vicinity,
        photos: e.photos,
        businessStatus: e.business_status
      };
    })
    console.log(idk);
    console.log(geocodeObject);

  });
}

function getRecommendedPlaces(){
  let service = new google.maps.places.PlacesService(map),
      biriCoordinates = {};
  
  console.log(biriCoordinates);
  service.nearbySearch({
    location: biriCoordinates,
    // radius: '15000',
    type: ['tourist_attraction'],
    // keyword: 'resort',
    rankBy: google.maps.places.RankBy.DISTANCE
  }, (results) => {
    // id, name, photos, rating, types, user_ratings_total, vicinity
    // let filteredResult = results.filter(r => {
    //   return {
    //     id: r.id,
    //     name: r.name,
    //     photos: r.photos,
    //     rating: r.rating,
    //     types: r.types,
    //     user_ratings_total: r.user_ratings_total,
    //     vicinity: r.vicinity
    //   };
    // });
    console.log(results);
    // console.log(filteredResult);
    // return filteredResult;
  }); 
}

// getRecommendedPlaces();


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
      // travelMode: google.maps.TravelMode.DRIVING
      travelMode: google.maps.TravelMode.TRANSIT
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
      <label for="${createUUID}" class="active" style="text-transform: capitalize;">${info.label}</label>
    `;
    div.classList.add('input-field');

    

    infoCard.appendChild(div);
  });
}

google.maps.event.addDomListener(window, 'load', initialize);


