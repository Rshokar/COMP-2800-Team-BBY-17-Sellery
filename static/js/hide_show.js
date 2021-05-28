"use strict";

const plus_button = document.querySelector("#new_post_container");
const post_card = document.querySelector(".new_card_container");
const close = document.querySelector(".close");



plus_button.addEventListener("click", function () {
    post_card.style.display = "initial";
});

close.addEventListener("click", function () {
    post_card.style.display = "none";
});


