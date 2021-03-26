const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800 || window.innerWidth;
canvas.height = 400 || window.innerHeight;

let url = new URL(window.location);
const scale = parseFloat(url.searchParams.get("scale")) || 0.4;
const number_of_ants = parseInt(url.searchParams.get("ants")) || 100;

let target = new Vector(0, 0);

const ants = [];
for(let i = 0; i < number_of_ants; i++) {
    ants.push(new Ant(new Vector(canvas.width * Math.random() | 0, canvas.height * Math.random() | 0), scale))
}

const ant_drawer = new AntDrawer(scale);
const path_drawer = new PathDrawer(canvas.width, canvas.height);

let lastupdate;

function loop(time) {
    if(!lastupdate) {
        lastupdate = performance.now();
    }
    let deltaTime = (performance.now() - lastupdate) / 1000;

    ctx.fillStyle = "#dbbd97";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    path_drawer.drawPaths();

    ant_drawer.draw(time);

    ants.forEach(ant => {
        ant.update(deltaTime);
        ant.draw(ant_drawer.getImage(), path_drawer);
    });


    lastupdate = performance.now();
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

canvas.addEventListener("mousemove", e => {
    target = new Vector(e.x, e.y);
})