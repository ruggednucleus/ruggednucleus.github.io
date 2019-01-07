function Game(ctx, canvas_width, canvas_height) {
    let width = 7;
    let max_height = 10;
    let start_height = 4;
    let max_neighbors = 3;

    let cell_width = canvas_width / width | 0;
    let cell_height = canvas_height / max_height | 0;

    let colors = [
        {color: "red"},
        {color: "green"},
        {color: "blue"},
        {color: "yellow"},
        {color: "purple"},
    ];

    let board = Board(width, start_height, colors, max_neighbors);
    let to_remove = [];

    let held_cell = undefined;

    function switch_cells(x) {
        let result = board.switch(x);
        if(result) {
            to_remove = board.findBlocks();
        }
    }

    function grab(x) {
        held_cell = board.grab(x);
    }

    function place(x) {
        board.place(x, held_cell);
        held_cell = undefined;
        to_remove = board.findBlocks();
    }

    function draw() {

        ctx.clearRect(0, 0, canvas_width, canvas_height);

        let b = board.getBoard();
        
        for(let x = 0; x < b.length; x++) {
            for(let y = 0; y < b[x].length; y++) {
                ctx.fillStyle = b[x][y].color;
                ctx.fillRect(x * cell_width, y * cell_height, cell_width, cell_height);
            }
        }
    }

    function render() {
        if(to_remove.length) {
            board.remove(to_remove);
            to_remove = board.findBlocks();
        }

        draw();
        requestAnimationFrame(render);
    }

    render();

    return {
        board: board,

        switch: switch_cells,

        click: function(px, py) {
            let x = px / cell_width | 0;
            let y = py / cell_height | 0;

            if(y < board.getBoard()[x].length - 1) {
                switch_cells(x);
            } else if(held_cell) {
                place(x);
            } else {
                grab(x);
            }
        },

        get_held: function() {
            return held_cell;
        }
    }
}

function Board(width, height, cells, max_neighbors) {
    let board = [];
    for(let x = 0; x < width; x++) {
        board.push([]);
    }

    for(let y = 0; y < height; y++) {
        add_line(cells, max_neighbors);
    }

    function add_line(cells, max_neighbors) {
        for(let i = 0; i < width; i++) {
            let cell = cells[Math.random() * cells.length | 0];
            board[i].unshift(Cell(cell.color));
            if(find_neighbors(i, 0).length > max_neighbors) {
                board[i].shift();
                i--;
            }
        }
    }

    function at(x, y) {
        if(x >= 0 && x < width && y >= 0 && y < board[x].length) {
            return board[x][y];
        }

        return undefined;
    }

    function find_neighbors(x, y) {
        let color = board[x][y].color;
        let cells = [];

        let checked_cells = {};
        let cells_to_check = [];

        function add_to_check(x, y) {
            if(!checked_cells[[x, y]] && at(x, y) !== undefined) {
                cells_to_check.push([x, y]);
            }
        }

        add_to_check(x, y);

        while(cells_to_check.length) {
            let cell = cells_to_check.shift();
            if(checked_cells[cell]) {
                continue;
            }

            checked_cells[cell] = true;

            let x = cell[0];
            let y = cell[1];

            if(board[x][y].color === color) {
                cells.push(cell);

                add_to_check(x - 1, y);
                add_to_check(x + 1, y);
                add_to_check(x, y - 1);
                add_to_check(x, y + 1);
            }
        }

        return cells;
    }

    function remove(cells) {
  
        for(let i = 0; i < cells.length; i++) {
            let x = cells[i][0];
            let y = cells[i][1];
            board[x][y] = undefined;
        }

        for(let x = 0; x < width; x++) {
            for(let y = 0; y < board[x].length; y++) {
                if(board[x][y] === undefined) {
                    board[x].splice(y, 1);
                    y--;
                }
            }
        }
    }

    return {
        getBoard: function() {
            return board;
        },
        neighbors: find_neighbors,

        getHeight: function() {
            let height = 0;
            for(let x = 0; x < board.length; x++) {
                if(board[x].length > height) {
                    height = board[x].length;
                }
            }
            return height;
        },

        switch: function(x) {
            if(x < 0 || x > board.length) {
                return false
            }

            let height = board[x].length;
            if(height > 1) {
                let temp = board[x][height - 1];
                board[x][height - 1] = board[x][height - 2];
                board[x][height - 2] = temp;

                return true;
            }

            return false;
        },

        grab: function(x) {
            if(board[x].length) {
                return board[x].splice(board[x].length - 1)[0];
            }
            return undefined;
        },

        place: function(x, cell) {
            board[x].push(cell);
        },

        findBlocks: function() {
            let checked_cells = {};
            let to_remove = [];

            for(let x = 0; x < width; x++) {
                for(let y = 0; y < board[x].length; y++) {
                    if(!checked_cells[[x, y]]) {
                        let neighbors = find_neighbors(x, y);
                        if(neighbors.length > max_neighbors) {
                            to_remove = to_remove.concat(neighbors);
                        }
                        for(let i = 0; i < neighbors.length; i++) {
                            checked_cells[neighbors[i]] = true;
                        }
                    }
                }
            }

            return to_remove;
        },

        remove: remove,
        addLine: add_line,
    }
}

function Cell(color) {
    return {
        color: color,
    }
}