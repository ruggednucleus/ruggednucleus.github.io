"use strict"

class Minesweeper {
    constructor(cell_size, icons, touch) {
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

        this.start_click = false;

        this.cell_size = cell_size;

        this.flag_icon = icons.flag;
        this.clock_icon = icons.clock;

        this.active_cells = [];
        this.mouse_down = 0;

        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas_width = window.innerWidth;
        this.canvas_height = window.innerHeight;

        this.game_offsetX = 0;
        this.game_offsetY = 0;

        this.border_width = 3;
        this.border_style = "#0f8f0f";
        //this.border_style = "#14be14";
        this.top_size = 0;

        this.time = 0;

        this.touchEvent = {
            touchDuration: 400,
            lastTouch: 0,
            doubleTabDuration: 500,
            touchHold: false,
            timer: null,
            x: null,
            y: null,
        }

        this.addEventListeners(touch);
        this.loop(this);
    }

    start(width, height, number_of_mines) {
        this.game_width = width;
        this.game_height = height;
        this.number_of_mines = number_of_mines;
        this.flags_placed = 0;

        this.resizeGame();

        this.minesweeper_board = new MinesweeperBoard(this.game_width, this.game_height, this.number_of_mines);

        this.playing = true;
        this.game_lost = false;
        this.game_won = false;
        this.start_click = false;
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

    updateUI() {
        this.time = this.getTime();
        if(this.time < 10) {
            this.time = "00" + this.time;
        } else if(this.time < 100) {
            this.time = "0" + this.time;
        }
    }

    renderUI() {
        this.ctx.textAlign = "right";
        let fontSize = this.cell_size * 0.5;
        this.ctx.font = fontSize + "px monospace";
        this.ctx.fillStyle = "white";

        let text_width = this.ctx.measureText(this.time).width
        let width = text_width * 2 + this.cell_size * 3 | 0;
        let x = this.game_width * this.cell_size / 2 - width / 2;
        let y = -this.top_size + this.top_size / 2 - this.cell_size / 2;

        this.ctx.fillText(this.number_of_mines - this.flags_placed,  x + text_width, -this.top_size / 2 + fontSize / 3);
        this.ctx.drawImage(this.flag_icon, 0, 0, this.flag_icon.width, this.flag_icon.height, x + text_width + this.cell_size * 0.2, y, this.cell_size, this.cell_size);
        
        this.ctx.fillText(this.time,  x + width - this.cell_size - this.cell_size * 0.2, -this.top_size / 2 + fontSize / 3)
        this.ctx.drawImage(this.clock_icon, 0, 0, this.flag_icon.width, this.flag_icon.height, x + width - this.cell_size, y, this.cell_size, this.cell_size);
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas_width, this.canvas_height);
        this.ctx.save();
        this.ctx.translate(this.offsetX, this.offsetY);
        // UI
        this.ctx.fillStyle = this.border_style;
        this.ctx.fillRect(0, -this.top_size, this.game_width * this.cell_size, this.top_size * 2);
        this.renderUI();

        // Render cells
        for(let cell of this.minesweeper_board.board) {
            let active = this.active_cells.includes(cell);
            cell.render(this.ctx, this.cell_size, this.flag_icon, active);
        }

        // Render particles
        for(let cell of this.minesweeper_board.board) {
            cell.renderParticles(this.ctx, this.cell_size);
        }
        this.ctx.restore();
    }

    showCell(x, y) {
        let cells = this.minesweeper_board.show(x, y);
        for(let cell of cells) {
            cell.show(this.cell_size);
        }

        this.checkGameOver();
    }

    flagCell(x, y) {
        let cell = this.minesweeper_board.flag(x, y);
        if(!cell.hidden) {
            return;
        }

        if(!cell.flag) {
            this.flags_placed--;
            cell.removeFlag(this.cell_size, this.flag_icon);
        } else {
            this.flags_placed++;
        }
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
        this.game_won_parameters.wait = 200;
        this.game_won_parameters.offsetY = 0;
    }

    gameWon() {
        let p = this.game_won_parameters;
        if(performance.now() - p.last_update >= p.wait && p.offsetY < this.game_height) {
            p.last_update = performance.now();
            for(let x = 0; x < this.game_width; x++) {
                let cell = this.minesweeper_board.at(x, p.offsetY);
                if(cell.mine) {
                    cell.growFlowers(this.cell_size);
                    if(cell.flag) {
                        cell.flag = false;
                        cell.removeFlag(this.cell_size, this.flag_icon);
                    }
                } else {
                    cell.water(p.last_update);
                }
            }
            
            p.offsetY += 1;
        }
    }




    getTime() {
        if(this.start_click) {
            return (performance.now() - this.start_time) / 1000 | 0;
        } else {
            return 0;
        }
    }

    setCellSize(size) {
        this.cell_size = size;
        this.resizeGame();
    }

    resizeGame() {
        this.canvas_width = window.innerWidth;
        this.canvas_height = window.innerHeight;
        this.canvas.width = this.canvas_width;
        this.canvas.height = this.canvas_height;

        if(!this.cell_size) {
            this.cell_size = Math.min(this.canvas_width * 0.9 / this.game_width, this.canvas_height * 0.8 / this.game_height ) | 0;
        }
        
        this.top_size = this.cell_size * 1.5 | 0;
        this.offsetX = this.canvas_width / 2 - this.cell_size * this.game_width / 2 | 0;
        this.offsetY = this.canvas_height / 2 - this.cell_size * (this.game_height - 1.5) / 2 | 0;
    }


    // Event listeners
    addEventListeners(touch) {
        if(touch) {
            this.addTouchEvents();
        } else {
            this.addMouseEvents();
        }
    }

    addTouchEvents() {
        this.canvas.addEventListener("touchstart", e => {
            e.preventDefault();
            if(this.game_lost || this.game_won) {
                this.touchEvent.touchHold = true;
                this.start(this.game_width, this.game_height, this.number_of_mines);
                return
            }

            if(performance.now() - this.touchEvent.lastTouch < this.touchEvent.doubleTabDuration) {
                let cell = this.minesweeper_board.at(this.touchEvent.x, this.touchEvent.y);
                let neighbors = this.minesweeper_board.getNeighbors(this.minesweeper_board.index(this.touchEvent.x, this.touchEvent.y));
                let flags = 0;
                let active_cells = [];
                for(let neighbor of neighbors) {
                    if(neighbor.hidden && !neighbor.flag) {
                        active_cells.push(neighbor);
                    } else if(neighbor.flag) {
                        flags++;
                    }
                }

                if(!cell.hidden && flags === cell.value) {
                    active_cells.forEach(element => {
                        this.showCell(element.x, element.y);
                    });
                }
            } else {
                let x = (e.touches[0].pageX - this.offsetX) / this.cell_size
                let y = (e.touches[0].pageY - this.offsetY) / this.cell_size

                if(x < 0 || y < 0 || x >= this.game_width || y >= this.game_height) {
                    this.active_cells = [];
                    return;
                }

                this.touchEvent.x = x | 0;
                this.touchEvent.y = y | 0;

                this.touchEvent.touchHold = false;
                this.touchEvent.timer = setTimeout(() => this.longTouch(this), this.touchEvent.touchDuration);
            }

            this.touchEvent.lastTouch = performance.now();
        });

        this.canvas.addEventListener("touchend", e => {
            e.preventDefault();
            if(this.touchEvent.timer) {
                clearTimeout(this.touchEvent.timer);
                if(!this.touchEvent.touchHold) {
                    if(!this.start_click) {
                        this.start_click = true;
                        this.start_time = performance.now();
                    }
                    this.showCell(this.touchEvent.x, this.touchEvent.y);
                }
            }
        });
    }

    longTouch(self) {
        self.touchEvent.touchHold = true;
        self.flagCell(self.touchEvent.x, self.touchEvent.y);
    }

    addMouseEvents() {
        this.canvas.addEventListener("mousedown", e => {
            e.preventDefault();

            if(this.game_lost || this.game_won) {
                if(e.which === 1) {
                    this.start(this.game_width, this.game_height, this.number_of_mines)
                }
                return
            }

            let x = (e.pageX - this.offsetX) / this.cell_size;
            let y = (e.pageY - this.offsetY) / this.cell_size;

            if(x < 0 || y < 0 || x >= this.game_width || y >= this.game_height) {
                this.active_cells = [];
                return;
            }

            x |= 0;
            y |= 0;
            this.mouse_down = e.which;

            let cell;
            switch(e.which) {
                case 1:
                    if(!this.start_click) {
                        this.start_click = true;
                        this.start_time = performance.now();
                    }
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
                    this.flagCell(x, y);
                    break;
            }
        });

        window.addEventListener("mouseup", e => {
            let x = (e.pageX - this.offsetX) / this.cell_size;
            let y = (e.pageY - this.offsetY) / this.cell_size;

            if(x < 0 || y < 0 || x >= this.game_width || y >= this.game_height) {
                this.active_cells = [];
                return;
            }

            x |= 0;
            y |= 0;
            this.active_cells = [this.minesweeper_board.at(x, y)];

            this.mouse_down = 0;
        });

        this.canvas.addEventListener("mousemove", e => {
            let x = (e.pageX - this.offsetX) / this.cell_size;
            let y = (e.pageY - this.offsetY) / this.cell_size;

            if(x < 0 || y < 0 || x >= this.game_width || y >= this.game_height) {
                this.active_cells = [];
                return;
            }

            x |= 0;
            y |= 0;

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