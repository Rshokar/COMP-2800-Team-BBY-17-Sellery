const confirm_button = document.querySelector('#submit');

confirm_button.addEventListener('click', function(event) {
    event.preventDefault();
    
    const title = document.querySelector("#title").value;
    const quantity = document.querySelector("#quantity").value;
    const price = document.querySelector("#price").value;
    const desc = document.querySelector("#description").value;
    
    
    if (title != '' && desc != '' && quantity != '' && price != '') {
        const confirm_card = document.createElement('div');
        const form = document.querySelector('.post_form');
        confirm_card.setAttribute("class", "property-card");
        confirm_card.setAttribute("id", "post_details");
        confirm_card.innerHTML = 
        `<div class="property-card" id="card-detail">
            <a href="#">
                <div class="property-image2">
                    <div class="property-image-title">
                        
                    </div>
                </div>
            </a>
            <div class="property-description">
                <h5>${title}</h5>
                <p>Description: ${desc}</p>
                <p>Price: ${price}</p>
                <p>Unit: ${quantity}</p>
            </div>
            <a href="#">
                <div class="property-social-icons">
                   
                </div>
            </a>
        </div>` 
        form.style.display = "none";
        form.after(confirm_card);
        confirm_card.style.display = "initial";
    } else {
        const error = document.querySelector('.error');
        error.innerHTML = "Please fill all the requirements";
    }
});