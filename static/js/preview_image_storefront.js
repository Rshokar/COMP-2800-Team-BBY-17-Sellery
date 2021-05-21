/**
   * Preview image before updating
   * @author Mike Lim
   * @date May-20-2021
   * https://stackoverflow.com/questions/5802580/html-input-type-file-get-the-image-before-submitting-the-form
   */
 function showPic(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $('#preview')
        .attr('src', e.target.result)
        .width(150)
        .height(150);
    };
    reader.readAsDataURL(input.files[0]);
  }
}