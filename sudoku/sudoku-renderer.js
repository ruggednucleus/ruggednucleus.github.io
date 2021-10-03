class SudokuRenderer {

    cell_size = 60;
    active_cell = {x: 0, y: 0};
    hover_cell = undefined;
    hitboxes = [];

    line_width = 1;
    font_size = this.cell_size * 0.7;

    constructor(canvas, sudoku) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.sudoku = sudoku;

        this.width = this.sudoku.size * this.cell_size;
        this.height = this.sudoku.size * this.cell_size;

        canvas.width = this.width + 3;
        canvas.height = this.height + 3;

        this.createSudokuHitbox();
    }

    createSudokuHitbox() {
        this.hitboxes.push(new Hitbox(
            0, 0,
            this.sudoku.size * this.cell_size, this.sudoku.size * this.cell_size,
            (position) => {
                this.active_cell = {
                    x: position.x / this.cell_size | 0,
                    y: position.y / this.cell_size | 0
                }
            },
            (position) => {
                this.hover_cell = {
                    x: position.x / this.cell_size | 0,
                    y: position.y / this.cell_size | 0
                }
            }
        ));
    }

    click(x, y) {
        x = x - this.canvas.width * 0.5 + this.width * 0.5;
        y = y - this.canvas.height * 0.5 + this.height * 0.5;
    
        for(let i = 0; i < this.hitboxes.length; i++) {
            this.hitboxes[i].click(x, y);
        }
    }

    hover(x, y) {
        this.hover_cell = undefined;

        x = x - this.canvas.width * 0.5 + this.width * 0.5;
        y = y - this.canvas.height * 0.5 + this.height * 0.5;
    
        for(let i = 0; i < this.hitboxes.length; i++) {
            this.hitboxes[i].hover(x, y);
        }
    }

    moveActiveCell(dir_x, dir_y) {
        if(this.active_cell.x + dir_x < this.sudoku.size && this.active_cell.x + dir_x >= 0 && this.active_cell.y + dir_y < this.sudoku.size && this.active_cell.y + dir_y >= 0) {
            this.active_cell.x += dir_x;
            this.active_cell.y += dir_y;
        }
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
 
        // Setup
        const offsetX = 0//this.canvas.width % 2 === this.line_width % 2 ? 0 : -0.5;
        const offsetY = 0//this.canvas.height % 2 === this.line_width % 2 ? 0 : -0.5;
    
        this.ctx.save();
        this.ctx.translate(this.canvas.width * 0.5 - this.width * 0.5 + offsetX, this.canvas.height * 0.5 - this.height * 0.5 + offsetY);
    
        // Active and hover
        if(this.hover_cell) {
            this.ctx.fillStyle = "#EEF";
            this.ctx.fillRect(this.hover_cell.x * this.cell_size, this.hover_cell.y * this.cell_size, this.cell_size, this.cell_size);
        }
    
        if(this.active_cell) {
            this.ctx.fillStyle = "#CCF";
            this.ctx.fillRect(this.active_cell.x * this.cell_size, this.active_cell.y * this.cell_size, this.cell_size, this.cell_size);
        }
        
        // Cell values
        this.ctx.fillStyle = "black";
        this.ctx.font = `${this.font_size}px monospace`;
        this.ctx.textAlign = "center";

        for(let x = 0; x < this.sudoku.size; x++) {
            for(let y = 0; y < this.sudoku.size; y++) {
                const value = this.sudoku.getCell(x, y).value;
                if(value !== SudokuCell.EMPTY) {
                    this.ctx.fillText(value, x * this.cell_size + this.cell_size * 0.5 , y * this.cell_size + this.cell_size * 0.5 + this.font_size * 0.3);
                }
            }
        }

        // Possible numbers
        this.ctx.fillStyle = "black";
        this.ctx.font = `${this.font_size / this.sudoku.block_height}px monospace`;
        this.ctx.textAlign = "center";

        for(let x = 0; x < this.sudoku.size; x++) {
            for(let y = 0; y < this.sudoku.size; y++) {
                const possible_numbers = this.sudoku.getCell(x, y).possible_numbers;
                if(!this.sudoku.getCell(x, y).value && possible_numbers.length) {
                    for(let i = 0; i < possible_numbers.length; i++) {
                        const offset_x = (i % this.sudoku.block_width) + 0.5;
                        const offset_y = (i / this.sudoku.block_width | 0) + 0.5;
                        this.ctx.fillText(possible_numbers[i],
                            x * this.cell_size + offset_x * (this.cell_size / this.sudoku.block_width),
                            y * this.cell_size + offset_y * (this.cell_size / this.sudoku.block_height) + this.font_size / this.sudoku.block_height * 0.3
                        );
                    }
                }
            }
        } 
    
        // Borders
        for(let x = 0; x <= this.sudoku.size; x++) {
            this.ctx.beginPath();
            this.ctx.lineWidth = x % this.sudoku.block_width ? this.line_width : this.line_width * 3;
            this.ctx.moveTo(x * this.cell_size, -this.ctx.lineWidth * 0.5);
            this.ctx.lineTo(x * this.cell_size, this.sudoku.size * this.cell_size + this.ctx.lineWidth * 0.5);
            this.ctx.stroke();
        }
        for(let y = 0; y <= this.sudoku.size; y++) {
            this.ctx.beginPath();
            this.ctx.lineWidth = y % this.sudoku.block_width ? this.line_width : this.line_width * 3;
            this.ctx.moveTo(-this.ctx.lineWidth * 0.5, y * this.cell_size);
            this.ctx.lineTo(this.sudoku.size * this.cell_size + this.ctx.lineWidth * 0.5, y * this.cell_size);
            this.ctx.stroke();
        }
    
        this.ctx.restore();
    }
}