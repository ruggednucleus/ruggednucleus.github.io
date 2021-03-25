const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let url = new URL(window.location);
const scale = parseInt(url.searchParams.get("scale")) || 0.4;

let target = new Vector(0, 0);

const ants = [];
for(let i = 0; i < 100; i++) {
    ants.push(new Ant(new Vector(canvas.width * Math.random() | 0, canvas.height * Math.random() | 0)))
}

let lastupdate;

function loop(time) {
    if(!lastupdate) {
        lastupdate = performance.now();
    }
    let deltaTime = (performance.now() - lastupdate) / 1000;

    ctx.fillStyle = "#dbbd97";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ants.forEach(ant => {
        ant.update(target, deltaTime);
        ant.draw(time, scale);
    });


    lastupdate = performance.now();
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

canvas.addEventListener("mousemove", e => {
    target = new Vector(e.x, e.y);
})