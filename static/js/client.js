/**
 * @author Jimun Jang
 * @date May 06 2021
 */
const confirm_button = document.querySelector('#submit');

const app = new Vue({
    el: "#new-card-post",
    data: {
        new_post: {}
    }
})

confirm_button.addEventListener('click', function (event) {
    event.preventDefault();

    const title = document.querySelector("#title").value;
    const quantity = document.querySelector("#quantity").value;
    const price = document.querySelector("#price").value;
    const desc = document.querySelector("#description").value;
    const units = 0
    const time = new Date().toDateString();


    if (title != '' && desc != '' && quantity != '' && price != '') {
        $(".post_form").css({
            "display": "none",
        });

        $("#new-card-post").css({
            "display": "initial",
        })


        obj = {
            title: title,
            quantity: quantity,
            price: price,
            description: desc,
            units: units,
            time: time
        }

        app.new_post = obj
    } else {
        const error = document.querySelector('.error');
        error.innerHTML = "Please fill all the requirements";
    }
});


/**
 * This function gathers listing data from HTML and sends it to PostOnePost
 * component to be submitted to DB
 * @author Jimun Jang 
 * @author Ravinder Shokar 
 * @date May 07 2021
 * @version 1.0 
 */
$("#post_card_container .submit").click((e) => {
    console.log("I have been clicked");
    e.preventDefault;
    data = getPostData();

    // Result will contain an OBJ with value error or success. Later 
    // Implement if check to see if post was sent succesfully. 
    result = postOnePost(data);
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
    let t = $("#new-card-post .title").text()
    let d = $("#new-card-post .desc").text()
    let q = $("#new-card-post .quantity").text()
    let u = $("#new-card-post .units").text()
    let p = $("#new-card-post .price").text()
    let timestamp = $("#new-card-post .time").text();

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