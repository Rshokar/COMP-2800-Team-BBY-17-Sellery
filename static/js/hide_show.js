const plus_button = document.querySelector("#new_post_container");
const post_card = document.querySelector(".post_card_container");
const close = document.querySelector(".close");
const next_button = document.querySelector(".submit");

plus_button.addEventListener("click", function() {
    post_card.style.display = "flex";
});

close.addEventListener("click", function() {
    post_card.style.display = "none";
});



