let homeBackgrounds,
    currentBackground = 0;

function iterateBackgrounds(){
    currentBackground++;

    if(currentBackground >= homeBackgrounds.length){

        for(let i = 0; i < homeBackgrounds.length; i++){
            if(i != homeBackgrounds.length - 1)
                homeBackgrounds[i].style.transition = "";
            homeBackgrounds[i].style.opacity = 0;
        }

        currentBackground = 0;
    }

    homeBackgrounds[currentBackground].style.transition = "opacity .7s ease";
    homeBackgrounds[currentBackground].style.opacity = 1;
}

let zoomed = false;

function zoomImage(event){
    if(zoomed)
        return;
    
    let OFFSET = 20,
        element = event.currentTarget,
        overlay = document.createElement("div"),
        bound = element.getBoundingClientRect(),
        windowWidth = window.innerWidth - (OFFSET * 2),
        windowHeight = window.innerHeight - (OFFSET * 2),
        scale = 1;
    
    zoomed = element;

    overlay.className = "zoom-overlay";
    overlay.addEventListener("click", zoomClose);
    element.removeEventListener("click", zoomImage);
    element.addEventListener("click", zoomClose);
    window.addEventListener("scroll", zoomClose);
    element.parentNode.appendChild(overlay);
    element.style.zIndex = 3;
    element.style.pointerEvents = "none";

    setTimeout(e => overlay.classList.add("show"), 50);

    scale = windowWidth / bound.width;

    if(scale * bound.height > windowHeight)
        scale = windowHeight / bound.height;

    let translateX = -(bound.left + (bound.width / 2) - ((bound.width * scale) / 2)) + (windowWidth - (bound.width * scale)) / 2 + OFFSET,
        translateY = -(bound.top + (bound.height / 2) - ((bound.height * scale) / 2)) + (windowHeight - (bound.height * scale)) / 2 + OFFSET;

    element.style.transform = "translate3d(" + translateX + "px, " + translateY + "px, 0) scale3d(" + scale + ", " + scale + ", 1)";
}

function zoomClose(){
    if(!zoomed || !zoomed.style.transform)
        return;
    
    let overlay = document.querySelector(".zoom-overlay");

    zoomed.style.transform = "";
    overlay.classList.remove("show");
    
    window.removeEventListener("scroll", zoomClose);
    zoomed.removeEventListener("click", zoomClose);
    zoomed.addEventListener("click", zoomImage);

    setTimeout(e => {
        overlay.parentNode.removeChild(overlay);
        zoomed.style.zIndex = "";
        zoomed.style.pointerEvents = "";
        zoomed = false;
    }, 500);
}

function photos(){
    document.querySelectorAll(".content img").forEach(e => {
        e.addEventListener("click", zoomImage);
    });
}

function home(){
    homeBackgrounds = document.querySelectorAll(".background div");
    homeBackgrounds.forEach(e => e.style.opacity = 0);
    homeBackgrounds[0].style.opacity = 1;
    setInterval(iterateBackgrounds, 5000);
}

let menuElement;

function toggleMenu(){
    let className = "show";
    
    if(menuElement.classList.contains(className))
        menuElement.classList.remove(className);
    else
        menuElement.classList.add(className);
}

function dom(){
    let page = document.body.classList;

    if(page.contains("home"))
        home();
    else if(page.contains("photos") || page.contains("event-page"))
        photos();

    let sandwich = document.querySelector("body>.header>.sandwich");
    menuElement = document.querySelector("body>.header>.menu");
    sandwich.addEventListener("click", toggleMenu);
}

document.addEventListener("DOMContentLoaded", dom);