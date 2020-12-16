const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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

const game = new Game(canvas);
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