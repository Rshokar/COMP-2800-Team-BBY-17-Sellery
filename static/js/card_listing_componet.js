const app = new Vue({
    el: '#card-listing',
    data: {
        posts: {

        }
    }
})

/**
 * This function will generate posts in html
 * @author Gurshawn Sekhon
 * @date May-07-2021
 */
function updateHTML(listings) {
    app.posts = listings;
}

