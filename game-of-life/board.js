class Board {
    board = [];
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.clearBoard();
    }

    clearBoard() {
        this.board = new Array(this.width * this.height);
    }

    fillRandom(chance) {
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                if(Math.random() < chance) {
                    this.board[y * this.width + x] = new Cell(x, y);
                }
            }
        }
    }

    getNumberOfAliveNeighbors(x, y) {
        let neighbors = 0;
        for(let offsetX = -1; offsetX < 2; offsetX++) {
            for(let offsetY = -1; offsetY < 2; offsetY++) {
                let posX = (x + this.width + offsetX) % this.width;
                let posY = (y + this.height + offsetY) % this.height;
                if(!(posX === x && posY === y) && this.board[posY * this.width + posX]) {
                    neighbors++;
                }
            }
        }
        return neighbors
    }

    addCell(x, y) {
        this.board[y * this.width + x] = new Cell(x, y);
    }

    removeCell(x, y) {
        this.board[y * this.width + x] = undefined;
    }

    isEmpty(x, y) {
        return this.board[y * this.width + x] === undefined;
    }

    update() {
        let new_board = new Array(this.width * this.height);
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                let neighbors = this.getNumberOfAliveNeighbors(x, y);
                if(this.board[y * this.width + x]) {
                    if(neighbors === 2 || neighbors === 3) {
                        new_board[y * this.width + x] = this.board[y * this.width + x];
                    }
                } else if(neighbors === 3) {
                    new_board[y * this.width + x] = new Cell(x, y);
                }
            }
        }
        this.board = new_board;
    }


    draw() {
        CTX.fillStyle = "black";
        CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);

        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                if(this.board[y * this.width + x]) {
                    this.board[y * this.width + x].draw();
                }
            }
        }
    }
}