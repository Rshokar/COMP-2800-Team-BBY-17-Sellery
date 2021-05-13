
$(document).ready(function () {

  genStoreFrontListing();
  genReviews();

  console.log("Made it to document.ready");

  /**
   * AJAX call to request the user info from the server
   */
  $.ajax({
    url: "/storefront-data",
    dataType: "json",
    type: "GET",
    data: { format: "getJSONBio" },
    success: function (data) {
      console.log("Data Received: ", data);
      let url = data[0].url;
      let name = data[0].name;
      let bio = data[0].bio;
      $("#name-goes-here").html(name);
      $("#bio-goes-here").html(bio);
      $("#img-goes-here").attr("src", url);
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
  const review_card = document.querySelector(".modal");
  const close = document.querySelector(".close");
  // const next_button = document.querySelector(".submit");

  reviews_button.addEventListener("click", function () {
    review_card.style.display = "block";
  });

  close.addEventListener("click", function() {
    console.log("x working");
    review_card.style.display = "none";
  });

  window.onclick = function (event) {
    if (event.target == review_card) {
      console.log("window close");
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
})

