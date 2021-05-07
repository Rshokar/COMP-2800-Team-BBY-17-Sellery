// const { ObjectID } = require("bson");

$(document).ready(function() {

  console.log("Made it to document.ready");

  $.ajax({
    url: "/storefront-data",
    dataType: "json",
    type: "GET",
    data: { format: "getJSONBio" },
    success: function(data) {
      console.log("Data Received: ", data);
      let url = data[0].url;
      let name = data[0].name;
      let bio = data[0].bio;
      $("#name-goes-here").html(name);
      $("#bio-goes-here").html(bio);
      $("#img-goes-here").attr("src", url);
    },
    error: function(jqXHR, textStatus, errorThrown) {
        $("#p1").text(jqXHR.statusText);
        console.log("ERROR:", jqXHR, textStatus, errorThrown);
    }
  })
})

