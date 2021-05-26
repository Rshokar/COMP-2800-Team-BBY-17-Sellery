/**
 * @author Jimun Jang
 * @date May 06 2021
 */

"use strict";

console.log("new_post.js")

const newPostModal =
  `
<div class="new_card_container">
<div class="create-post">
 <button class="close"><i class="fas fa-times"></i></button>
 <button class="back"><i class="fas fa-arrow-left"></i></button>

 <form class="post_form" enctype="multipart/form-data" action="/uploadPost" method="POST">
   <legend>Create Post</legend>
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
   <input accept="image/*" type="file" name="postImage" id="image">
   <label for="description">Description:</label>
   <textarea id="description" name="description" required></textarea>
   <p class="error"></p>
   <button type="button" class="next">Next</button>
 </form>

 <div class="center-user preview" id="new-card-post">
   <h3>Preview Post</h3>
   <div class="property-card">
     <div class=".property-card-image">
       <img id="img-goes-here" src="/pics/the_sellery.jpg">
     </div>
     <div class="property-card-description">
       <div id="name">
         <h3 class="title-preview"></h3>
         <h5 class="name-preview"></h5>
       </div>
       <div id="bio"><span class="bio-preview">
           <p class="description-preview"></p>
         </span></div>
       <span class="price-preview"></span>
       <span class="quantity-preview"></span>
       <span class="units-preview"></span>
       <p class="time-preview"></p>
     </div>
   </div>
   <button type="button" class="submit">Submit</button>
 </div>
</div>
</div>

`
$("#new-post").append(newPostModal);


const submit_button = document.querySelector('#new-post .submit');
const preview = document.querySelector("#new-card-post");
const form = document.querySelector("#new-post .post_form");
const next_button = document.querySelector("#new-post .next");

const plus_button = document.querySelector("#new_post_container");
const new_post_card = document.querySelector(".new_card_container");
const close_new_post = document.querySelector("#new-post .close");
const back_new_post = document.querySelector("#new-post .back");

const image = document.querySelector("#new-post #image");
const img_container = document.querySelector("#new-card-post #img-goes-here");

image.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    img_container.src = URL.createObjectURL(file);
  }
})

plus_button.addEventListener("click", function () {
  new_post_card.style.display = "initial";
});

close_new_post.addEventListener("click", function () {
  new_post_card.style.display = "none";
  preview.style.display = "none";
  form.style.display = "block"
  form.reset();
});

image.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    img_container.src = URL.createObjectURL(file);
  }
})

next_button.addEventListener('click', function () {

  let obj;

  const title = document.querySelector("#new-post #title").value;
  const quantity = document.querySelector("#new-post #quantity").value;
  const price = document.querySelector("#new-post #price").value;
  const desc = document.querySelector("#new-post #description").value;

  // boolean value
  const bundle = document.querySelector('#new-post #bundle').checked;

  const time = new Date().toDateString();
  var unit;

  const img_src = img_container.src;

  if (title != '' && desc != '' && quantity != '' && price != '') {

    form.style.display = "none";
    preview.style.display = "block";
    back_new_post.style.display = "block"

    if (bundle) {
      unit = "bundle(s)";
    } else {
      let weightOption = document.querySelector("#new-post #weightOptions").value;
      unit = weightOption;
    }

    obj = {
      title: title,
      quantity: quantity,
      price: price,
      description: desc,
      units: unit,
      time: time,
      image: img_src
    }
    submitNewEventListner(obj);
  } else {
    const error = document.querySelector('#new-post .error');
    error.textContent = "You must fill the requirements above";
  }
})

/**
 * This event listner allows users to take a step back when making a post 
 * @author Ravinder Shokar 
 * @version 1.0 
 * @date May 25 2021
 * @param {} post 
 */
back_new_post.addEventListener("click", (e) => {
  preview.style.display = "none";
  form.style.display = "block";
  back_new_post.style.display = "none";
})

/**
 * This event listner is responsible for filling out preview HTML then submitting 
 * to MongoDB
 * @author Ravinder Shokar
 * @versio 1.0 
 * @date May 13 2021
 * @param {post} post being submited to DB
 */
function submitNewEventListner(post) {
  console.log(post);
  $("#new-post .title-preview").text(post.title)
  $("#new-post .name-preview").text()
  $("#new-post .description-preview").text(post.description)
  $("#new-post .price-preview").text(post.price)
  $("#new-post .quantity-preview").text(post.quantity)
  $("#new-post .time-preview").text(post.time)
  $("#new-post .units-preview").text(post.units);

  /**
  * This function gathers listing data from HTML and sends a post with the use
  * of the form.submit() meathod. 
  * @author Jimun Jang 
  * @author Ravinder Shokar 
  * @date May 07 2021
  * @version 1.0 
  */
  $("#confirm").click((e) => {
    console.log("I have been clicked");
    form.submit(function (e) {
      e.preventDefault();
    });
    resetNewPostModal();
  })
};


/**
 * This will pop up a modal allowing users to confirma a post. 
 */
$('#new-post .submit').click(() => {
  console.log("Jello")
  $('#pop-up-background').css("visibility", "visible");
  $('#pop-up-menu').css("visibility", "visible");
})

/**
 * This function will reset the modal. 
 * @author Ravinder Shokar 
 * @version 1.0 
 * @date May 13 2021 
 */
function resetNewPostModal() {
  resetInputForm()
  preview.style.display = "none";
  new_post_card.style.display = "none";
}

/**
 * This function sets the new post form values to none
 * @author Ravinder Shokar 
 * @version 1.0 
 * @date May 13 2021 
 */
function resetInputForm() {
  form.style.display = "block";
  document.querySelector("#title").value = "";
  document.querySelector("#quantity").value = "";
  document.querySelector("#price").value = "";
  document.querySelector("#description").value = "";
}

/**
 * dropdown for weight radiobutton
 * @author Jimun Jang
 * @version 1.0 
 * @date May 21 2021 
 */
const radiobuttons = document.querySelectorAll('#new-post div input[name="unit"]');
const labelForDropdown = document.querySelector('#new-post label[for="weightOptions"]');
const dropdown = document.querySelector('#new-post select[name="weightOptions"]');

radiobuttons[0].addEventListener('click', () => {
  labelForDropdown.style.display = "none";
  dropdown.style.display = "none";
});

radiobuttons[1].addEventListener('click', () => {
  labelForDropdown.style.display = "block";
  dropdown.style.display = "block";
});