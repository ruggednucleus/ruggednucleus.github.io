class Options {
    constructor() {
        this.angle = 20;
        this.minSpeed = 12;
        this.maxSpeed = 15;
        this._gravity = new Vector(0, 0.2);
    }

    get gravity() {
        return this._gravity.y;
    }

    set gravity(value) {
        this._gravity.y = value;
    }

    get gravityVector() {
        return this._gravity;
    }
}

const options = new Options();

const gui = new dat.GUI();
gui.close();
gui.add(options, "angle", 0, 90);
gui.add(options, "minSpeed", 0, 30, 1);
gui.add(options, "maxSpeed", 0, 30);
gui.add(options, "gravity", 0, 1);

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillStyle = "#111"
ctx.fillRect(0, 0, canvas.width, canvas.height)

const fireworks = [];

function loop() {
    if(Math.random() < 0.05) {
        fireworks.push(
            new Firework(Math.random() * canvas.width | 0,
            canvas.height,
            Math.random() * options.angle + (270 - options.angle / 2),
            Math.random() * (options.maxSpeed - options.minSpeed) + options.minSpeed,
        ));
    }

    ctx.save();
    ctx.fillStyle = "#000"
    ctx.globalAlpha = 0.2;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    for(firework of fireworks) {
        firework.update(options.gravityVector);
        firework.show(ctx, 2);
    }

    requestAnimationFrame(loop);
}
loop();
