function Game(CTX, WIDTH, MAX_HEIGHT, START_HEIGHT, SIZE, SPRITES) {
    let canvas_width = WIDTH * SIZE;
    let canvas_height = MAX_HEIGHT * SIZE;
    let max_neighbors = 3;

    let board = Board(WIDTH, START_HEIGHT, SPRITES, max_neighbors);
    let to_remove = [];
    let animations = [];

    function draw() {
        CTX.clearRect(0, 0, canvas_width, canvas_height);

        let b = board.getBoard();
        
        for(let x = 0; x < b.length; x++) {
            for(let y = 0; y < b[x].length; y++) {
                let cell = b[x][y];
                if(!cell.animateing) {
                    CTX.putImageData(cell.frames[0], x * SIZE, y * SIZE);
                }
            }
        }

        if(animations.length) {
            console.log(animations[0])
            let time = (performance.now() - animations[0].start) / animations[0].time;
            let cells = animations[0].cells;

            for(let i = 0; i < cells.length; i++) {
                let cell = cells[i];
                CTX.putImageData(b[cell.pos.x][cell.pos.y].frames[0], cell.fromX + (cell.toX - cell.fromX) * time, cell.fromY + (cell.toY - cell.fromY) * time);
            }
        }
    }

    function render() {
        if(animations.length && performance.now() - animations[0].start >= animations[0].time) {
            let animation = animations.shift();
            for(let i = 0; i < animation.cells.length; i++) {
                let pos = animation.cells[i].pos;
                board.animateing(pos.x, pos.y, false);
            }
        }

        if(to_remove.length) {
            board.remove(to_remove);
            to_remove = board.findBlocks();
            if(to_remove.length === 0) {
                board.addLine();
            }
        }

        draw();
        requestAnimationFrame(render);
    }

    render();

    function switchAnimation(cells) {
        let animation = {
            type: "switch",
            start: performance.now(),
            time: 200,
            cells: [],
        };

        for(let i = 0; i < cells.length; i++) {
            let from = cells[i].from;
            let to = cells[i].to;

            board.animateing(to.x, to.y, true);

            animation.cells.push({
                pos: {x: to.x, y: to.y},
                fromX: from.x * size,
                toX: to.x * size,
                fromY: from.y * size,
                toY: to.y * size,
                fromSprite: 0,
                toSprite: 0,
            });
        }

        animations.push(animation);
    }

    return {
        getBoard: function() {
            return board;
        },
        
        switch: function(x1, y1, x2, y2) {
            let cells = board.switch(x1, y1, x2, y2);
            if(cells.length) {
                switchAnimation(cells);
            }
        },
    }
}

function Board(WIDTH, HEIGHT, CELLS, MAX_NEIGHBORS) {
    let board = [];
    for(let x = 0; x < WIDTH; x++) {
        board.push([]);
    }

    for(let y = 0; y < HEIGHT; y++) {
       
        add_line();
    }

    function add_line() {
        for(let i = 0; i < WIDTH; i++) {
            let cell = CELLS[Math.random() * CELLS.length | 0];
            board[i].unshift(Cell(cell));
            if(find_neighbors(i, 0).length > MAX_NEIGHBORS) {
                board[i].shift();
                i--;
            }
        }
    }

    function at(x, y) {
        if(x >= 0 && x < WIDTH && y >= 0 && y < board[x].length) {
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

        for(let x = 0; x < WIDTH; x++) {
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

        switch: function(x1, y1, x2 ,y2) {
            if(at(x1, y1) === undefined || at(x2, y2) === undefined) {
                return [];
            }

            let temp = board[x1][y1];
            board[x1][y1] = board[x2][y2];
            board[x2][y2] = temp;

            return [
                {
                    from: {x: x1, y: y1},
                    to: {x: x2, y: y2},
                },
                {
                    from: {x: x2, y: y2},
                    to: {x: x1, y: y1},
                }];
        },

        findBlocks: function() {
            let checked_cells = {};
            let to_remove = [];

            for(let x = 0; x < WIDTH; x++) {
                for(let y = 0; y < board[x].length; y++) {
                    if(!checked_cells[[x, y]]) {
                        let neighbors = find_neighbors(x, y);
                        if(neighbors.length > MAX_NEIGHBORS) {
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

        animateing: function(x, y, bool) {
            if(at(x, y)) {
                board[x][y].animateing = bool; 
            }
        },

        remove: remove,
        addLine: add_line,
    }
}

function Cell(data) {
    let color = data.color;
    let frames = data.frames;
    return {
        color: color,
        frames: frames,
        animateing: false,
    }
}