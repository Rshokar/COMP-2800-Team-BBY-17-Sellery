/**
 * This is the post class. Add meathods bellow to add functionality to
 * the post class
 * @author Ravinder Shokar 
 * @version 1.0
 * @date May 06 2021 
 */
"use_strict";

class Post {

  /**
   * This is the constructor of the post class
   * @param {*} title of post being sold (Usually name of a vegetable)
   * @param {*} quantity number of items being sold
   * @param {*} units of meassurement
   * @param {*} description of the produce being sold
   */
  constructor(title, quantity, units, description, inID) {
    this.t = title;
    this.q = quantity;
    this.u = units;
    this.d = description;
    this.uID = inID;
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
   * This function sets the unit of sale.
   */
  set unit(inU) {
    this.u = inU;
  }

  /**
   * This function sets the quantity.
   */
  set quantity(inQ) {
    this.q = inQ;
  }

  /**
   * This function sets the description.
   */
  set description(inD) {
    this.d = inD;
  }

  /**
   * This function sets the title.
   */
  set title(inT) {
    this.t = inT;
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
   * @returns This function will delete the post from the DB
   * 
  */

  /**
   * This function will return an JSON obj containing all post details. 
   * @returns JSON obj
   */
  getJSON() {

    if (this.uID === undefined) {
      throw "Post does not have an ID. Must have ID before update"
    }
    let obj = {
      title: this.t,
      quantity: this.q,
      units: this.u,
      description: this.d,
      ID: this.uID
    }

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