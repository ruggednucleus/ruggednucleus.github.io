let canvas, ctx, width, height, t, step;

function init() {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    
    canvas.width = width;
    canvas.height = height;

    t = new TimesTable(200);
    step = 0;

    function loop() {
        t.render(ctx, Math.min(width, height) / 2 * 0.9, step);
        step += 0.01;
        document.title = Math.floor(step * 10) / 10;
        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);

    window.addEventListener("resize", resize);
}

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}


class TimesTable {
    constructor(points) {
        this.points = points;
    }

    render(ctx, radius, step) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.save();
        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);

        ctx.strokeStyle = "white";

        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);

        for(let i = 0; i < this.points; i++) {
            let angle = Math.PI * 2 / this.points;

            let x1 = radius * Math.cos(angle * i + Math.PI);
            let y1 = radius * Math.sin(angle * i + Math.PI);

            let next = i * step % this.points;

            let x2 = radius * Math.cos(angle * next + Math.PI);
            let y2 = radius * Math.sin(angle * next + Math.PI);

            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
        }
        ctx.stroke();

        ctx.restore();
    }
}