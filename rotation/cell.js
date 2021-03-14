class Cell {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;

        this.fromX = x;
        this.fromY = y;

        this.rotationPointX = x;
        this.rotationPointY = y;

        this.animationStart = 0;
        this.startAngle = 135;

        this.color = color;

        this.radius = CELL_SIZE * 0.4;
    }

    moveTo(x, y, offsetX, offsetY, time) {
        this.animationStart = time;

        this.fromX = this.x;
        this.fromY = this.y;
        this.x = x;
        this.y = y;

        if(offsetX === 0 && offsetY === 0) {
            this.rotationPointX = this.x;
            this.rotationPointY = this.y;
            this.startAngle = 135;
        }

        if(offsetX === 0 && offsetY === 1) {
            this.rotationPointX = this.x;
            this.rotationPointY = this.y + 1;
            this.startAngle = 45;
        }

        if(offsetX === 1 && offsetY === 1) {
            this.rotationPointX = this.x + 1;
            this.rotationPointY = this.y + 1;
            this.startAngle = 315;
        }

        if(offsetX === 1 && offsetY === 0) {
            this.rotationPointX = this.x + 1;
            this.rotationPointY = this.y;
            this.startAngle = 225;
        }
    }

    draw() {
        CTX.fillStyle = this.color;

        let angle = this.startAngle - Math.min((performance.now() - this.animationStart) / delay, 1) * 90; 

        let x = this.rotationPointX * CELL_SIZE + (CELL_SIZE * 0.7) * Math.cos(angle * Math.PI / 180);
        let y = this.rotationPointY * CELL_SIZE + (CELL_SIZE * 0.7) * Math.sin(angle * Math.PI / 180);

        CTX.beginPath();
        CTX.arc(x, y, this.radius, 0, Math.PI * 2);
        //CTX.arc(x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2, this.radius, 0, Math.PI * 2);
        CTX.fill();
    }
}