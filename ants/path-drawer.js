class PathDrawer {
    constructor(width, height) {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = width;
        this.canvas.height = height;
        document.body.appendChild(this.canvas);
    }

    addPath(from, to) {
        this.ctx.strokeStyle = "#cfa772";
        this.ctx.beginPath();
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.stroke();
    }

    drawPaths() {
        ctx.drawImage(this.canvas, 0, 0);
    }
}