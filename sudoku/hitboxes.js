class Hitbox {
    constructor(x, y, width, height, onclick = () => {}, onhover = () => {}) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.onclick = onclick;
        this.onhover = onhover;
    }

    click(x, y) {
        if(x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height) {
            this.onclick({
                x: x - this.x,
                y: y - this.y,
            });
        }
    }

    hover(x, y) {
        if(x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height) {
            this.onhover({
                x: x - this.x,
                y: y - this.y,
            });
        }
    }
}