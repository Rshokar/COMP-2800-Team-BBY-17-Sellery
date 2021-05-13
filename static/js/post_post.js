/**
 * This component will post data to the node server. Will return an obj with 
 * message, status, data. 
 * 
 * eg. 
 * obj = {
 *  data: data,
 *  message: "Hello Anyone",
 *  status: "success"
 * } 
 * 
 * @author Ravinder Shokar 
 * @version 1.0 
 * @date May 06 2021
 */
function postOnePost(post) {
  $.ajax({
    url: "/post_post",
    type: "POST",
    dataType: "JSON",
    data: post,
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
