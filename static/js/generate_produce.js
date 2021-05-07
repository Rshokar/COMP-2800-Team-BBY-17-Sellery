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

            return data;


        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#p1").text(jqXHR.statusText);
            console.log("ERROR:", jqXHR, textStatus, errorThrown);

        }
    })
}


/**
 * use if needed, if someone has their own data
 */
function printListing() {
    const app = new Vue({
        el: '#card-holder',
        data: {
            posts: data
        }
    })

    return output;
}


