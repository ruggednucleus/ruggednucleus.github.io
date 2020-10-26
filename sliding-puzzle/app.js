const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

resize();

const game = new Game(4);
game.render(ctx);

function renderLoop() {
    game.render(ctx);
    requestAnimationFrame(renderLoop);
}
renderLoop();

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.7;
}

document.addEventListener("keydown", e => {
    switch(e.key) {
        case "ArrowUp":
            game.slideDown();
            break;

        case "ArrowDown":
            game.slideUp();
            break;

        case "ArrowLeft":
            game.slideRight();
            break;

        case "ArrowRight":
            game.slideLeft();
            break;
    }
});

let last_touch = undefined;
const min_movement = 20;

document.addEventListener("touchstart", e => {
    e.preventDefault();
    last_touch = e.changedTouches[0];
});

document.addEventListener("touchend", e => {
    if(last_touch) {
        const touch = e.changedTouches[0];
        const dist_x = touch.clientX - last_touch.clientX;
        const dist_y = touch.clientY - last_touch.clientY;
        console.log(dist_x, dist_y);
        if(Math.abs(dist_x) < min_movement && Math.abs(dist_y) < min_movement) {
            return;
        }

        if(Math.abs(dist_x) > Math.abs(dist_y)) {
            if(dist_x > 0) {
                game.slideLeft();
            } else {
                game.slideRight();
            }
        } else {
            if(dist_y > 0) {
                game.slideUp();
            } else {
                game.slideDown();
            }
        }

        last_touch = undefined;
    }
    console.log(e);
});


window.addEventListener("resize", resize);