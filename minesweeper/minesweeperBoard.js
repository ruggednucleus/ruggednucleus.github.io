"use strict"

class MinesweeperBoard {
    constructor(width, height, number_of_mines) {
        this.width = width;
        this.height = height;
        this.number_of_mines = number_of_mines;
        this.mines = [];
        this.board = [];
        this.newBoard = true;
        this.createBoard();
    }
    
    index(x, y) {
        return y * this.width + x;
    }

    show(x, y) {
        if(this.newBoard) {
            this.createMines(x, y);
            this.setValues();
            this.newBoard = false;
        }

        let cells = [];
        let cellsToShow = [];
        let cell = this.board[this.index(x, y)]

        if(cell.hidden && !cell.flag) {
            if(cell.mine) {
                cell.hidden = false;
            } else {
                cellsToShow.push(cell);
                while(cellsToShow.length) {
                    let cell = cellsToShow.pop();
                    if(cell.hidden && !cell.flag) {
                        cell.hidden = false;
                        cells.push(cell);

                        if(cell.value === 0) {
                            let neighbors = this.getNeighbors(this.index(cell.x, cell.y));
                            for(let neighbor of neighbors) {
                                if(neighbor.hidden) {
                                    cellsToShow.push(neighbor);
                                }
                            }
                        }
                    }
                }
            }
        }

        return cells;
    }

    flag(x, y) {
        let cell = this.board[this.index(x, y)];
        if(cell.hidden) {
            cell.flag = !cell.flag;
        }
        return cell;
    }

    at(x, y) {
        if(x >= 0 && x < this.width && y >= 0 && y < this.height) {
            return this.board[this.index(x, y)];
        } else {
            return false;
        }
    }

    createBoard() {
        this.board = new Array(this.width * this.height);

        for(let i = 0; i < this.board.length; i++) {
            let x = i % this.width;
            let y = i / this.width | 0;
            this.board[i] = new MinesweeperCell(this, x, y);
        }
    }

    createMines(start_x, start_y) {
        let mines = this.number_of_mines;
        let positions = [];
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                positions.push({x: x, y: y});
            }
        }
        while(mines > 0 && positions.length) {
            let pos = positions.splice(Math.random() * positions.length | 0, 1)[0];
            let index = this.index(pos.x, pos.y);
            let dist = Math.pow(start_x - pos.x, 2) + Math.pow(start_y - pos.y, 2);
            if(dist > 2) {
                this.board[index].mine = true;
                this.mines.push(this.board[index]);
                mines--;
            }

            /*
            let x = Math.random() * this.width | 0;
            let y = Math.random() * this.height | 0;
            let index = this.index(x, y);
            let dist = Math.pow(start_x - x, 2) + Math.pow(start_y - y, 2);
            if(dist > 2 && !this.board[index].mine) {
                this.board[index].mine = true;
                this.mines.push(this.board[index]);
                mines--;
            }
            */
        }
    }

    setValues() {
        for(let i = 0; i < this.board.length; i++) {
            let neighbors = this.getNeighbors(i);
            let mines = 0;
            for(let neighbor of neighbors) {
                if(neighbor.mine) {
                    mines++;
                }
            }
            this.board[i].value = mines;
        }
    }

    getNeighbors(index) {
        let neighbors = [];
        let x = index % this.width;
        let y = index / this.width | 0;

        for(let i = -1; i < 2; i++) {
            for(let j = -1; j < 2; j++) {
                if(x + i >= 0 && x + i < this.width && y + j >= 0 && y + j < this.height) {
                    let ix = this.index(x + i, y + j);
                    if(ix !== index) {
                        neighbors.push(this.board[ix]);
                    }
                }
            }
        }

        return neighbors;
    }
}