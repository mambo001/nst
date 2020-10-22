$(function () {
    var origin, destination, map;

    // add input listeners
    google.maps.event.addDomListener(window, 'load', function (listener) {

        // Initialize Materialize Components
        $('select').formSelect();


        // Initialize Google Map
        setDestination();
        initMap();
    });

    // init or load map
    function initMap() {

        var biri = new google.maps.LatLng(12.6813955,124.359174);
        var mapOptions = {
          mapTypeId: google.maps.MapTypeId.HYBRID,
          zoom: 16,
          center: biri,
          labels: true
        };

        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);


        // Set initial marker position
        // Set starting point value
        var BIRI_STARTING_POINT = "Biri Port, Coastal Road, Biri, Northern Samar, Philippines";
        $('#inputStartingPoint').val(BIRI_STARTING_POINT);
        $('#origin').val(BIRI_STARTING_POINT);

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

        // Initialize nearby places recommendation
        // getRecommendedPlaces(map, biri);
        
    }

    function getRecommendedPlaces(map, location){
        console.log("get recommended places function invoked!")
        let service = new google.maps.places.PlacesService(map),
            biriCoordinates = {};
        
        console.log({biriCoordinates});
        console.log({service});
        service.nearbySearch({
          location: location,
        //   radius: '10000',
          type: ['lodging', 'restaurant', 'cafe'],
          keyword: "(resort) OR (balay) OR (hotel) OR (restaurant) OR (lodging) OR (breakfast)" ,
        //   rankBy: google.maps.places.RankBy.PROMINENCE
        rankBy: google.maps.places.RankBy.DISTANCE 
        }, (results) => {
          console.log(results);
          const suggestedCard = document.querySelector('#suggestedCard');
          suggestedCard.innerHTML = "";
          results.map(e => {

            const newCol = document.createElement('div');
            const photo = e.photos ? e.photos.map(photo => photo.getUrl({ maxWidth: 1000, maxHeight: 1000 })) : "";
            let tagger = (num) => {
                const starArray = [];
                for (i=0;i<num;i++){
                    starArray.push(`<i class="material-icons cyan-text">star</i>`);
                }
                return starArray.join("");
            };
            newCol.classList.add("col", "s12");
            newCol.innerHTML = `
                <div class="card horizontal">
                    <div class="card-image">
                        <img style="min-height: 100%;" src="${photo}" alt="No image found for: ${e.name}">
                        <span class="card-title card-img-title"">${e.name}</span>
                    </div>
                    <div class="card-stacked">
                        <div class="card-content">
                            <p>Ratings: ${e.rating} by ${e.user_ratings_total} users</p>
                            <span>${tagger(e.rating.toFixed())}</span>
                        </div>
                        <div class="card-action">
                            <p>Tags: </p>
                            ${e.types.map(type => `<div class="chip cyan white-text">${type}</div> `).join("")}
                        </div>
                  </div>
                </div>
            `;
            suggestedCard.append(newCol);
            
            


            
          });
        }); 
    }


    function setDestination() {
        var from_places = new google.maps.places.Autocomplete(document.getElementById('inputStartingPoint'));
        // var to_places = new google.maps.places.Autocomplete(document.getElementById('inputDestination'));

        google.maps.event.addListener(from_places, 'place_changed', function () {
            var from_place = from_places.getPlace();
            var from_address = from_place.formatted_address;
            $('#origin').val(from_address);
            
            console.log({from_place});
        });
        
        // replaced destination google-search-autocomplete
        // into materialize autocomplete for scope control
        // google.maps.event.addListener(to_places, 'place_changed', function () {
        //     var to_place = to_places.getPlace();
        //     var to_address = to_place.formatted_address;
        //     $('#destination').val(to_address);

        //     console.log({to_place});
        // });


    }

    function displayRoute(travel_mode, origin, destination, directionsService, directionsDisplay) {
        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: travel_mode,
            avoidTolls: true
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setMap(map);
                directionsDisplay.setDirections(response);
            } else {
                directionsDisplay.setMap(null);
                directionsDisplay.setDirections(null);
                alert('Could not display directions due to: ' + status);
                console.log({status});
            }
        });
    }

    // function displayManualRoute(travel_mode, origin, destination, directionsService, directionsDisplay) {
    //     directionsService.route(
    //         {
    //             origin: {
    //                 query: document.getElementById("inputStartingPoint").value
    //             },
    //             destination: {
    //                 query: document.getElementById("inputDestination").value
    //             },
    //             travelMode: google.maps.TravelMode.WALKING

    //         }, 
    //         data => {
    //             console.log(data);
    //         },
    //         error => {
    //             console.log(error);
    //         }
    //     );
    // }

    // calculate distance , after finish send result to callback function
    function calculateDistance(travel_mode, origin, destination) {

        var DistanceMatrixService = new google.maps.DistanceMatrixService();
        DistanceMatrixService.getDistanceMatrix(
            {
                origins: [origin],
                destinations: [destination],
                travelMode: google.maps.TravelMode[travel_mode],
                unitSystem: google.maps.UnitSystem.IMPERIAL, // miles and feet.
                // unitSystem: google.maps.UnitSystem.metric, // kilometers and meters.
                avoidHighways: false,
                avoidTolls: false
            }, save_results);
    }

    // save distance results
    function save_results(response, status) {
        if (status != google.maps.DistanceMatrixStatus.OK) {
            $('#informationCard').html(err);
        } else {
            var origin = response.originAddresses[0];
            var destination = response.destinationAddresses[0];
            console.log({response})
            if (response.rows[0].elements[0].status === "ZERO_RESULTS") {
                $('#informationCard').html("Sorry , not available to use this travel mode between " + origin + " and " + destination);
            } else {
                var distance = response.rows[0].elements[0].distance;
                var duration = response.rows[0].elements[0].duration;
                var distance_in_kilo = distance.value / 1000; // the kilometer
                var distance_in_mile = distance.value / 1609.34; // the mile
                var duration_text = duration.text;
                var duration_mins = `${Math.round((duration.value + 300) / 60)} mins`;
                var BIRI_COORDS = new google.maps.LatLng(12.6813955,124.359174);
                appendResults(distance_in_kilo, distance_in_mile, duration_text, duration_mins);
                console.log({BIRI_COORDS})
                getRecommendedPlaces(map, BIRI_COORDS);

                // todo: send to firebase instead
                // sendAjaxRequest(origin, destination, distance_in_kilo, distance_in_mile, duration_text);
            }
        }
    }

    // append html results
    function appendResults(distance_in_kilo, distance_in_mile, duration_text, duration_mins) {
        // $("#informationCard").removeClass("hide");
        // $('#in_mile').html("<?= $lang['distance_in_mile'] ?> : <span class='badge badge-pill badge-secondary'>" + distance_in_mile.toFixed(2) + "</span>");
        // $('#in_kilo').html("<?= $lang['distance_in_kilo'] ?>: <span class='badge badge-pill badge-secondary'>" + distance_in_kilo.toFixed(2) + "</span>");
        // $('#duration_text').html("<?= $lang['in_text'] ?>: <span class='badge badge-pill badge-success'>" + duration_text + "</span>");
        let returnLocation = (location) => {
            console.log({location})
            let delimiterText = "Biri, Northern Samar, Philippines";
            let delimitedStringArray = location ? location.split(delimiterText)[0].split(",") : "";
            let formattedLocation = delimitedStringArray ? `${delimitedStringArray[0]} - ${delimitedStringArray[1]}` : "";

            return formattedLocation;
        }

        console.log(distance_in_mile.toFixed(2))
        console.log(distance_in_kilo.toFixed(2))

        const informationCard = document.querySelector('#informationCard');
        const walkAverageDistance = getRandomArbitrary(0.55,0.73).toFixed(2);
        const pinkBeach = `
            <ul class="collection showcase with-header">
                <li class="collection-header cyan darken-4 white-text" style="display:flex;justify-content:space-between;align-items:center;">
                    <p>Walk towards</p>
                    <span>${returnLocation($('#inputDestination').val())}</span>
                    <i class="material-icons medium">directions_walk</i>
                </li>
                <li class="collection-item">Distance in Yards: <span>${Math.round(distance_in_mile.toFixed(2) * 1760)} yd</span></li>
                <li class="collection-item">Distance in Meters: <span>${Math.round(distance_in_kilo.toFixed(2) * 1000)} m</span></li>
                <li class="collection-item">Travel Duration: <span>${duration_text}</span></li>
            </ul>
        `;
        const rockFormations = `
            <ul class="collection showcase with-header">
                <li class="collection-header cyan darken-3 white-text" style="display:flex;justify-content:space-between;align-items:center;">
                    <p>Motorcycle ride from</p>
                    <span>${returnLocation($('#inputStartingPoint').val())}</span>
                    <i class="material-icons medium">motorcycle</i>
                </li>
                <li class="collection-item">Distance in Mile: <span>${distance_in_mile.toFixed(2)} mi</span></li>
                <li class="collection-item">Distance in Kilometers: <span>${distance_in_kilo.toFixed(2)} km</span></li>
                <li class="collection-item">Travel Duration: <span>${duration_mins}</span></li>
                <li class="collection-item">Fare/pax: <span>65 PHP</span></li>
                <li class="collection-item">Tour guide fee/pax: <span>100 PHP</span></li>
                
            </ul>

            <ul class="collection showcase with-header">
                <li class="collection-header cyan darken-4 white-text" style="display:flex;justify-content:space-between;align-items:center;">
                    <p>Walk towards</p>
                    <span>${returnLocation($('#inputDestination').val())}</span>
                    <i class="material-icons medium">directions_walk</i>
                </li>
                <li class="collection-item">Distance in Yards: <span>${Math.round(walkAverageDistance * 1094)} yd</span></li>
                <li class="collection-item">Distance in Meters: <span>${Math.round(walkAverageDistance * 1000)} m</span></li>
                <li class="collection-item">Travel Duration: <span>15-20 mins</span></li>
            </ul>
        `;

        informationCard.classList.remove('hide');
        informationCard.innerHTML = $('#inputDestination').val() == "Pink Beach of San Vicente, San Vicente Street, Biri, Northern Samar, Philippines" ? pinkBeach : rockFormations



    }

    // send ajax request to save results in the database
    // todo: refactor to save into firebase
    // function sendAjaxRequest(origin, destination, distance_in_kilo, distance_in_mile, duration_text) {
    //     var username =   $('#username').val();
    //     var travel_mode =  $('#travel_mode').find(':selected').text();
    //     $.ajax({
    //         url: 'common.php',
    //         type: 'POST',
    //         data: {
    //             username,
    //             travel_mode,
    //             origin,
    //             destination,
    //             distance_in_kilo,
    //             distance_in_mile,
    //             duration_text
    //         },
    //         success: function (response) {
    //             console.info(response);
    //         },
    //         error: function (jqXHR, textStatus, errorThrown) {
    //             console.log(textStatus, errorThrown);
    //         }
    //     });
    // }

    // on submit  display route ,append results and send calculateDistance to ajax request
    // $('#distance_form').submit(function (e) {
    //     e.preventDefault();
    //     var origin = $('#origin').val();
    //     var destination = $('#destination').val();
    //     var travel_mode = $('#travel_mode').val();
    //     var directionsDisplay = new google.maps.DirectionsRenderer({'draggable': false});
    //     var directionsService = new google.maps.DirectionsService();
    //     displayRoute(travel_mode, origin, destination, directionsService, directionsDisplay);
    //     calculateDistance(travel_mode, origin, destination);
    // });

    let searchBtn = document.querySelector('#buttonSearch');
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // todo changed route value from formatted to google autocomplete
        // var origin = $('#origin').val();
        // var destination = $('#destination').val();
        var origin = $('#inputStartingPoint').val();
        var destination = $('#inputDestination').val();
        var travel_mode = $('#travel_mode').val();
        var nearbyFlag = destination == "Pink Beach of San Vicente, San Vicente Street, Biri, Northern Samar, Philippines" ? true : false;
        var directionsDisplay = new google.maps.DirectionsRenderer({'draggable': false});
        var directionsService = new google.maps.DirectionsService();
        displayRoute(travel_mode, origin, destination, directionsService, directionsDisplay, );
        calculateDistance(travel_mode, origin, destination);
    });

});



// get current Position
function getCurrentPosition() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setCurrentPosition);
    } else {
        alert("Geolocation is not supported by this browser.")
    }
}

// get formatted address based on current position and set it to input
function setCurrentPosition(pos) {
    var geocoder = new google.maps.Geocoder();
    var latlng = {lat: parseFloat(pos.coords.latitude), lng: parseFloat(pos.coords.longitude)};
    geocoder.geocode({ 'location' :latlng  }, function (responses) {
        console.log(responses);
        if (responses && responses.length > 0) {
            $("#origin").val(responses[1].formatted_address);
            $("#from_places").val(responses[1].formatted_address);
            //    console.log(responses[1].formatted_address);
        } else {
            alert("Cannot determine address at this location.")
        }
    });
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }