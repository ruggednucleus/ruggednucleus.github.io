class Board {
    board = [];
    offset = 0;
    colors = ["#f28f0d", "#f20d46", "#0d65f2"];
    alpha = 0.1;

    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.clearBoard();
    }

    addCell(x, y) {
        if(x < this.width && x >= 0 && y < this.height && y >= 0 && !this.board[y][x]) {
            let cell = new Cell(x, y, this.colors[this.colors.length * Math.random() | 0]);
            this.board[y][x] = cell;
        }
    }

    removeCell(x, y) {
        if(x < this.width && x >= 0 && y < this.height && y >= 0 && this.board[y][x]) {
            this.board[y][x] = undefined;
        }
    }

    isEmpty(x, y) {
        return this.board[y][x] === undefined;
    }

    clearBoard() {
        this.board = new Array(this.height);
        for(let i = 0; i < this.height; i++) {
            this.board[i] = new Array(this.width);
        }
    }

    update() {
        let time = performance.now();
        let new_board = new Array(this.height);
        for(let i = 0; i < this.height; i++) {
            new_board[i] = new Array(this.width);
        }

        for(let y = this.offset; y < this.height; y += 2) {
            for(let x = this.offset; x < this.width; x += 2) {
                let cells = 0;

                for(let offsetY = 0; offsetY < 2; offsetY++) {
                    for(let offsetX = 0; offsetX < 2; offsetX++) {
                        if(this.board[(y + offsetY) % this.height][(x + offsetX) % this.width]) {
                            cells++;
                        }
                    }
                }

                for(let offsetY = 0; offsetY < 2; offsetY++) {
                    for(let offsetX = 0; offsetX < 2; offsetX++) {
                        if(this.board[(y + offsetY) % this.height][(x + offsetX) % this.width]) {
                            if(cells > 1) {
                                new_board[(y + offsetY) % this.height][(x + offsetX) % this.width] = this.board[(y + offsetY) % this.height][(x + offsetX) % this.width];
                            } else if(cells === 1) {
                                let cell = this.board[(y + offsetY) % this.height][(x + offsetX) % this.width]
                                if(offsetX === 0 && offsetY === 0) {
                                    //cell.x = (cell.x + 1) % this.width;
                                    cell.moveTo((cell.x + 1) % this.width, cell.y, offsetX, offsetY, time);
                                }
            
                                if(offsetX === 1 && offsetY === 0) {
                                    //cell.y = (cell.y + 1) % this.height;
                                    cell.moveTo(cell.x, (cell.y + 1) % this.height, offsetX, offsetY, time);
                                }
            
                                if(offsetX === 1 && offsetY === 1) {
                                    //cell.x = (cell.x - 1 + this.width) % this.width;
                                    cell.moveTo((cell.x - 1 + this.width) % this.width, cell.y, offsetX, offsetY, time);
                                }
            
                                if(offsetX === 0 && offsetY === 1) {
                                    //cell.y = (cell.y - 1 + this.height) % this.height;
                                    cell.moveTo(cell.x, (cell.y - 1 + this.height) % this.height, offsetX, offsetY, time);
                                }

                                new_board[cell.y][cell.x] = cell;
                            }
                        }
                    }
                }
            }
        }

        this.board = new_board;
        this.offset++;
        if(this.offset > 1) {
            this.offset = 0;
        }
    }

    draw(useAlpha = true) {
        CTX.save();
        if(useAlpha) {
            CTX.globalAlpha = this.alpha;
        }
        CTX.fillStyle = "black";
        CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
        CTX.restore();

        if(!PLAYING) {
            CTX.save();
            CTX.fillStyle = "#333";
            CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
            CTX.strokeStyle = "#888";
            CTX.translate(-0.5, -0.5);

            CTX.beginPath();
            for(let x = 0; x < this.width; x++) {
                CTX.moveTo(x * CELL_SIZE, 0);
                CTX.lineTo(x * CELL_SIZE, CANVAS.height);
            }

            for(let y = 0; y < this.height; y++) {
                CTX.moveTo(0, y * CELL_SIZE);
                CTX.lineTo(CANVAS.width, y * CELL_SIZE);
            }
            CTX.stroke();

            CTX.strokeStyle = "#CCC";
            CTX.translate(0.5, 0.5);
            CTX.lineWidth = 2;

            CTX.beginPath();
            for(let x = this.offset; x < this.width; x += 2) {
                if(x !== 0) {
                    CTX.moveTo(x * CELL_SIZE, 0);
                    CTX.lineTo(x * CELL_SIZE, CANVAS.height);
                }
            }

            for(let y = this.offset; y < this.height; y += 2) {
                if(y !== 0) {
                    CTX.moveTo(0, y * CELL_SIZE);
                    CTX.lineTo(CANVAS.width, y * CELL_SIZE);
                }
            }
            CTX.stroke();

            CTX.restore();
        }

        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                if(this.board[y][x]) {
                    this.board[y][x].draw();
                }
            }
        }
    }
}