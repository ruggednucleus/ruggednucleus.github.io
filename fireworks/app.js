class Options {
    constructor() {
        this.angle = 20;
        this.minSpeed = 12;
        this.maxSpeed = 18;
        this._gravity = new Vector(0, 0.2);
        this.chance = 5;
        this.explosionSize = 100;
        this.explosionMinVelocity = 0;
        this.explosionMaxVelocity = 10;
        this.explosionSpeedMultiplier = 0.95;
        this.explosionStartAngle = 0;
        this.explosionEndAngle = 360;
        this.decay = 4;
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
gui.add(options, "chance", 0, 100);
gui.add(options, "explosionSize", 0, 500);
gui.add(options, "explosionMinVelocity", 0, 30, 1);
gui.add(options, "explosionMaxVelocity", 0, 30, 1);
gui.add(options, "explosionSpeedMultiplier", 0.5, 1);
gui.add(options, "explosionStartAngle", 0, 360);
gui.add(options, "explosionEndAngle", 0, 360);
gui.add(options, "decay", 1, 10);

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillStyle = "#111"
ctx.fillRect(0, 0, canvas.width, canvas.height)

const fireworks = [];

function loop() {
    if(Math.random() < options.chance / 100) {
        fireworks.push(
            new Firework(
                canvas.width / 2,
                //Math.random() * canvas.width | 0,
                canvas.height,
                Math.random() * options.angle + (270 - options.angle / 2),
                Math.random() * (options.maxSpeed - options.minSpeed) + options.minSpeed,
                true,
            )
        );
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