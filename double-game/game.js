class Game {
    width = 5;
    height = 7;
    board = [];

    min_block = 2;
    max_block_multi = 4;

    current_block = 2;

    blocks_moved = [];

    constructor() {
        this.create_new_board();
    }

    create_new_board() {
        this.board = [];
        for(let x = 0; x < this.width; x++) {
            this.board[x] = [];
            for(let y = 0; y < this.height; y++) {
                this.board[x][y] = 0;
            }
        }
    }

    place_block(coloum) {
        if(this.board[coloum][this.height - 1] !== 0) {
            console.log("Coloum full... Try somewhere else.");
            return;
        }

        for(let y = 0; y < this.height; y++) {
            if(this.board[coloum][y] === 0) {
                this.board[coloum][y] = this.current_block;
                this.blocks_moved = [{x: coloum, y, value: this.current_block}];
                break;
            }
        }

        this.match_blocks();

        this.current_block = Math.pow(this.min_block, (Math.random() * this.max_block_multi) + 1 | 0);
    }

    match_blocks() {

        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                let value = this.board[x][y];
                if(value === 0) {
                    continue;
                }
                let found_match = false;

                if(y - 1 >= 0 && this.board[x][y - 1] === value) {
                    this.board[x][y - 1] *= 2;
                    found_match = true;
                }

                if(x - 1 >= 0 && this.board[x - 1][y] === value) {
                    this.board[x - 1][y] *= 2;
                    found_match = true;
                }

                if(x + 1 < this.width && this.board[x + 1][y] === value) {
                    this.board[x + 1][y] *= 2;
                    found_match = true;
                }

                if(found_match) {
                    this.board[x].splice(y, 1);
                    this.board[x].push(0);
                }
            }
        }

        return;

        this.blocks_moved.forEach(block => {
            let found_match = false;

            if(block.y - 1 >= 0 && this.board[x][y - 1] === block.value) {
                this.board[x][y - 1] *= 2;
                found_match = true;
            }

            if(block.y - 1 >= 0 && this.board[x][y - 1] === block.value) {
                this.board[x][y - 1] *= 2;
                found_match = true;
            }
        });
    }

    render(ctx, block_size) {
        ctx.fillStyle = "#2f2f2f";
        ctx.fillRect(0, 0, this.width * block_size, this.height * block_size);

        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                if(this.board[x][y]) {
                    ctx.save();
                    ctx.translate(x * block_size + block_size * 0.5, y * block_size + block_size * 0.5);
                    ctx.fillStyle = ColourGenerator.generate(this.board[x][y]);
                    ctx.beginPath();
                    ctx.roundRect((-block_size * 0.45) | 0, (-block_size * 0.45) | 0, (block_size * 0.9) | 0, (block_size * 0.9) | 0, block_size * 0.1)
                    ctx.fill();

                    ctx.fillStyle = "#FFF";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle"
                    ctx.font = `${block_size * 0.5}px monospace`
                    ctx.fillText(this.board[x][y], 0, 0, block_size * 0.9)
                    ctx.restore();
                }
            }
        }
    }
}