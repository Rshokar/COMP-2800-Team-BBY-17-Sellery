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
      newData = buildPostList(data.results, data.user_id);
      for (post in newData) {
        console.log(post)
        newData[post].appendHTML();
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
 * This function will generate posts in html for the storefront
 * @author Mike Lim
 * @date May-10-2021
 */

// might need to take in more arguments for filtering
// no input required, gets data from user and displays to user
function genMyStoreFrontListing() {
  $.ajax({
    url: "/generate_my_produce",
    dataType: "json",
    type: "GET",
    // use the user id
    // data: "userid",
    success: function (data) {
      console.log("Listing is generated: ", data);
      newData = buildPostList(data.results, data.userId);
      for (post in newData) {
        newData[post].appendHTML();
      }
      // app.posts = data;
      return data
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#p1").text(jqXHR.statusText);
      console.log("ERROR:", jqXHR, textStatus, errorThrown);

    }
  })
}

/**
 * This function will get the posting dependent on the userID passed in
 * @author Ravinder Shokar
 * @param {*} userId if the owner of the post. 
 */
function genStoreFrontListing(userId) {
  $.ajax({
    url: "/generate_user_produce",
    dataType: "json",
    type: "POST",
    data: {
      id: userId
    },
    success: function (data) {
      console.log("Listing is generated: ", data);
      newData = buildPostList(data.results, data.userId);
      for (post in newData) {
        newData[post].appendHTML();
      }
      // app.posts = data;
      return data
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#p1").text(jqXHR.statusText);
      console.log("ERROR:", jqXHR, textStatus, errorThrown);

    }
  })
}
