/**
 * @author Jimun Jang
 * @date May 06 2021
 */

console.log("new_post.js")

const newPostModal =
  `

<div class="new_card_container">
<div class="create-post">
 <button class="close"><i class="fas fa-times"></i></button>

 <form class="post_form">
   <legend>Create Post</legend>
   <label class="title_label" for="title">Post title:</label>
   <input type="text" id="title" name="title" required>
   <label for="quantity">Quantity:</label>
   <input type="number" id="quantity" min="1" max="100" required>
   <label for="price">Price:</label>
   <input type="number" id="price" min="1" max="100" step="0.01" required>
   <label for="description">Description:</label>
   <textarea id="description" name="description" required></textarea>
   <p class="error"></p>
   <button type="button" class="next">Next</button>
 </form>

 <div class="center-user preview" id="new-card-post">
   <h3>Preview Post</h3>
   <div class="property-card">
     <div class=".property-card-image">
       <img id="img-goes-here">
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



plus_button.addEventListener("click", function () {
  new_post_card.style.display = "initial";
});

close_new_post.addEventListener("click", function () {
  new_post_card.style.display = "none";
});


next_button.addEventListener('click', function () {

  const title = document.querySelector("#new-post #title").value;
  const quantity = document.querySelector("#new-post #quantity").value;
  const price = document.querySelector("#new-post #price").value;
  const desc = document.querySelector("#new-post #description").value;
  const units = 0
  const time = new Date().toDateString();

  if (title != '' && desc != '' && quantity != '' && price != '') {

    form.style.display = "none";
    preview.style.display = "block";

    obj = {
      title: title,
      quantity: quantity,
      price: price,
      description: desc,
      units: units,
      time: time
    }

    submitNewEventListner(obj);
  } else {
    const error = document.querySelector('#new-post .error');
    error.textContent = "You must fill the requirements above";
  }
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

  /**
  * This function gathers listing data from HTML and sends it to PostOnePost
  * component to be submitted to DB
  * @author Jimun Jang 
  * @author Ravinder Shokar 
  * @date May 07 2021
  * @version 1.0 
  */
  $("#confirm").click((e) => {
    console.log("I have been clicked");
    e.preventDefault;
    data = getPostData();
    resetNewPostModal();

    // Result will contain an OBJ with value error or success. Later 
    // Implement if check to see if post was sent succesfully. 
    result = postOnePost(data);

    window.location.href = '/feed';
  })
};

$('#new-post .submit').click(() => {
  $('#pop-up-background').css("visibility", "visible");
  $('#pop-up-menu').css("visibility", "visible");
})




/**
 * This function gathers and retunrs listing data from new-card-post in template.html
 * It return and JSON obj with format of 
 * 
 * obj = {
 *     title: t,
 *     description: d,
 *     quantity: q,
 *     units: u,
 *     price: p
 * }
 * @returns JSON obj with above format.
 * @author Ravinder Shokar 
 * @author Jimun Jang 
 * @date May 07 2021 
 */
function getPostData() {
  let t = $("#new-post .title-preview").text()
  let d = $("#new-post .description-preview").text()
  let q = $("#new-post .quantity-preview").text()
  let u = $("#new-post .units-preview").text()
  let p = $("#new-post .price-preview").text()
  let timestamp = $("#new-post .time-preview").text();

  console.log(timestamp);

  obj = {
    title: t,
    description: d,
    quantity: q,
    units: u,
    price: p,
    time: timestamp
  }

  console.log(obj);

  return obj

}

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

