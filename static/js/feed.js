
"use strict";
import { displayCard } from './js/card_listing_componet.js';
import { getListing } from './js/generate_produce.js';


$(document).ready(function () {

    console.log("Successfully opened document");



    let listing = genListing();
    console.log(listing)
    updateHTML(listing);

})

