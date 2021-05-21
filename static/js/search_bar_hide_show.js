const dropdown = document.querySelector('#dropdown');
const status = document.querySelector('#dropdown i');
const search_bar = document.querySelector('#proximity-search-bar');
const inputField = document.querySelector('#proximity-search');
const proximityBtn = document.querySelector('#proximity-button');
const p = document.querySelector('.error-handle');
const viewAll = document.querySelector('#drop');

viewAll.addEventListener('click', () => {
    window.location.href = "/feed";
})

inputField.addEventListener('click', () => {
    p.textContent = "";
    inputField.value = "";
})

dropdown.addEventListener('click', () => {
    const currentStatus = status.getAttribute('class');

    if (currentStatus == 'fas fa-caret-down') {
        status.setAttribute('class', 'fas fa-caret-up');
        search_bar.style.display = "flex";
        p.textContent = "";
    } else {
        status.setAttribute('class', 'fas fa-caret-down');
        search_bar.style.display = "none";
        p.textContent = "";
    }
});

proximityBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const distance = document.querySelector('input[id="proximity-search"]').value;
    const distanceInNum = Number(distance);
    const container = document.querySelector('#proximity-card-listing');
    const proximityCards = document.querySelectorAll('#proximity-card-listing div');
    if (isNaN(distanceInNum)) {
        p.textContent = "value is a not number";
    } else {
        $.ajax({
            url: "/proximity_search",
            dataType: "json",
            type: "GET",
            data: {
                distance: distanceInNum
            },
            success: function (data) {
                console.log(data);
                const allData = document.querySelector('#card-listing');
                proximityCards.forEach((card) => {
                    card.remove();
                });
                if (data.result.length > 0) {
                    allData.style.display = "none";
                    newData = buildPostList(data.result, data.user_id);
                    for (post in newData) {
                        console.log(post)
                        newData[post].displayInProximityContainer();
                    }
                    container.style.display = "initial";
                } else {
                    allData.style.display = "none";
                    container.style.display = "none";
                    p.textContent = "No Matching Results";
                }

                // search bar to filter cards by title or post owner's name
                const title_list = document.querySelectorAll('#proximity-card-listing .listing h3');
                const search_by_title = document.querySelector('#feed_search');

                search_by_title.addEventListener('keyup', function (e) {
                    const term = e.target.value.toLowerCase();
                    title_list.forEach(function (card) {
                        const title_name = card.parentElement.querySelector('h3').textContent;
                        const post_owner_name = card.parentElement.querySelector('h5').textContent;
                        if (title_name.toLowerCase().indexOf(term) != -1 || post_owner_name.toLowerCase().indexOf(term) != -1) {
                            card.parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                        } else {
                            card.parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                        }
                    })
                })
                return data
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#p1").text(jqXHR.statusText);
                console.log("ERROR:", jqXHR, textStatus, errorThrown);
            }
        })
    }
});