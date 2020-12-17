const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let size = 20;
let speed = 4;
let length = 20;

let url = new URL(window.location);
if(url.searchParams.get("size")) {
    size = parseInt(url.searchParams.get("size"));
}
if(url.searchParams.get("speed")) {
    speed = parseInt(url.searchParams.get("speed"));
}
if(url.searchParams.get("length")) {
    length = parseInt(url.searchParams.get("length"));
}

function preloadImages(urls) {
    let loaded = 0;
    let images = {}
    urls.forEach(url => {
        let img = new Image;
        img.src = url;
        img.onload = function() {
            loaded++;
            if(!(loaded < urls.length)) {
                console.log("Loaded all images");
                loop();
            }
        }
        images[url] = img;
    });

    return images;
}

let images = preloadImages(["snake.png", "tileSand1.png","tileSand2.png"]);

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

const game = new Game(canvas, size, speed, length);
function loop() {
    game.update();
    requestAnimationFrame(loop);
}

canvas.addEventListener("mousemove", e => {
    game.setMousePosition(new Vector(e.offsetX, e.offsetY))
});

canvas.addEventListener("touchstart", e => {
    e.preventDefault();
    game.setMousePosition(new Vector(e.touches[0].pageX, e.touches[0].pageY));
});

canvas.addEventListener("touchmove", e => {
    e.preventDefault();
    game.setMousePosition(new Vector(e.touches[0].pageX, e.touches[0].pageY));
});

canvas.addEventListener("touchend", e => {
    e.preventDefault();
    game.mouse = game.snakes[0].head_position.copy();
});

window.addEventListener("resize", resize);