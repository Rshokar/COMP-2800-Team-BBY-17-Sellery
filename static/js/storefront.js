"use strict";


$(document).ready(function () {
  const url = new URL(window.location.href);

  //Get user ID from URL
  const userID = url.searchParams.get('user');

  //Check if User Id exist.
  if (userID) {
    genStoreFrontListing(userID);
    editForStorefrontVisitor();
  } else {
    genMyStoreFrontListing();
    genReviews();
    editForStorefrontOwner();
  }

  /**
   * AJAX call to request the user info from the server
   */
  $.ajax({
    url: "/storefront-data",
    dataType: "json",
    type: "GET",
    data: {
      id: userID
    },
    success: function (data) {
      let name = data.result.name;
      let bio = data.result.bio;
      let profile_pic = data.result.profile_pic;
      if (!profile_pic) {
        let url = '/pics/about.png';
        $("#name-goes-here").html(name);
        $("#bio-goes-here").html(bio);
        $("#img-goes-here").attr("src", url);
      } else {
        let url = `data:${profile_pic.contentType};charset=utf-8;base64,${profile_pic.imageBase64}`;
        $("#name-goes-here").html(name);
        $("#bio-goes-here").html(bio);
        $("#img-goes-here").attr("src", url);
      }

    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#p1").text(jqXHR.statusText);
      console.log("ERROR:", jqXHR, textStatus, errorThrown);
    }
  })

  /**
   * Event listeners for the review modal.
   */
  const reviews_button = document.querySelector("#reviews");
  const review_card = document.querySelector("#review-modal");
  const review_close = document.querySelector("#review-close");

  reviews_button.addEventListener("click", function () {
    console.log("Clicked reviews");
    review_card.style.display = "block";
  });

  review_close.addEventListener("click", function () {
    console.log("review x working");
    review_card.style.display = "none";
  });


  /**
   * Event listeners for the edit modal.
   */
   const edit_button = document.querySelector("#edit");
   const edit_card = document.querySelector("#edit-modal");
   const edit_close = document.querySelector("#edit-close");
   const edit_submit = document.querySelector("#submit");
 
   edit_button.addEventListener("click", function () {
     console.log("Clicked reviews");
     edit_card.style.display = "block";
   });
 
   edit_close.addEventListener("click", function () {
     console.log("edit x working");
     resetEditModal()
     edit_card.style.display = "none";
   });



  /**
   * Window listens for click outside of modals to close.
   */
  window.onclick = function (event) {
    if (event.target == edit_card) {
      resetEditModal()
      console.log("window close");
      edit_card.style.display = "none";
    }
    if (event.target == review_card) {
      review_card.style.display = "none";
    }
  };

  /**
   * This Vue app is used to add and remove data from HTML 
   * Data will be inputed in div with ID review-listing
   * @author Mike Lim
   * @date May 13 2021
   */
  console.log("made it to reviewlisting component");
  const reviewApp = new Vue({
    el: '#review-listing',
    data: {
      reviews: {}
    }
  })

  /**
   * This function will request reviews from the server.
   * @author Mike Lim
   * @date May-13-2021
   */
  function genReviews() {
    $.ajax({
      url: "/generate_reviews",
      dataType: "json",
      type: "GET",
      success: function (data) {
        reviewApp.reviews = data;
        return data
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#p1").text(jqXHR.statusText);
        console.log("ERROR:", jqXHR, textStatus, errorThrown);
      }
    })
  }

  /**
   * Autocomplete using Google Maps API
   * @author Mike Lim
   * @date May-20-2021
   */
  var autocomplete;
  autocomplete = new google.maps.places.Autocomplete((document.getElementById('autocomplete')), {
    types: ['address'],
    componentRestrictions: {
      country: "ca"
    }
  });

  google.maps.event.addListener(autocomplete, 'place_changed', function () {
    var userAddress = autocomplete.getPlace();
    document.getElementById('latitude').value = userAddress.geometry.location.lat();
    document.getElementById('longitude').value = userAddress.geometry.location.lng();
  });


  /**
   * Listens to the edit bio submit button and runs update() with the data.
   */
  $("#submit").on("click", function (event) {
    var isValid = true;
    event.preventDefault();
    var newName = document.getElementById("newName").value;
    var newBio = document.getElementById("newBio").value;
    var newLat = document.getElementById("latitude").value;
    var newLong = document.getElementById("longitude").value;
    var newAddress = document.getElementById("autocomplete").value;

    if (newName.length > 24) {
      const nameError = document.getElementById('name-error');
      nameError.textContent = "Name is maximum 24 characters";
      isValid = false;
    }
    if (newBio.length > 180) {
      const bioError = document.getElementById('bio-error');
      bioError.textContent = "Bio is maximum 180 characters";
      isValid = false;
    }
    if (newAddress.length > 0 && newLat.length == 0) {
      const addressError = document.getElementById('address-error');
      addressError.textContent = "Invalid Address";
      isValid = false;
    }
    console.log("addy: ", newLat, newLong);

    var myObj = {name: newName, bio: newBio, longitude: newLong, latitude: newLat};

    console.log("clicked and saved: " + newName + newBio + newLat + newLong);

    if (isValid) {
      update(myObj);
      edit_card.style.display = "none";
      window.location.reload();
    }


  })

  /**
   * This function will update the bio with its new values. 
   * @return obj with either success or error. 
   */
  function update(bioData) {
    $.ajax({
      url: "/update_bio",
      type: "POST",
      dataType: "JSON",
      data: bioData,
      success: (data) => {
        console.log("success in update in client");
        return data
      },
      error: (err) => {
        let obj = {
          status: "error",
          message: "Error posting data",
          error: err,
        }
        return obj;
      }
    })
  }

})


/**
 * This function makes the DOM look appropriate for a visitor 
 * @author Ravidner Shokar 
 * @version 1.0 
 * @date May 26 2021 
 */
function editForStorefrontVisitor() {
  const form = document.getElementById("upload_image");
  const review = document.getElementById("reviews");
  const edit = document.getElementById("edit");

  form.style.display = "none";
  review.style.display = "none";
  edit.style.display = "none";
}

/**
 * This function makes the DOM look appropriate for an owner 
 * @author Mike Lim 
 * @version 1.0 
 * @date May 26 2021 
 */
function editForStorefrontOwner() {
  const addReview = document.getElementById("add-reviews");

  addReview.style.display = "none";
}

/**
 * This function resets the edit modal after the user clicks off of it 
 * @author Mike Lim 
 * @version 1.0 
 * @date May 26 2021 
 */
function resetEditModal() {
  const nameErrorReset = document.getElementById('name-error');
  const bioErrorReset = document.getElementById('bio-error');
  const addressErrorReset = document.getElementById('address-error');
  document.getElementById("newName").value = "";
  document.getElementById("newBio").value = "";
  document.getElementById("autocomplete").value = "";
  nameErrorReset.textContent = "";
  bioErrorReset.textContent = "";
  addressErrorReset.textContent = "";
}


