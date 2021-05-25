
$(document).ready(function () {
  const url = new URL(window.location.href);

  //Get user ID from URL
  const userID = url.searchParams.get('user');

  //Check if User Id exist.
  if (userID) {
    genStoreFrontListing(userID);
  } else {
    console.log("Inside")
    genMyStoreFrontListing();
    genReviews();
  }

  /**
   * AJAX call to request the user info from the server
   */
  $.ajax({
    url: "/storefront-data",
    dataType: "json",
    type: "GET",
    success: function (data) {
      console.log(data);
      let name = data.result.name;
      let bio = data.result.bio;
      let profile_pic = data.result.profile_pic;
      // url data:image/jpeg;charset=utf-8;base64,/9j/4QAWRXhpZgAATU0AKgAAAAgAAAAAAAD/4Q...
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
     edit_card.style.display = "none";
   });

   edit_submit.addEventListener("click", function () {
      edit_card.style.display = "none";
      window.location.reload();
   });

  /**
   * Event listeners for the review modal.
   */
  const add_reviews_button = document.querySelector("#add-reviews");
  const add_review_card = document.querySelector("#add-review-modal");
  const add_review_close = document.querySelector("#add-review-close");

  add_reviews_button.addEventListener("click", function () {
    console.log("Clicked reviews");
    add_review_card.style.display = "block";
  });

  add_review_close.addEventListener("click", function () {
    console.log("review x working");
    add_review_card.style.display = "none";
  });
 

   /**
    * Window listens for click outside of modals to close.
    */
   window.onclick = function (event) {
     if (event.target == edit_card) {
       console.log("window close");
       edit_card.style.display = "none";
     }
     if (event.target == review_card) {
       review_card.style.display = "none";
     }
     if (event.target == add_review_card) {
       add_review_card.style.display = "none";
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
        console.log("Reviews are generated: ", data);
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
  $("#submit").on("click" , function(event) {
    event.preventDefault();
    var newName = document.getElementById("newName").value;
    var newBio = document.getElementById("newBio").value;
    var newLat = document.getElementById("latitude").value;
    var newLong = document.getElementById("longitude").value;

    //hard coded id for now.
    var myObj = {name: newName, bio: newBio, longitude: newLong, latitude: newLat};
    
    console.log("clicked and saved: " + newName + newBio + newLat + newLong);
    

    update(myObj);


  })

  /**
   * This function will update the bio with its new values. 
   * @return obj with either success or error. 
   */
   function update(bioData) {
     console.log("client bio data:" , bioData);
     
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



