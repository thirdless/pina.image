const DIVIDE_GALLERY = 3;

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

let div_width = -1;
let all_divs = [];
let observer;

function img_loaded(image, divs){
    let min_h = divs[0][1], min_i = 0;

    for(let i = 0; i < divs.length; i++){
        let current = divs[i][1];

        if(current < min_h){
            min_h = current;
            min_i = i;
        }
    }

    divs[min_i][1] += div_width / image.naturalWidth * image.naturalHeight;
    divs[min_i][0].appendChild(image);

//     setInterval(() => {
//         image.className = "show";
//     }, 100);
    observer.observe(image);
}

function mozaicShow(e){
    console.log(e);
    //observer.unobserve();
}

function mozaic(gallery){
    let divs = [];
    let images = gallery.querySelectorAll("img");

    for(let i = 0; i < DIVIDE_GALLERY; i++){
        let el = document.createElement("div");
        el.className = "half";
        divs.push([el, 0]);
        gallery.appendChild(el);
    }

    all_divs.push(divs);

    if(div_width == -1)
        div_width = divs[0][0].offsetWidth;

    for(let i = 0; i < images.length; i++){
        gallery.removeChild(images[i]);
        
        if(images[i].complete && images[i].naturalWidth)
            img_loaded(images[i], divs);
        else
            images[i].addEventListener("load", e => img_loaded(e.target, divs));
        
        images[i].addEventListener("click", zoomImage);
    }
}

function photos(){
    let galleries = document.querySelectorAll(".gallery");
    observer = new IntersectionObserver(mozaicShow, {threshold: 0.5});
    
    for(let i = 0; i < galleries.length; i++){
        mozaic(galleries[i]);
    }
}

function home(){
    homeBackgrounds = document.querySelectorAll(".background div");
    homeBackgrounds.forEach(e => e.style.opacity = 0);
    homeBackgrounds[0].style.opacity = 1;
    setInterval(iterateBackgrounds, 5000);
}

let menuElement;

function toggleMenu(event){
    let target = event.currentTarget,
        className = "show";

    if(menuElement.classList.contains(className)){
        menuElement.classList.remove(className);
        target.classList.remove(className);
        document.body.style.overflow = "";
    }
    else{
        menuElement.classList.add(className);
        target.classList.add(className);
        document.body.style.overflow = "hidden";
    }
}

function dom(){
    let page = document.body.classList;

    if(page.contains("home"))
        home();
    else if(page.contains("photos") || page.contains("event-page") || page.contains("comercial-page"))
        photos();

    let sandwich = document.querySelector("body>.header>.sandwich");
    menuElement = document.querySelector("body>.header>.menu");
    sandwich.addEventListener("click", toggleMenu);
}

document.addEventListener("DOMContentLoaded", dom);
