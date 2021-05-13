const namelist = document.querySelectorAll('.property-description h5');
const searchBar = document.forms['search'].querySelector('input');

searchBar.addEventListener('keyup', function (e) {
    const term = e.target.value.toLowerCase();

    namelist.forEach(function (card) {
        const nameTitle = card.parentElement.querySelector('h5').textContent
        if (nameTitle.toLowerCase().indexOf(term) != -1) {
            card.parentElement.parentElement.parentElement.style.display = 'block';
        } else {
            card.parentElement.parentElement.parentElement.style.display = 'none';
        }
    });
});