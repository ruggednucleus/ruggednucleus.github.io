class Sudoku {

    size;
    block_width;
    block_height;
    board;

    constructor(block_width, block_height) {
        this.size = block_width * block_height;
        this.block_width = block_width;
        this.block_height = block_height;

        this.blocks_in_row = 3;
        this.blocks_in_column = 3;

        this.board = new Array(this.size * this.size);
        for(let i = 0; i < this.board.length; i++) {
            this.board[i] = new SudokuCell(i);
        }
    }

    setNumber(x, y, number) {
        const cell = this.getCell(x, y);
        if(cell.locked) {
            return;
        }

        cell.value = number;
    }

    removeNumber(x, y) {
        const cell = this.getCell(x, y);
        if(cell.locked) {
            return;
        }

        cell.value = SudokuCell.EMPTY;
    }

    fillValues(values) {
        if(!(values.length === this.board.length)) {
            return
        }

        for(let i = 0; i < values.length; i++) {
            if(values[i]) {
                this.board[i].value = values[i];
                this.board[i].locked = true;
                this.board[i].possible_numbers = [];
            } else {
                this.board[i].value = SudokuCell.EMPTY;
                this.board[i].locked = false;
                this.board[i].possible_numbers = [];
            }
        }
    }

    isValid() {
        
    }

    toIndex(x, y) {
        return y * this.size + x;
    }

    toCoords(index) {
        const x = index % this.size;
        const y = index / this.size | 0;
        return {x, y}
    }

    getCell(x, y) {
        return this.board[this.toIndex(x, y)];
    }

    getBlock(x, y) {
        const block_x = x / this.block_width | 0;
        const block_y = y / this.block_height | 0;

        const cells = [];
        for(let i = 0; i < this.block_height; i++) {
            for(let j = 0; j < this.block_width; j++) {
                cells.push(this.getCell(j + block_x * this.block_width, i + block_y * this.block_height));
            }
        }

        return cells;
    }

    getRow(y) {
        const cells = [];
        for(let x = 0; x < this.size; x++) {
            cells.push(this.getCell(x, y));
        }
        return cells;
    }

    getColumn(x) {
        const cells = [];
        for(let y = 0; y < this.size; y++) {
            cells.push(this.getCell(x, y));
        }
        return cells;
    }
}