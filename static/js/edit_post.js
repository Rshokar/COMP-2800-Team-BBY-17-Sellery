const editModal =
  `
  <div class="edit_card_container">
  <div class="create-post">
    <button class="close"><i class="fas fa-times"></i></button>
    <button class="delete"><i class="fas fa-trash-alt"></i></button>
    <button class="back"><i class="fas fa-arrow-left"></i></button>
    
  
    <form class="post_form" enctype="multipart/form-data" action="/update_post" method="POST">
      <legend>Edit Post</legend>
      <label class="title_label" for="title">Post title:</label>
      <input type="text" id="title" name="title" required>
      <label for="quantity">Quantity:</label>
      <input type="number" id="quantity" min="1" max="100" name="quantity" required>
      <label for="price">Price:</label>
      <input type="number" id="price" min="1" max="100" step="0.01" name="price" required>
      <div class="radio-container">
        <label for="bundle">Bundle</label>
        <input id="bundle" type="radio" name="unit" value="bundle" checked="checked">
        <label for="weight">Weight</label>
        <input id="weight" type="radio" name="unit" value="weight">
      </div>
      <label for="weightOptions">Choose Weight Option:</label>
      <select name="weightOptions" id="weightOptions">
        <option value="gram">gram</option>
        <option value="kilogram">kilogram</option>
      </select>
      <input accept="image/*" type="file" name="editedImage" id="editImage">
      <label for="description">Description:</label>
      <textarea id="description" name="description" required></textarea>
      <button type="button" class="next">Next</button>
      <input type="hidden" name="postId" id="post_id_container">
      <p class="error"></p>
    </form>
  
    <div class="center-user" id="edit-card-post">
      <h3>Preview Post</h3>
      <div class="property-card" id="edit-property-card">
        <div class=".property-card-image">
          <img id="img-goes-here" src="/pics/the_sellery.jpg">
        </div>
        <div class="property-card-description">
          <div id="name">
            <h3 class="title-preview"></h3>
            <h5 class="name-preview"></h5>
          </div>
          <div id="bio"><span class="bio-preview">
              <p>{{ new_post.description }}</p>
            </span></div>
          <div class="price-preview"></div>
          <span class="quantity-preview"></span>
          <span class="units-preview"></span>
          <p class="time-preview"></p>
        </div>
      </div>
      <button type="button" class="submit">Submit</button>
    </div>
  
    <div id="confirmation">
      <p>Are you sure you want to delete this post?</p>
      <button class="yes">Yes</button><button class="no">No</button>
    </div>
  </div>
  </div>
  `

//Append for to HTML 
$("#edit-posting").append(editModal);

const edit_post_card = document.querySelector(".edit_card_container");
const edit_post_close = document.querySelector(".edit_card_container .close");
const edit_post_back = document.querySelector(".edit_card_container .back");
const edit_post_form = document.querySelector("#edit-posting .post_form");
const edit_post_preview = document.getElementById("edit-card-post");
const edit_post_confirm = document.querySelector("#edit-posting #confirmation");
const radioButtons = document.querySelectorAll('#edit-posting div input[name="unit"]');
const labelforDropdown = document.querySelector('#edit-posting label[for="weightOptions"]');
const dropDown = document.querySelector('#edit-posting select[name="weightOptions"]');

edit_post_back.addEventListener("click", (e) => {
  console.log("Hello");
  edit_post_preview.style.display = "none";
  edit_post_form.style.display = "block";
  edit_post_back.style.display = "none";
})

/**
 * This adds an click event listner to post  future use. 
 * @author Ravinder Shokar 
 * @version 1.0 
 * @date Mat 11 2021
 * @param id is the index where it located in the post list.
 */

"use strict";

function editPostEventListner(id, posting) {
  let query = "#" + id + " .edit"
  $(query).on("click", (e) => {
    editPosting(posting);
  })
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

  $(element + " #post_id_container").val(post.ID);

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
function deletePostEventListner(post) {
  $("#edit-posting .delete").on("click", (e) => {
    showConfirm();
    var yes = document.querySelector("#confirmation .yes");
    var no = document.querySelector("#confirmation .no");

    let yesEvent = () => {
      console.log("I Have Been Shot Dead", post);
      post.delete((results) => {
        edit_post_card.style.display = "none";
        hideConfirm();
        post.removeFromHTML();
        resetEditModal();
        console.log(results)
      })
    }

    let noEvent = () => {
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
  //console.log("hideConfirm");
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
  //console.log("hidePreview");
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
  //console.log("showForm");
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

    const bundle = $('#edit-posting #bundle')[0].checked; //false if unchecked, true if checked
    var unit;
    if (bundle) {
      unit = "bundle(s)";
    } else {
      let weightOption = document.querySelector("#edit-posting #weightOptions").value;
      unit = weightOption;
    }

    let obj = {
      title: $(element + " #title").val(),
      quantity: $(element + " #quantity").val(),
      price: $(element + " #price").val(),
      description: $(element + " #description").val(),
      units: unit,
      date_posted: now,
    }

    //console.log(obj);
    //console.log(post);

    $(element + " .post_form").css({ "display": "none" })

    $(element + " .title-preview").html(obj.title)
    $(element + " .name-preview").html(post.un)
    $(element + " .bio-preview").html(obj.description)
    $(element + " .price-preview").html(`Price: $${obj.price}`)
    $(element + " .quantity-preview").html(`Quantity: ${obj.quantity}`)
    $(element + " .units-preview").html(obj.units)
    $(element + " .time-preview").html(now)

    $(element + " #edit-card-post").css({
      "display": "block"
    })

    $(element + " .back").css({
      "display": "block",
    })
    submitEditEventListner(post, obj);

  })
}




const edit_image = document.querySelector("#editImage");
const edit_img_container = document.querySelector("#edit-posting #img-goes-here");

const edit_form = document.querySelector('.edit_card_container .post_form');

edit_image.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    edit_img_container.src = URL.createObjectURL(file);
  }
})

/**
 * This post the edit post form to the server. The server then updates the post 
 * and reloads the page. 
 * @author Ravinder Shokar 
 * @version 1.0 
 * @date May 12 2021 
 * @param {Post} post is the post we are updating 
 */
function submitEditEventListner(post, values) {
  const element = "#edit-posting .edit_card_container"
  let query = element + " .submit";
  //console.log("Ready to submit")
  //console.log(edit_form);

  //console.log(query);

  $(query).on('click', (e) => {
    edit_form.submit(function (e) {
      e.preventDefault();
    });
    resetEditModal();
  })
}






edit_post_close.addEventListener("click", function () {
  //console.log("Closed");
  edit_post_confirm.style.display = "none";
  edit_post_preview.style.display = "none";
  edit_post_back.style.display = "none";
  edit_post_form.style.display = "block";
  edit_post_card.style.display = "none";

});

radioButtons[0].addEventListener('click', () => {
  labelforDropdown.style.display = "none";
  dropDown.style.display = "none";
});

radioButtons[1].addEventListener('click', () => {
  labelforDropdown.style.display = "block";
  dropDown.style.display = "block";
});

/**
 * This function will reset the modal to its original state
 * @author Ravinder Shokar 
 * @version 1.0 
 * @date May 13 2021
 */
function resetEditModal() {
  edit_post_confirm.style.display = "none";
  edit_post_preview.style.display = "none";
  edit_post_form.style.display = "block";
  edit_post_back.style.display = "none";
  edit_post_card.style.display = "none";
}
