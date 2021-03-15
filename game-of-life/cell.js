class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.alive = true;
    }

    draw() {
        CTX.fillStyle = "white";
        CTX.fillRect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
}