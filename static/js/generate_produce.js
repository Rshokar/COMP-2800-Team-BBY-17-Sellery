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

      // search bar to filter cards by title or post owner's name
      const title_list = document.querySelectorAll('#card-listing .listing h3');
      const search_by_title = document.querySelector('#feed_search');

      search_by_title.addEventListener('keyup', function (e) {
        const term = e.target.value.toLowerCase();
        title_list.forEach(function (card) {
          const title_name = card.parentElement.querySelector('h3').textContent;
          const post_owner_name = card.parentElement.querySelector('h5').textContent;
          if (title_name.toLowerCase().indexOf(term) != -1 || post_owner_name.toLowerCase().indexOf(term) != -1) {
            card.parentElement.parentElement.parentElement.parentElement.style.display = 'block';
          } else {
            card.parentElement.parentElement.parentElement.parentElement.style.display = 'none';
          }
        })
      })
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
    dataType: "JSON",
    type: "GET",
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
    dataType: "JSON",
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
