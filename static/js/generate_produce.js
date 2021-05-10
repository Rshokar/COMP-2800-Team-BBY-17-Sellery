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
            app.posts = data;
            return data
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#p1").text(jqXHR.statusText);
            console.log("ERROR:", jqXHR, textStatus, errorThrown);

        }
    })
}