const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

let rockets = 25;
let url = new URL(window.location);
if(url.searchParams.get("rockets")) {
    rockets = parseInt(url.searchParams.get("rockets"));
}

const population = new Population(rockets, canvasWidth / 2, canvasHeight, 200);

function loop() {
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    population.update();
    population.show(ctx);

    requestAnimationFrame(loop);
}

loop();