// Pexels API key
// 563492ad6f9170000100000157d4d535979146c0a53ce90ae914527d
// fetch

let placesRow = document.querySelector('#recommended-places'),
    aboutContent =  document.querySelector('#about-content'),
    loadMoreBtn = document.querySelector('#read-more-overlay > .btn'),
    inputStartingPoint = document.querySelector('#inputStartingPoint'),
    address1 = document.querySelector('#address1'),
    createAccountForm = document.querySelector('#createAccountForm'),
    loginAccountForm = document.querySelector('#loginAccountForm'),
    firstName = document.querySelector('#firstName'),
    lastName = document.querySelector('#lastName'),
    email = document.querySelector('#email'),
    emailError = document.querySelector('#emailError'),
    password = document.querySelector('#password'),
    loginEmail = document.querySelector('#loginEmail'),
    loginPassword = document.querySelector('#loginPassword'),
    logoutBtn = document.querySelectorAll('.logout-btn'),
    closeModalBtn= document.querySelectorAll('.close-modal-btn');
    

    closeModalBtn.forEach(btn => btn.addEventListener('click', () => $('#place-modal').modal('close')));
    logoutBtn.forEach(btn => btn.addEventListener('click', doLogout));
    createAccountForm.addEventListener('submit', createNewAccount);
    loginAccountForm.addEventListener('submit', doLogin);
    loadMoreBtn.addEventListener('click', loadMore);

window.addEventListener('DOMContentLoaded', (event) => {

  firebase.auth().onAuthStateChanged(user => {
    let loggedinUser = document.querySelector("#loggedinUser");
    if (user){
      loggedinUser.textContent = user.displayName;
    } else {
      console.log("not logged in!");
    }
  });


  // Set default main location 
  // todo removed initial value
  // inputStartingPoint.value = "Biri Port, Coastal Road, Biri, Northern Samar, Philippines";
  // address1.value = "Biri Port, Coastal Road, Biri, Northern Samar, Philippines";

  // Sidenav
  const sideNav = document.querySelector('.sidenav');
  M.Sidenav.init(sideNav, {});

  // Mobile-Nav Collapsible/Dropdown
  $('.collapsible').collapsible();
  
  // User Dropdown
  var dropdownElements = document.querySelectorAll('.dropdown-trigger');
  var dropdownInstances = M.Dropdown.init(dropdownElements, {});

  // Registration Modal
  var modalElements = document.querySelectorAll('.modal');
  var modalInstances = M.Modal.init(modalElements, {
    startingTop: '10%',
    endingTop: '15%'
  });

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

  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems, {});


  db.collection('places').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
      const docData = doc.data();
        docData.id = doc.id;

      //  console.log(docData);
       renderPlaces(docData);
       
    });
    
    let autoCompleteData = {},
        placesData = snapshot.docs.map(doc => {
          let docData = doc.data();

          return autoCompleteData[docData.long_name] = docData.image_thumbnail
        });



    $('input#inputDestination.autocomplete').autocomplete({
      data: autoCompleteData
    });


    setPlacesEventListeners();
  });

  
  


  checkToggleables();  
});

function doLogout(){
  firebase.auth().signOut().then(function() {
    // Sign-out successful.

    //Clear user details
    loggedinUser.textContent = "Guest";

    // Sign-out message
    var toastHTML = '<span>Logged out successfully!</span';
    M.toast({html: toastHTML});

  }).catch(function(error) {
    // An error happened.
  });
}

function setPlacesEventListeners(){
  let places = document.querySelectorAll('.tourist-places-card');
  places.forEach((place) => {
    place.addEventListener('click', (e) => {
      let data = e.currentTarget.dataset.placeData,
          selectedPlaceID = JSON.parse(e.currentTarget.dataset.placeData).id;

      // console.log(JSON.parse(e.currentTarget.dataset.placeData).id);
      setModalData(data);
      getPlaceRatings(selectedPlaceID);
    })
  })
}

function setModalData(data){
  let parsedData = JSON.parse(data) || "",
      placeModal = document.querySelector("#place-modal") || "";
      modalContent = document.querySelector("#place-modal .modal-content") || "";

  $('#place-modal').modal('open');

  modalContent.innerHTML = `
    <div data-id="${parsedData.id}" class="toggle-modal">
    <div class="row">

      <div class="col s12 m12 l6">
        <div class="card">

          <div class="card-image">
            <img loading=lazy class="card-img" src="${parsedData.image_thumbnail}" alt="">
            <span class="card-title card-img-title">${parsedData.name}</span>
          </div>

          <div class="card-content">
            <p class="long-description">${parsedData.long_description}</p>
          </div>

        </div>
      </div>

      

      <div class="col s12 m12 l6">
        <div class="card">
          <h5 class="center-align" style="padding-top: 15px; margin: 0px;">Ratings</h5>
          <div class="card-content">
            <div class="container">
                <div class="">
                  <div class="hreview-aggregate">
                    <div class="row">
                      <div class="col s12 m12 l12">
                        <meta itemprop="worstRating" content="1">
                        <meta itemprop="bestRating" content="5">
                        <meta itemprop="reviewCount" content="1">
                        <div class="row">

                          <div class="score col s12">
                            5
                          </div>
                          <div class="rating-stars col s12">

                            <input type="radio" name="stars" id="star-nullnull">
                            <input type="radio" name="stars" id="star-11" saving="1" data-start="1" checked="">
                            <input type="radio" name="stars" id="star-22" saving="2" data-start="2" checked="">
                            <input type="radio" name="stars" id="star-33" saving="3" data-start="3" checked="">
                            <input type="radio" name="stars" id="star-44" saving="4" data-start="4" checked="">
                            <input type="radio" name="stars" id="star-55" saving="5" checked="">
                            <section>
                              <label for="star-11">
                                <svg width="255" height="240" viewBox="0 0 51 48">
                                    <path d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"></path>
                                </svg>
                              </label>
                              <label for="star-2">
                                <svg width="255" height="240" viewBox="0 0 51 48">
                                    <path d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"></path>
                                </svg>
                              </label>
                              <label for="star-33">
                                <svg width="255" height="240" viewBox="0 0 51 48">
                                    <path d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"></path>
                                </svg>
                              </label>
                              <label for="star-44">
                                <svg width="255" height="240" viewBox="0 0 51 48">
                                    <path d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"></path>
                                </svg>
                              </label>
                              <label for="star-55">
                                <svg width="255" height="240" viewBox="0 0 51 48">
                                    <path d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"></path>
                                </svg>
                              </label>
                            </section>
                          </div>

                          <div class="reviews-stats col s12">
                            <span class="reviewers-small"></span>
                            <span class="reviews-num">0</span> total
                          </div>

                        </div>
                      </div>

                      <div class="rating-histogram col s12 m12 l12 hide">
                        <div class="container">
                          <div class="rating-bar-container five">
                            <span class="bar-label">
                                <span class="star-tiny">
                              </span> 5
                            </span>
                            <span class="bar">
                            </span>
                            <span class="bar-number">
                            1
                            </span>
                          </div>
                          <div class="rating-bar-container four">
                            <span class="bar-label">
                                <span class="star-tiny">
                              </span> 4
                            </span>
                            <span class="bar">
                            </span>
                            <span class="bar-number">
                            1
                            </span>
                          </div>
                          <div class="rating-bar-container tree">
                            <span class="bar-label">
                                <span class="star-tiny">
                              </span> 3
                            </span>
                            <span class="bar">
                            </span>
                            <span class="bar-number">
                            1
                            </span>
                          </div>
                          <div class="rating-bar-container two">
                            <span class="bar-label">
                                <span class="star-tiny">
                              </span> 2
                            </span>
                            <span class="bar">
                            </span>
                            <span class="bar-number">
                            1
                            </span>
                          </div>
                          <div class="rating-bar-container one">
                            <span class="bar-label">
                                <span class="star-tiny">
                              </span> 1
                            </span>
                            <span class="bar">
                            </span>
                            <span class="bar-number">
                            1
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                <ul class="collection ratings-collection">


                </ul>
            </div>    
          </div>


          </div>
        </div>
      </div>

    </div>

    </div>`;

    // Initialize
}

function getPlaceRatings(placeID){
  //getMovieStars
  console.log("f passed placeID: " + placeID)
  const ratingsRef = db.collection('ratings').where("placeID", "==", placeID);

  ratingsRef.get().then(snapshot => {
    let ratings = snapshot.docs.map(doc => doc.data()),
        ratingsCollection = document.querySelector('.ratings-collection'),
        addRatingLI = document.querySelector('.add-rating-li'),
        reviewsNumber = document.querySelector('.reviews-num');
    console.log(snapshot.docs.map(doc => doc.data()));

    let liRatings = ratings.map((r) => {
      // 12345

      var docRef = db.collection("users").doc(r.userID);
      docRef.get().then((snap) => {
        // let arr = snap.docs.map(doc => doc.data().name);
        // console.log(snap.data().map(e => e.name))
          // if (doc.exists) {
          //     console.log("Document data:", doc.data().name);
          //     return doc.data().name
          // } else {
          //     // doc.data() will be undefined in this case
          //     console.log("No such document!");
          // }
      })

      console.log(r.name);

      return `
        <li class="collection-item avatar">
          <img src="https://avatars2.githubusercontent.com/u/18651126?s=460&amp;u=ea2834cff018a104af898c4b2a7ed376fce0e3da&amp;v=4" alt="" class="circle">
          <span class="title">${r.name}</span>
          <p>${r.comment}</p>
          <a href="#!" class="secondary-content">
            <i class="material-icons cyan-text">grade</i>
            <i class="material-icons cyan-text">grade</i>
            <i class="material-icons cyan-text">grade</i>
            <i class="material-icons cyan-text">grade</i>
            <i class="material-icons cyan-text">grade</i>
          </a>
        </li>
      `}
    );

    reviewsNumber.textContent = ratings.length;

    // console.log("liRatings: " + liRatings);
    ratingsCollection.innerHTML = liRatings.join('');

    let liAddRatings = document.createElement('li');
    liAddRatings.classList.add('collection-item', 'add-rating-li');
    liAddRatings.innerHTML = `
      <div class="row">

        <div class="rating-stars col s12">
          <input type="radio" name="stars" id="star-null">
          <input type="radio" name="stars" id="star-1" saving="1" data-start="1" checked="">
          <input type="radio" name="stars" id="star-2" saving="2" data-start="2" checked="">
          <input type="radio" name="stars" id="star-3" saving="3" data-start="3" checked="">
          <input type="radio" name="stars" id="star-4" saving="4" data-start="4" checked="">
          <input type="radio" name="stars" id="star-5" saving="5" checked="">
          <section>
            <label for="star-1">
              <svg width="255" height="240" viewBox="0 0 51 48">
                  <path d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"></path>
              </svg>
            </label>
            <label for="star-2">
              <svg width="255" height="240" viewBox="0 0 51 48">
                  <path d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"></path>
              </svg>
            </label>
            <label for="star-3">
              <svg width="255" height="240" viewBox="0 0 51 48">
                  <path d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"></path>
              </svg>
            </label>
            <label for="star-4">
              <svg width="255" height="240" viewBox="0 0 51 48">
                  <path d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"></path>
              </svg>
            </label>
            <label for="star-5">
              <svg width="255" height="240" viewBox="0 0 51 48">
                  <path d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"></path>
              </svg>
            </label>
          </section>
        </div>

        <div class="input-field col s12">
          <div id="selectedPlaceID" data-id="${placeID}" style="display: none;"></div>
          <textarea id="ratingTextarea" class="materialize-textarea"></textarea>
          <label for="ratingTextarea">Comment</label>
        </div>

        <div class="col s12">
          <a class="waves-effect waves-light btn cyan submit-review-btn" style="width: 100%;display: flex;justify-content: center;"><i class="material-icons left">send</i>Submit Review</a>
        </div>
        

      </div>`;
    
    ratingsCollection.innerHTML = liRatings.join('');
    ratingsCollection.appendChild(liAddRatings);
    
  })
}

document.querySelector('#place-modal').addEventListener('click', clickEventHandler);

function clickEventHandler(e){
  
  // if(e.target.matches(".material-icons")){
  //   // set to parent if icon
  //   e.target = e.target.parentElement;
    // console.log(e.target);
    if (e.target.matches(".submit-review-btn")){
      // console.log(e.target);
      addNewRating(e.target);
    }
  // }

}

var createUUID = function() {
  return"anon_"+((new Date).getTime().toString(16)+Math.floor(1E7*Math.random()).toString(16));
}

function addNewRating(e){
  console.log("add new: " + e)
  let ratingTextarea = document.querySelector('#ratingTextarea').value || "",
      placeID = document.querySelector('#selectedPlaceID');
  console.log(ratingTextarea);

  // Add new rating based on user authentication status
  firebase.auth().onAuthStateChanged(user => {
    if (user){
      db.collection("ratings").doc(`${user.uid}_${placeID.dataset.id}`).set({
        placeID: placeID.dataset.id,
        userID: user.uid,
        comment: ratingTextarea,
        value: 5
      })
    } else {
      console.log("not logged in!");
      db.collection("ratings").doc(createUUID()).set({
        placeID: placeID.dataset.id,
        userID: "Anonymous",
        comment: ratingTextarea,
        value: 5
      })
    }
  });
  // db.collection("users").doc(res.user.uid).set({
  //   name: userInfo.fullName
  // })


}

function setRatingStars(starsCount){
  // TODO: Return number of stars based on ratings value number
  
  let newArray = new Array(starsCount);

  console.log("count: "+ starsCount)
  console.log("newArray: "+ newArray)

  return newArray.forEach(e => {
    console.log('<i class="material-icons cyan-text">grade</i>');
    `<i class="material-icons cyan-text">grade</i>`;
  })

  // return newArray.map((e) => `<i class="material-icons cyan-text">grade</i>`).join('');
}



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
        db.collection("users").doc(res.user.uid).set({
          userID: res.user.uid,
          name: userInfo.fullName
        })
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

function renderAutoComplete(data){

}

function renderPlaces(data){
  // generate card
  let newDiv = document.createElement('div');

  newDiv.dataset.placeData = JSON.stringify(data);
  newDiv.classList = ["tourist-places-card"];
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



// google.maps.event.addDomListener(window, 'load', initialize);


