"use strict"

class Minesweeper {
    constructor(cell_size, flag_icon) {
        this.game_width;
        this.game_height;
        this.number_of_mines;
        this.minesweeper_board;
        this.playing = false;
        this.game_lost = false;
        this.game_lost_parameters = {};
        this.game_won = false;
        this.game_won_parameters = {};
        this.start_time = 0;
        this.flags_placed = 0;

        this.cell_size = cell_size;
        this.flag_icon = flag_icon;

        this.active_cells = [];
        this.mouse_down = 0;

        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas_width;
        this.canvas_height;

        this.flower;

        this.addEventListeners();
        this.loop(this);
    }

    start(width, height, number_of_mines) {
        this.game_width = width;
        this.game_height = height;
        this.number_of_mines = number_of_mines;

        this.resizeCanvas();

        this.minesweeper_board = new MinesweeperBoard(this.game_width, this.game_height, this.number_of_mines);

        this.playing = true;
        this.game_lost = false;
        this.game_won = false;
        this.start_time = performance.now();
    }

    loop(self) {
        if(self.playing) {
            if(this.game_lost) {
                this.gameLost();
            } else if(this.game_won) {
                this.gameWon();
            } else {
                self.updateUI();
            }

            self.render();
        }

        requestAnimationFrame(() => self.loop(self));
    }

    updateUI() {/*
        this.ui_time.innerText = this.getTime();
        this.ui_flags.innerText = this.number_of_mines - this.flags_placed;*/
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas_width, this.canvas_height);

        // Render cells
        for(let cell of this.minesweeper_board.board) {
            let active = this.active_cells.includes(cell);
            cell.render(this.ctx, this.cell_size, this.flag_icon, active);
        }

        // Render particles
        for(let cell of this.minesweeper_board.board) {
            cell.renderParticles(this.ctx, this.cell_size);
        }
    }

    showCell(x, y) {
        let cells = this.minesweeper_board.show(x, y);
        for(let cell of cells) {
            cell.show(this.cell_size);
        }

        this.checkGameOver();
    }

    checkGameOver() {
        let cells = this.minesweeper_board.board;
        let won = true
        for(let cell of cells) {
            if(!cell.hidden && cell.mine) {
                this.setupGameLost(cell);
                return
            } else if(cell.hidden && !cell.mine){
                won = false;
            }
        }
        if(won) {
            this.setupGameWon();
        }
    }

    setupGameLost(mine) {
        mine.show(this.cell_size)
        mine.explode(this.cell_size);
        this.game_lost = true;
        this.game_lost_parameters.mines = this.minesweeper_board.mines;
        this.game_lost_parameters.mine = mine;
        this.game_lost_parameters.last_update = performance.now();
        this.game_lost_parameters.wait = 100;
        for(let i = 0; i < this.game_lost_parameters.mines.length; i++) {
            if(this.game_lost_parameters.mines[i].flag || this.game_lost_parameters.mines[i] === mine) {
                this.game_lost_parameters.mines.splice(i, 1);
                i--;
            }
        }
    }

    gameLost() {
        let p = this.game_lost_parameters;
        if(performance.now() - p.last_update >= p.wait) {
            p.last_update = performance.now();

            if(p.mines.length) {
                let index = 0;
                let dist = Infinity;
                for(let i = 0; i < p.mines.length; i++) {
                    let d = Math.abs(p.mine.x - p.mines[i].x) + Math.abs(p.mine.y - p.mines[i].y);
                    if(d < dist) {
                        index = i;
                        dist = d;
                    }
                }

                p.mine = p.mines[index];
                p.mines.splice(index, 1);
                p.mine.hidden = false;
                p.mine.show(this.cell_size)
                p.mine.explode(this.cell_size);
                if(p.mine.flag) {
                    p.mine.removeFlag(this.cell_size, this.flag_icon);
                }
            }
        }
    }

    setupGameWon() {
        this.game_won = true;
        this.game_won_parameters.last_update = performance.now() + 200;
        this.game_won_parameters.wait = 100;
        this.game_won_parameters.offsetY = 0;
    }

    gameWon() {
        let p = this.game_won_parameters;
        if(performance.now() - p.last_update >= p.wait && p.offsetY < this.game_height) {
            p.last_update = performance.now();
            for(let x = 0; x < this.game_width; x++) {
                let cell = this.minesweeper_board.at(x, p.offsetY);
                if(cell.mine) {
                    if(cell.flag) {
                        cell.flag = false;
                        cell.removeFlag(this.cell_size, this.flag_icon);
                    }
                    cell.growFlowers(this.cell_size);
                } else {
                    cell.water(p.last_update);
                }
            }
            
            p.offsetY += 1;
        }
    }




    getTime() {
        return (performance.now() - this.start_time) / 1000 | 0;
    }

    setCellSize(size) {
        this.cell_size = size;
        this.resizeCanvas();
    }

    resizeCanvas() {
        this.canvas_width = this.game_width * this.cell_size;
        this.canvas_height = this.game_height * this.cell_size;
        this.canvas.width = this.canvas_width;
        this.canvas.height = this.canvas_height;
    }


    // Event listeners
    addEventListeners() {
        this.canvas.addEventListener("mousedown", e => {
            e.preventDefault();

            if(this.game_lost || this.game_won) {
                if(e.which === 1) {
                    this.start(this.game_width, this.game_height, this.number_of_mines)
                }
                return
            }

            let x = e.offsetX / this.cell_size | 0;
            let y = e.offsetY / this.cell_size | 0;
            this.mouse_down = e.which;

            let cell;
            switch(e.which) {
                case 1:
                    this.showCell(x, y);
                    break;
                
                case 2:
                    cell = this.minesweeper_board.at(x, y);
                    let neighbors = this.minesweeper_board.getNeighbors(this.minesweeper_board.index(x, y));
                    let flags = 0;
                    this.active_cells = [];
                    for(let neighbor of neighbors) {
                        if(neighbor.hidden && !neighbor.flag) {
                            this.active_cells.push(neighbor);
                        } else if(neighbor.flag) {
                            flags++;
                        }
                    }

                    if(!cell.hidden && flags === cell.value) {
                        this.active_cells.forEach(element => {
                            this.showCell(element.x, element.y);
                        });
                        
                        this.active_cells = [cell];
                    } else {
                        this.active_cells.push(cell);
                    }
                    break;

                case 3:
                    cell = this.minesweeper_board.flag(x, y);
                    if(cell.hidden && !cell.flag) {
                        this.flags_placed--;
                        cell.removeFlag(this.cell_size, this.flag_icon);
                    } else {
                        this.flags_placed++;
                    }
                    break;
            }
        });

        window.addEventListener("mouseup", e => {
            let x = e.offsetX / this.cell_size | 0;
            let y = e.offsetY / this.cell_size | 0;
            this.active_cells = [this.minesweeper_board.at(x, y)];

            this.mouse_down = 0;
        });

        this.canvas.addEventListener("mousemove", e => {
            let x = e.offsetX / this.cell_size | 0;
            let y = e.offsetY / this.cell_size | 0;

            let cell = this.minesweeper_board.at(x, y);
            let neighbors = this.minesweeper_board.getNeighbors(this.minesweeper_board.index(x, y));
            if(this.mouse_down === 2) {
                this.active_cells = [];
                for(let neighbor of neighbors) {
                    if(neighbor.hidden && !neighbor.flag) {
                        this.active_cells.push(neighbor);
                    }
                }
                this.active_cells.push(cell);
            } else {
                this.active_cells = [cell];
            }
        })

        this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    }
}