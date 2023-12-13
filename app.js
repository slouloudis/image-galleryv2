let thumbContainer = document.getElementById('thumb-container')
let currentImageIndex = 0
const displayElem = document.getElementById('display')
let form = document.getElementById('search-form')
let searchBar = document.getElementById('search-bar')
let images;

function init() {
    fetchImages()
}

async function fetchImages(query = 'japan') {
    let response = await fetch(`https://api.unsplash.com/search/photos?page=1&query=${query}&client_id=OmG0FZqCP8A7GhQjYOIs8mqplMHO4OD0xWwoopV1CaA`)
    let data = await response.json();
    images = data.results
    updateDisplayImage(images[currentImageIndex])
    createThumbnails()
}

// form stuff
form.addEventListener('submit', function(event) {
    event.preventDefault()
    fetchImages(searchBar.value)
})


function createThumbnails() {
    thumbContainer.innerHTML = ''
    for (let image of images) {
        let thumbImg = document.createElement('img')

        thumbImg.setAttribute('src', image.urls.thumb)
        thumbImg.setAttribute('alt', image.alt_description)
        thumbImg.setAttribute('tabindex', '0')
        thumbImg.classList.add('thumb-image')
        thumbContainer.appendChild(thumbImg)
        thumbImg.addEventListener('click', function () {
            updateDisplayImage(image)
            document.getElementById('announcer').textContent = image.alt_description
        })
        thumbImg.addEventListener('keydown', function (event) {
            document.getElementById('announcer').textContent = image.alt_description
            if (event.key === 'Enter') updateDisplayImage(image)
            
        })
    }
}

function updateScrollBar(currentImage) {

    let thumbnails = thumbContainer.querySelectorAll('.thumb-image');
    let activeThumbnail;
    thumbnails.forEach(function (thumb) {
        if(thumb.getAttribute('src') === currentImage.urls.thumb) {
            activeThumbnail = thumb;
        }
    });

    if (activeThumbnail) {
        // getBoundingClientRect returns a fancy object that tells us where our elements are on the page. 
        const thumbRect = activeThumbnail.getBoundingClientRect();
        const containerRect = thumbContainer.getBoundingClientRect();

        // Calculate the position to scroll to, centering the active thumbnail. I found this online!
        let scrollLeftPos = activeThumbnail.offsetLeft + thumbRect.width / 2 - containerRect.width / 2;

        thumbContainer.scrollTo({
            left: scrollLeftPos,
            behavior: 'smooth'
        });
    }
}


function updateDisplayImage(image) {
    let currentDisplayImage = displayElem.firstChild

    if (!currentDisplayImage) { 
        currentDisplayImage = document.createElement('img')
        displayElem.appendChild(currentDisplayImage)
    }
 
    currentDisplayImage.setAttribute('src', image.urls.full)
    currentDisplayImage.setAttribute('alt', image.alt_description)
    updateScrollBar(image)
    document.getElementById('announcer').textContent = image.alt_description
}

next.addEventListener('click', function() { selectNextImage(1) })
prev.addEventListener('click', function() { selectNextImage(-1)})

thumbContainerHideButton.addEventListener('click', function() {
    thumbContainer.classList.toggle('hidden')
    if (thumbContainer.classList.contains('hidden')) {
        thumbContainerHideButton.classList.add('thumbContainerHideButton-thumbnailsHidden');
    } else {
        thumbContainerHideButton.classList.remove('thumbContainerHideButton-thumbnailsHidden');
    }
})



function selectNextImage(index) {
    currentImageIndex += index

    if (currentImageIndex >= images.length) currentImageIndex = 0
    if (currentImageIndex < 0) currentImageIndex = images.length - 1
    console.log(currentImageIndex)
    updateDisplayImage(images[currentImageIndex])
}

window.onload = init

// update our image depending on button press
// we have an array of indexes. We could say, something like 
// if there isn't a current Image yet (like onload) intitalize one (0). 
// if they press the next button, change the current image to index+1
// if they press the prev button, change the current image to index-1
// if the imageindex+1 would be greater then the length of the array, return 0 instead (so it goes back to the start of the images array)


// bunch of assessibility and additional events to listen for. 
// =========================================================
let touchstartX = 0;
let touchendX = 0;
// i got a bit distracted. This is also kinda bad (os normally has it's own behaviour for swiping.)
function handleGesture() {
    let threshold = 50
    if (touchendX < touchstartX - threshold) {
        console.log('swipedright');
        selectNextImage(1);
    }
    
    if (touchendX > touchstartX + threshold) {
        console.log('swiped left');
        selectNextImage(-1);
    }
}

displayElem.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
});

displayElem.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    handleGesture();
});

window.addEventListener('keydown', handleArrowKeyPress);

function handleArrowKeyPress(event) {
    if (event.key === 'ArrowRight') {
        selectNextImage(1);
    } else if (event.key === 'ArrowLeft') {
        selectNextImage(-1);
    }
}

