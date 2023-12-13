const displayElem = document.getElementById('display')
let form = document.getElementById('search-form')
let searchBar = document.getElementById('search-bar')
let image;

function init() {
    fetchImages()
}

async function fetchImages(query = 'japan') {
    let response = await fetch(`https://api.unsplash.com/search/photos?page=1&query=${query}&client_id=OmG0FZqCP8A7GhQjYOIs8mqplMHO4OD0xWwoopV1CaA`)
    let data = await response.json();
    image = data.results[0]
    displayImage(image)
}

function displayImage(image) {
    let imgElem
    if (displayElem.hasChildNodes()) {
        displayElem.removeChild(displayElem.firstChild)
    }
    imgElem = document.createElement('img')
    imgElem.setAttribute('src', image.urls.regular)
    displayElem.appendChild(imgElem)
}

// form stuff
form.addEventListener('submit', function(event) {
    event.preventDefault()
    fetchImages(searchBar.value)
})


