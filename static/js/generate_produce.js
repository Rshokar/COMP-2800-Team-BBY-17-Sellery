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
      for (post in newData) {
        html = buildHTML(newData[post]);
        $("#card-listing").append(html);
        editPostEventListner(post, newData[post])
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
function editPostEventListner(id, posting) {
  let query = "#" + id + " .edit"
  $(query).on("click", (e) => {
    editPosting(posting);

  })
}

/**
 * This funcitons builds the HTML for produce listings
 * @author Ravinder Shokar
 * @date May 11 2021
 * @version 1.0
 * @param {post} data 
 * @returns 
 */
function buildHTML(data) {

  html =
    `
  <div class="center-user listing" id=${data.HLID}>
    <div class="property-card">
      <div class=".property-card-image">
        <img id="img-goes-here">
      </div>
    <div class="property-card-description">
      <div id="name">
        <h3>${data.title}</h3>
        <h5 id="name-goes-here">${data.userName}</h5>
      </div>
    <div id="bio"><span id="bio-goes-here"><p>${data.description}</p></span></div>
      <span>${data.price}</span>
      <span>${data.quantity} quantity</span>
      <p>${data.datePosted}</p>
      <i class="edit fas fa-edit"></i>
    </div>
    `

  return html;
}


/**
 * This function will pull the HTML up into users sight, 
 * and fill in form data. 
 * @author Ravinder Shokar
 * @date May 11 2021 
 * @version 1.0
 * @param {Post} post produce post being updated. 
 */
function editPosting(post) {
  const element = "#edit-posting .edit_card_container"

  $(element).css({
    "display": "block"
  })

  $(element + " #title").val(post.t);
  $(element + " #quantity").val(post.q);
  $(element + " #price").val(post.pri);
  $(element + " #description").val(post.d);

  nextPageEventListner(post);
  deletePostEventListner(post);

}



/**
 * This event listner will delete a post. 
 * @author Ravinder Shokar 
 * @version 1.0 
 * @date May 12th 2021
 * @param {post} post that is going to be deleted. 
 */
async function deletePostEventListner(post) {
  $("#edit-posting .delete").on("click", (e) => {
    showConfirm();
    var yes = document.querySelector("#confirmation .yes");
    var no = document.querySelector("#confirmation .no");

    yesEvent = async () => {
      console.log("I Have Been Shot Dead", post);
      result = post.delete((results) => {
        hideConfirm()
        hidePreview()
        showForm()
        $(".edit_card_container").css({
          "display": "none"
        })
        console.log(result)
      })



    }

    noEvent = () => {
      console.log("I Have Been Saved", post);
      hideConfirm();
    }

    yes.removeEventListener("click", yesEvent, false);
    yes.addEventListener("click", yesEvent, false);

    no.removeEventListener("click", noEvent, false);
    no.addEventListener("click", noEvent, false);

  })
}

/**
 * This function shows the confirmation page
 * @author Ravinder Shokar 
 * @version 1.0
 * @date May 12 2021
 */
function showConfirm() {
  const element = "#confirmation";
  $(element).css({
    "display": "block",
  })
}

/**
 * This function will close the confirmation page
 * @author Ravinder Shokar 
 * @version 1.0 
 * @date May 12 2021
 */
function hideConfirm() {
  console.log("hideConfirm");
  const element = "#confirmation";
  $(element).css({
    "display": "none",
  })
};

/**
 * This function will close the confirmation page
 * @author Ravinder Shokar 
 * @version 1.0 
 * @date May 12 2021
 */
function hidePreview() {
  console.log("hidePreview");
  const element = "#edit-card-post";
  $(element).css({
    "display": "none",
  })
};


/**
 * This function will close the confirmation page
 * @author Ravinder Shokar 
 * @version 1.0 
 * @date May 12 2021
 */
function showForm() {
  console.log("showForm");
  const element = "#edit-posting .post_form";
  $(element).css({
    "display": "block",
  })
};


/**
 * This event listner will switch modal page to preview
 * by updating CSS properties.  
 * @author Ravinder Shokar 
 * @version 1.0 
 * @date May 11 2021
 * @param {Post} post being edited
 */
function nextPageEventListner(post) {
  const now = new Date().toDateString();
  const element = "#edit-posting .edit_card_container"
  $("#edit-posting .next").on("click", (e) => {
    let obj = {
      title: $(element + " #title").val(),
      quantity: $(element + " #quantity").val(),
      price: $(element + " #price").val(),
      description: $(element + " #description").val(),
      units: post.un,
      date_posted: now,
    }

    console.log(obj);
    console.log(post);

    $(element + " .post_form").css({ "display": "none" })

    $(element + " .title-preview").html(obj.title)
    $(element + " .name-preview").html(post.un)
    $(element + " .bio-preview").html(obj.description)
    $(element + " .price-preview").html(obj.price)
    $(element + " .quantity-preview").html(obj.quantity)
    $(element + " .time-preview").html(now)

    $(element + " #edit-card-post").css({
      "display": "block"
    })

    submitEventListner(post, obj);

  })
}

/**
 * This event listner is responsible for updating the Post object and 
 * then calling the update method of the Post object. In this event
 * listner the modal window will also be closed. 
 * @author Ravinder Shokar 
 * @version 1.0 
 * @date May 12 2021 
 * @param {Post} post is the post we are updating 
 */
function submitEventListner(post, values) {
  const element = "#edit-posting .edit_card_container"
  let query = element + " .submit";

  console.log(query);

  $(query).on('click', (e) => {
    console.log(post);
    post.updateWithJSON(values);
    console.log(post)
    let result = post.update();
    console.log(result);
  })
}

const post_card = document.querySelector(".edit_card_container");
const close = document.querySelector(".close");
const delete_post = document.querySelector("#edit-posting .delete");

close.addEventListener("click", function () {
  post_card.style.display = "none";
  hideConfirm();
  hidePreview();
  showForm();
});

