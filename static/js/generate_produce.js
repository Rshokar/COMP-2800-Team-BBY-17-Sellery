/**
 * This function will generate posts in html
 * @author Gurshawn Sekhon
 * @date May-07-2021
 */

// might need to take in more arguments for filtering
// no input required, gets data from user and displays to user
function genListing() {
  $.ajax({
    url: "/generate_produce",
    dataType: "json",
    type: "GET",
    success: function (data) {
      console.log("Listing is generated: ", data);
      newData = buildPostList(data);
      app.posts = newData
      for (post in newData) {
        console.log(post)
        editPostEventListner(post)
      }
      return data
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#p1").text(jqXHR.statusText);
      console.log("ERROR:", jqXHR, textStatus, errorThrown);

    }
  })
}


/**
 * This adds an click event listner to post  future use. 
 * @author Ravinder Shokar 
 * @version 1.0 
 * @date Mat 11 2021
 * @param index is the index where it located in the post list.
 */
function editPostEventListner(id) {
  let query = "#" + id + " .edit"
  let button = document.getElementById(id)
  console.log(button);
}