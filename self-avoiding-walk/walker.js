class Walker {
    width;
    height;
    board = [];
    constructor(board_width, board_height) {
        this.width = board_width;
        this.height = board_height;

        this.createboard();

        this.done = false;
    }

    index(x, y) {
        return y * this.width + x;
    }

    createboard() {
        this.board = [];

        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                this.board[this.index(x, y)] = new Cell(x, y, this, this.width, this.height);
            }
        }

        this.path = [this.board[0]];
        this.board[0].part_of_path = true;
    }

    walk() {
        if(this.done) {
            return;
        }
        
        let next = this.path[this.path.length - 1].getRandomNeighbor();

        if(next) {
            this.path.push(next);
            next.part_of_path = true;

            if(this.path.length === this.width * this.height) {
                this.done = true;
            } else if(!this.findOneNeighborCells() || this.path.length + this.floodFill().length !== this.width * this.height) {
                this.removeLastPathElement();
            }
        } else {
            this.removeLastPathElement();
        }
    }

    removeLastPathElement() {
        let end = this.path.pop();
        end.part_of_path = false;
        end.neighbors = undefined;
    }

    findOneNeighborCells() {
        let cells = [];

        for(let i = 0; i < this.width * this.height; i++) {
            if(!this.board[i].part_of_path && this.board[i].getAllNeighbors().length === 1) {
                cells.push(this.board[i]);
                if(cells.length > 2) {
                    return false;
                }
            }
        }

        return true;
    }

    floodFill() {
        const frontier = [];
        const reached = [];

        for(let i = 0; i < this.width * this.height; i++) {
            if(!this.board[i].part_of_path) {
                frontier.push(this.board[i]);
                reached.push(this.board[i]);
                break;
            }
        }

        while(frontier.length) {
            const current = frontier.pop();
            const neighbors = current.getAllNeighbors();
            for(let neighbor of neighbors) {
                if(!reached.includes(neighbor)) {
                    frontier.push(neighbor);
                    reached.push(neighbor);
                }
            }
        }

        return reached;
    }

    render(ctx, size) {
        ctx.canvas.width = this.width * size;
        ctx.canvas.height = this.height * size;

        ctx.fillStyle = "#333";
        ctx.fillRect(0, 0, this.width * size, this.height * size);

        ctx.strokeStyle = "#555";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for(let x = 1; x < this.width; x++) {
            ctx.moveTo(x * size, 0);
            ctx.lineTo(x * size, this.height * size);
        }

        for(let y = 1; y < this.height; y++) {
            ctx.moveTo(0, y * size);
            ctx.lineTo(this.width * size, y * size);
        }
        ctx.stroke();

        ctx.strokeStyle = "#FFF";
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = size * 0.25;
        ctx.beginPath();
        ctx.moveTo(this.path[0].x * size + size / 2, this.path[0].y * size + size / 2);
        for(let i = 1; i < this.path.length; i++) {
            ctx.lineTo(this.path[i].x * size + size / 2, this.path[i].y * size + size / 2);
        }
        ctx.stroke();
    }
}

class Cell {
    part_of_path = false;
    neighbors;
    constructor(x, y, walker, board_width, board_height) {
        this.x = x;
        this.y = y;

        this.walker = walker,
        this.board_width = board_width;
        this.board_height = board_height;
    }

    fillNeighbors() {
        this.neighbors = [];

        if(this.x - 1 >= 0 && !this.walker.board[this.walker.index(this.x - 1, this.y)].part_of_path) {
            this.neighbors.push(this.walker.board[this.walker.index(this.x - 1, this.y)]);
        }

        if(this.x + 1 < this.board_width && !this.walker.board[this.walker.index(this.x + 1, this.y)].part_of_path) {
            this.neighbors.push(this.walker.board[this.walker.index(this.x + 1, this.y)]);
        }

        if(this.y - 1 >= 0 && !this.walker.board[this.walker.index(this.x, this.y - 1)].part_of_path) {
            this.neighbors.push(this.walker.board[this.walker.index(this.x, this.y - 1)]);
        }

        if(this.y + 1 < this.board_height && !this.walker.board[this.walker.index(this.x, this.y + 1)].part_of_path) {
            this.neighbors.push(this.walker.board[this.walker.index(this.x, this.y + 1)]);
        }
    }

    getRandomNeighbor() {
        if(this.neighbors === undefined) {
            this.neighbors = [];
            this.fillNeighbors();
        }

        return this.neighbors.splice(Math.random() * this.neighbors.length | 0, 1)[0];
    }

    getAllNeighbors() {
        const neighbors = [];

        if(this.x - 1 >= 0 && !this.walker.board[this.walker.index(this.x - 1, this.y)].part_of_path) {
            neighbors.push(this.walker.board[this.walker.index(this.x - 1, this.y)]);
        }

        if(this.x + 1 < this.board_width && !this.walker.board[this.walker.index(this.x + 1, this.y)].part_of_path) {
            neighbors.push(this.walker.board[this.walker.index(this.x + 1, this.y)]);
        }

        if(this.y - 1 >= 0 && !this.walker.board[this.walker.index(this.x, this.y - 1)].part_of_path) {
            neighbors.push(this.walker.board[this.walker.index(this.x, this.y - 1)]);
        }

        if(this.y + 1 < this.board_height && !this.walker.board[this.walker.index(this.x, this.y + 1)].part_of_path) {
            neighbors.push(this.walker.board[this.walker.index(this.x, this.y + 1)]);
        }

        return neighbors;
    }
}