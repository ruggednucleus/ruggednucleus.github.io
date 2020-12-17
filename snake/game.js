class Game {
    snakes = [];
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        let snake_position = new Vector(canvas.width / 2, canvas.height / 2);
        let head_radius = Math.min(canvas.width * 0.02 | 0, canvas.height * 0.02 | 0)
        this.snakes.push(new Snake(snake_position, head_radius, head_radius * 0.3));
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