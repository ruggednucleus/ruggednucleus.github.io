class Game {
    snakes = [];
    constructor(canvas, size = 20, speed = 4, length = 20) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        let snake_position = new Vector(canvas.width / 2, canvas.height / 2);
        this.snakes.push(new Snake(snake_position, size, speed, length));
        this.mouse = snake_position.copy();
    }

    update() {
        this.snakes.forEach(snake => {
            snake.moveTo(this.mouse);
            snake.update();
        });

        for(let x = 0; x < this.canvas.width; x += images["tileSand1.png"].width) {
            for(let y = 0; y < this.canvas.height; y += images["tileSand1.png"].height) {
                ctx.drawImage(images[`tileSand1.png`], x, y);
            }
        }

        this.snakes.forEach(snake => {
            snake.render(this.ctx);
        });
    }

    setMousePosition(position) {
        this.mouse = position;
    }
}