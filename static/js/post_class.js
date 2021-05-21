/**
 * This is the post class. Add meathods bellow to add functionality to
 * the post class
 * @author Ravinder Shokar 
 * @version 1.0
 * @date May 06 2021 
 */
"use strict";

class Post {

  /**
   * This is the constructor of the post class
   * @param {*} title of post being sold (Usually name of a vegetable)
   * @param {*} quantity number of items being sold
   * @param {*} units of meassurement
   * @param {*} description of the produce being sold
   */
  constructor(title, quantity, units, description, inID, userName, price, datePosted, htmlID, userID, currentUser) {
    this.t = title;
    this.q = quantity;
    this.u = units;
    this.d = description;
    this.ID = inID;
    this.un = userName;
    this.pri = price;
    this.posted = datePosted;
    this.HLID = htmlID;
    this.uID = userID;
    this.currentUserID = currentUser;
  }

  /**
   * Gets the title of the post.
   * @return the title of the post. 
   */
  get title() {
    return this.t
  }

  /**
   * Gets the quantity of the post.
   * @return the quantity of the post. 
   */
  get quantity() {
    return this.q
  }


  /**
   * Gets the unit of sale of post.
   * @return the unit of sale of the post. 
   */
  get unit() {
    return this.u
  }

  /**
   * Gets the description of the post.
   * @return the description of the post. 
   */
  get description() {
    return this.d
  }

  /**
   * Gets the ID of the post.
   * @return the ID of the post. 
   */
  get postID() {
    return this.ID
  }

  /**
 * Gets name of the user who posted post.
 * @return the name of the user who posted post. 
 */
  get userName() {
    return this.un
  }

  /**
* Gets the price of the product sold.
* @return the price of the product sold. 
*/
  get price() {
    return this.pri
  }

  /**
 * Gets the date the post was posted.
 * @return the date the post was posted. 
 */
  get datePosted() {
    return this.posted
  }

  /**
   * Gets the user ID of who posted the 
   * Post. 
   * @return user ID of who posted the Post
   */
  get userID() {
    return this.uID
  }

  /**
 * This function sets the HTML ID.
 */
  set htmlID(inID) {
    this.HLID = inID;
  }

  /**
  * This function gets the HTML ID.
  */
  get htmlID() {
    return this.HLID;
  }

  /**
   * This function will allow the post to be updated 
   * with an obj.
   * @param {JSON} obj 
   */
  updateWithJSON(obj) {
    this.posted = obj.date_posted;
    this.pri = obj.price;
    this.d = obj.description;
    this.u = obj.units;
    this.q = obj.quantity;
    this.t = obj.title;
  }


  /**
   * This function will update the current object with its current values. 
   * @return obj with either success or error. 
   */
  update() {
    $.ajax({
      url: "/update_post",
      type: "POST",
      dataType: "JSON",
      data: this.getJSON(),
      success: (data) => {
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

  /**
   * This meathod will delete the current object from the DB.
   * @returns obj with either success or error
   */
  async delete(execute) {
    console.log("They are trying to delete my", this.ID)
    $.ajax({
      url: "/delete_post",
      type: "POST",
      dataType: "JSON",
      data: this.getJSON(),
      success: (data) => {
        execute(data)
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

  /**
   * This function will remove the posting from the HTML
   * @date May 13 2021
   */
  removeFromHTML() {
    let htmlID = this.HLID
    $("#" + htmlID).remove();
  }

  /**
   * This function will append the posting to the HTML
   * @date May 13 2021
   */
  appendHTML() {
    $("#card-listing").prepend(this.buildHTML())
    editPostEventListner(this.HLID, this)
  }

  /**
     * This function will append the posting to the HTML
     * @date May 13 2021
     */
  displayInProximityContainer() {
    $("#proximity-card-listing").prepend(this.buildHTML())
    editPostEventListner(this.HLID, this)
  }

  /**
   * THis will generate the appropriate HTML for the posting. 
   * @date May 13 2021
   */
  buildHTML(data) {
    let html =
      `
    <div class="center-user listing" id=${this.HLID}>
      <div class="property-card">
        <div class=".property-card-image">
          <img id="img-goes-here">
        </div>
      <div class="property-card-description">
        <div class="name">
          <h3 class='title'>${this.t}</h3>
          <a href="/storefront?user=${this.uID}"><h5 calss='name'>${this.un}</h5></a>
        </div>
      <div id="bio"><span id="bio-goes-here"><p class='description'>${this.d}</p></span></div>
        <span class='price'>Price: $${this.pri}</span>
        <span class='quantity'>Quantity: ${this.q} ${this.u}</span>
        <p class='date-posted'>${this.posted}</p>
      `
    if (this.uID == this.currentUserID) {
      html += '<i class="edit fas fa-edit"></i></div>'
    }

    return html;
  }

  /**
   * This function will update the listing in the HTML
   * @date May 13 2021 
   */
  updateHTML() {
    $("#" + this.HLID + " .title").text(this.t)
    $("#" + this.HLID + " .description").text(this.d)
    $("#" + this.HLID + " .price").text("Price: $" + this.pri)
    $("#" + this.HLID + " .quantity").text("Quantity: " + this.q + " " + this.u)
    $("#" + this.HLID + " .date-posted").text(this.t)
  }


  /**
   * This function will return an JSON obj containing all post details. 
   * @returns JSON obj
   */
  getJSON() {
    //if (this.uID === undefined) {
    //  throw "Post does not have an ID. Must have ID before update"
    //}
    let obj = {
      title: this.t,
      quantity: this.q,
      units: this.u,
      price: this.pri,
      description: this.d,
      userID: this.uID,
      ID: this.ID
    }
    console.log(obj);
    return obj
  }


  /**
   * This meathod returns a string representation of the post class.
   */
  toString() {
    let str = t + "\n";
    str += this.q + "\n";
    str += this.u + "\n";
    str += this.d + "\n";
    return str;
  }
}

/**
 * This function will buiild a list of post. 
 * @author Ravinder Shokar 
 * @version 1.0 
 * @date Ma 11 2021
 */
function buildPostList(posts, currentUserId) {
  let lst = []
  let post;


  for (post in posts) {
    let newPost = posts[post];
    lst[post] = new Post(
      newPost.title,
      newPost.quantity,
      newPost.units,
      newPost.description,
      newPost._id,
      newPost.poster_name,
      newPost.price,
      newPost.time,
      post,
      newPost.user_id,
      currentUserId
    )
  }
  console.log(lst);

  return lst;

}



