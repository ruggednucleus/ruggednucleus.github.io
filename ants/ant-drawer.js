class AntDrawer {
    constructor(scale = 1) {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        //document.body.appendChild(this.canvas);

        this.scale = scale;
        this.width = 70;
        this.height = 45;
        
        this.canvas.width = this.width * this.scale;
        this.canvas.height = this.height * this.scale;
    }

    getImage() {
        return this.canvas;
    }

    draw(time) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let rad = time / 50

        this.ctx.save()
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.scale(this.scale, this.scale)
        this.ctx.fillStyle = "black";
        this.ctx.strokeStyle = "black";
        
        this.ctx.beginPath()
        this.ctx.ellipse(0, 0, 10, 4, 0, 0, Math.PI * 2);
        this.ctx.ellipse(-15, 0, 10, 7, 0, 0, Math.PI * 2);
        this.ctx.ellipse(10, 0, 8, 6, 0, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.moveTo(10, 0);
        this.ctx.lineTo(20, -10);
        this.ctx.lineTo(30, -10)
        this.ctx.moveTo(10, 0);
        this.ctx.lineTo(20, 10);
        this.ctx.lineTo(30, 10);
        this.ctx.stroke();

        this.ctx.save();
        this.ctx.rotate((Math.sin(rad) + 1) * 0.15 - 0.15);
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(5, -10);
        this.ctx.lineTo(15, -15);
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(5, 10);
        this.ctx.lineTo(15, 15);

        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(-5, -10);
        this.ctx.lineTo(-20, -15);
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(-5, 10);
        this.ctx.lineTo(-20, 15)
        this.ctx.restore();

        this.ctx.save();
        this.ctx.rotate( -((Math.sin(rad) + 1) * 0.1 - 0.1));
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(0, -10);
        this.ctx.lineTo(-5, -20);
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(0, 10);
        this.ctx.lineTo(-5, 20);
        this.ctx.restore();

        this.ctx.stroke();

        this.ctx.restore();
    }
}