const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.font = "bold 20px monospace";

const symbols = [];

for(let i = 33; i < 91; i++) {
    symbols.push(String.fromCharCode(i));
}
for(let i = 0xFF66; i < 0xFF9E; i++) {
    symbols.push(String.fromCharCode(i));
}
symbols.splice(68, 1);

const streams = [];
for(let x = 0; x < canvas.width / 20; x++) {
    streams.push(new Stream(symbols, x, -(canvas.height / 20) * Math.random() | 0, canvas.height / 20 | 0));
}

const stream = new Stream(symbols, 0, -1, canvas.height / 20);
let last_fall = 0;
let fall_delay = 80;

ctx.textBaseline = "top"

let lastupdate;

function loop() {
    if(!lastupdate) {
        lastupdate = performance.now();
    }
    let deltaTime = (performance.now() - lastupdate) / 16;
//    console.log(deltaTime)

    let fall = false;
    if(performance.now() - last_fall > fall_delay) {
        last_fall = performance.now();
        fall = true;
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    streams.forEach(stream => {
        stream.update(fall, deltaTime);
        stream.render(ctx, 20);
    });

    lastupdate = performance.now();
    requestAnimationFrame(loop);
}

loop();

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
//window.addEventListener("resize", resize);