class Game {
    board = [];
    empty_space = {x: 0, y: 0};

    state;
    states = {
        waiting: 0,
        animating: 1,
    }

    animating_tile = {
        start: null,
        number: null,
        x: null,
        y: null,
        from: {x: null,y: null},
    }
    animation_time = 100;

    tile_color = "#ff5733"
    background_color = "#900c3e"
    hole_color = "#571845"
    render_scale = 0.8;

    constructor(size) {
        this.size = size;
        this.createBoard();

        this.state = this.states.waiting;
    }

    slide(x, y) {
        if(this.state !== this.states.waiting) {
            return;
        }

        if(Math.abs(x) === Math.abs(y) || this.empty_space.x + x < 0 || this.empty_space.x + x >= this.size || this.empty_space.y + y < 0 || this.empty_space.y + y >= this.size) {
            return;
        }

        this.animating_tile.number = this.board[this.empty_space.y + y][this.empty_space.x + x];
        this.animating_tile.start = performance.now();
        this.animating_tile.from.x = x;
        this.animating_tile.from.y = y;
        this.animating_tile.x = this.empty_space.x;
        this.animating_tile.y = this.empty_space.y;

        this.board[this.empty_space.y + y][this.empty_space.x + x] = undefined;

        this.state = this.states.animating;
    }

    finishAnimation() {
        this.state = this.states.waiting;
        this.board[this.animating_tile.y][this.animating_tile.x] = this.animating_tile.number;
        this.empty_space.x = this.animating_tile.x + this.animating_tile.from.x;
        this.empty_space.y = this.animating_tile.y + this.animating_tile.from.y;
    }

    slideUp() {this.slide(0, -1)}
    slideDown() {this.slide(0, 1)}
    slideLeft() {this.slide(-1, 0)}
    slideRight() {this.slide(1, 0)}

    createBoard() {
        const numbers = [];
        for(let i = 0; i < this.size * this.size; i++) {
            numbers.push(i + 1);
        }

        this.shuffleArray(numbers);

        const sorted_array = [];
        for(let i = 0; i < this.size * this.size; i++) {
            sorted_array[i] = numbers[i];
        }

        let dist = 0;
        for(let i = 0; i < sorted_array.length; i++) {
            if(sorted_array[i] === this.size * this.size) {
                dist += (this.size - 1 - i % this.size);
                dist += (this.size - 1 - (i / this.size | 0));
                break;
            }
        }

        let swaps = 0;
        for(let i = 0; i < sorted_array.length; i++) {
            if(sorted_array[i] !== i + 1) {
                for(let j = i + 1; j < sorted_array.length; j++) {
                    if(sorted_array[j] === i + 1) {
                        const temp = sorted_array[i];
                        sorted_array[i] = sorted_array[j];
                        sorted_array[j] = temp;
                        swaps++;
                        break;
                    }
                }
            }
        }

        console.log(`Distance: ${dist}`, `Swaps: ${swaps}`)

        if(swaps % 2 !== dist % 2) {
            console.log("Swaped")
            for(let i = 0; i < numbers.length; i++) {
                if(numbers[i] === this.size * this.size - 1) {
                    numbers[i] = this.size * this.size - 2;
                    console.log(i, numbers[i])
                } else if(numbers[i] === this.size * this.size - 2){
                    numbers[i] = this.size * this.size - 1
                }
            }
        }

        this.board = [];
        for(let y = 0; y < this.size; y++) {
            this.board[y] = [];
            for(let x = 0; x < this.size; x++) {
                this.board[y][x] = numbers[y * this.size + x];
                if(this.board[y][x] === this.size * this.size) {
                    this.board[y][x] = undefined;
                    this.empty_space.x = x;
                    this.empty_space.y = y;
                }
            }
        }
    }

    shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    render(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const cell_size = Math.min(ctx.canvas.width, ctx.canvas.height) / this.size * this.render_scale;
        const offset_x = ctx.canvas.width * 0.5 - this.size * cell_size * 0.5;
        const offset_y = 0//ctx.canvas.height * 0.5 - this.size * cell_size * 0.5;

        const tile_size = cell_size * 0.9;
        const tile_offset = (cell_size * 0.5 - tile_size * 0.5);

        ctx.fillStyle = this.background_color;
        this.drawBox(ctx, offset_x, offset_y, cell_size * this.size, cell_size * 0.1, true, false);

        for(let y = 0; y < this.board.length; y++) {
            for(let x = 0; x < this.board[y].length; x++) {
                ctx.fillStyle = this.hole_color;
                this.drawBox(
                    ctx,
                    offset_x + cell_size * x + tile_offset,
                    offset_y + cell_size * y + tile_offset,
                    tile_size, 
                    tile_size * 0.1,
                    true, false);
            }
        }

        for(let y = 0; y < this.board.length; y++) {
            for(let x = 0; x < this.board[y].length; x++) {
                if(this.board[y][x] !== undefined) {
                    ctx.fillStyle = this.tile_color;
                    this.drawBox(
                        ctx,
                        offset_x + cell_size * x + tile_offset,
                        offset_y + cell_size * y + tile_offset,
                        tile_size, 
                        tile_size * 0.1,
                        true, false);

                    ctx.fillStyle = "#ffffff";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.font = tile_size * 0.5 + "px cursive"
                    ctx.fillText(this.board[y][x], offset_x + cell_size * x + tile_offset + tile_size * 0.5, offset_y + cell_size * y + tile_offset + tile_size * 0.5);
                }
            }
        }

        if(this.state === this.states.animating) {
            let time = performance.now() - this.animating_tile.start;
            if(time > this.animation_time) {
                time = this.animation_time;
                this.finishAnimation();
            }
            time = 1 - time / this.animation_time;

            ctx.fillStyle = this.tile_color;
            this.drawBox(
                ctx,
                offset_x + cell_size * (this.animating_tile.x + this.animating_tile.from.x * time) + tile_offset,
                offset_y + cell_size * (this.animating_tile.y + this.animating_tile.from.y * time) + tile_offset,
                tile_size, 
                tile_size * 0.1,
                true, false);
            
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = tile_size * 0.5 + "px cursive"
            ctx.fillText(this.animating_tile.number,
                offset_x + cell_size * (this.animating_tile.x + this.animating_tile.from.x * time) + tile_offset + tile_size * 0.5,
                offset_y + cell_size * (this.animating_tile.y + this.animating_tile.from.y * time) + tile_offset + tile_size * 0.5);
        }
    }

    drawBox(ctx, x, y, size, radius, fill, stroke) {
        // https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + size - radius, y);
        ctx.quadraticCurveTo(x + size, y, x + size, y + radius);
        ctx.lineTo(x + size, y + size - radius);
        ctx.quadraticCurveTo(x + size, y + size, x + size - radius, y + size);
        ctx.lineTo(x + radius, y + size);
        ctx.quadraticCurveTo(x, y + size, x, y + size - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        if(fill) {
            ctx.fill();
        }
        if(stroke) {
            ctx.stroke();
        }
    }
}