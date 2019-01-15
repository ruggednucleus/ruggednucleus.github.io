function Game(ctx, width, height, size, sprites) {

    let animations = [];
    let player_switch = false;

    let board = Board(width, height, sprites, 2);

    function draw() {
        ctx.clearRect(0, 0, width * size, height * size);
        let b = board.getBoard();
        for(let x = 0; x < width; x++) {
            for(let y = 0; y < height; y++) {
                if(board.at(x, y) !== undefined && !b[x][y].animateing) {
                    b[x][y].draw(ctx, 0, x * size, y * size, size);
                }
            }
        }

        if(animations.length) {
            let time = (performance.now() - animations[0].start) / animations[0].time;
            let cells = animations[0].cells;

            for(let i = 0; i < cells.length; i++) {
                let cell = cells[i];
                b[cell.pos.x][cell.pos.y].draw(ctx, cell.fromFrame + (cell.toFrame - cell.fromFrame) * time | 0, cell.fromX + (cell.toX - cell.fromX) * time, cell.fromY + (cell.toY - cell.fromY) * time, size)
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

            let cells_to_remove;

            switch(animation.type) {
                case "switch":
                    if(player_switch && board.find().length === 0) {
                        switch_cells(animation.cells[1].pos.x, animation.cells[1].pos.y, animation.cells[0].pos.x, animation.cells[0].pos.y);
                    }
                    player_switch = false;
                    cells_to_remove = board.find();
                    if(cells_to_remove.length) {
                        animateRemove(cells_to_remove);
                    }
                    break;
                case "remove":
                    let fallin_cells = board.remove(animation.raw_cells);
                    animateFall(fallin_cells);
                    break;
                case "fall":
                    cells_to_remove = board.find();
                    if(cells_to_remove.length) {
                        animateRemove(cells_to_remove);
                    } else {
                        animateFill(board.fill());
                    }
                    break;
                case "fill":
                    cells_to_remove = board.find();
                    if(cells_to_remove.length) {
                        animateRemove(cells_to_remove);
                    }
                    break;
            }
        }

        draw();

        requestAnimationFrame(render);
    }

    render();

    function switch_cells(x1, y1, x2, y2) {
        board.switch(x1, y1, x2, y2);
        board.animateing(x1, y1, true);
        board.animateing(x2, y2, true);
        animations.push({
            type: "switch",
            start: performance.now(),
            time: 200,
            cells: [{
                pos: {x: x1, y: y1},
                fromX: x2 * size,
                toX: x1 * size,
                fromY: y2 * size,
                toY: y1 * size,
                fromFrame: 9,
                toFrame: 9,
            },
            {
                pos: {x: x2, y: y2},
                fromX: x1 * size,
                toX: x2 * size,
                fromY: y1 * size,
                toY: y2 * size,
                fromFrame: 9,
                toFrame: 9,
            }],
        });
    }

    function animateRemove(cells) {
        let animation = {
            type: "remove",
            start: performance.now(),
            time: 500,
            cells: [],
            raw_cells: cells,
        };

        for(let i = 0; i < cells.length; i++) {
            let x = cells[i][0];
            let y = cells[i][1];
            board.animateing(x, y, true);
            animation.cells.push({
                pos: {x: x, y: y},
                fromX: x * size,
                toX: x * size,
                fromY: y * size,
                toY: y * size,
                fromFrame: 9,
                toFrame: 3,
            });
        }

        animations.push(animation);
    }

    function animateFall(cells) {

        let animation = {
            type: "fall",
            start: performance.now(),
            time: 500,
            cells: [],
        };

        for(let i = 0; i < cells.length; i++) {
            let cell = cells[i];
            board.animateing(cell.to[0], cell.to[1], true);
            animation.cells.push({
                pos: {x: cell.to[0], y: cell.to[1]},
                fromX: cell.from[0] * size,
                toX: cell.to[0] * size,
                fromY: cell.from[1] * size,
                toY: cell.to[1] * size,
                fromFrame: 1,
                toFrame: 1,
            });
        }

        animations.push(animation);
    }

    function animateFill(cells) {
        let animation = {
            type: "fill",
            start: performance.now(),
            time: 500,
            cells: [],
        };

        for(let i = 0; i < cells.length; i++) {
            let cell = cells[i];
            board.animateing(cell[0], cell[1], true);
            animation.cells.push({
                pos: {x: cell[0], y: cell[1]},
                fromX: cell[0] * size,
                toX: cell[0] * size,
                fromY: cell[1] * size,
                toY: cell[1] * size,
                fromFrame: 3,
                toFrame: 9,
            });
        }

        animations.push(animation);
    }
    
    return {
        switch: function(x1, y1, x2, y2){
            if(animations.length || !board.at(x1, y1) || !board.at(x2, y2)) {
                return;
            }
            player_switch = true;
            switch_cells(x1, y1, x2, y2);
        },

        getBoard: function() {
            return board.getBoard();
        }
    };
}

function Board(WIDTH, HEIGHT, CELLS, MAX_NEIGHBORS) {
    let board = [];

    for(let x = 0; x < WIDTH; x++) {
        board.push(Array(HEIGHT));
    }

    for(let x = WIDTH - 1; x >= 0; x--) {
        for(let y = HEIGHT - 1; y >= 0; y--) {
            let cell = CELLS[Math.random() * CELLS.length | 0];
            board[x][y] = Cell(cell);
            let neighbors = find_neighbors(x, y);
            if(neighbors.h.length > MAX_NEIGHBORS || neighbors.v.length > MAX_NEIGHBORS) {
                board[x][y] = undefined;
                y++;
            }
        }
    }

    function at(x, y) {
        if(x >= 0 && x < board.length && y >= 0 && y < board[x].length) {
            return board[x][y];
        }

        return undefined;
    }

    function find_neighbors(x, y) {
        let cells = {
            h: [[x, y]],
            v: [[x, y]],
        }

        if(at(x, y) === undefined) {
            return cells;
        }

        let color = board[x][y].color;

        for(let i = x + 1; i < board.length; i++) {
            if(at(i, y) !== undefined && at(i, y).color === color) {
                cells.h.push([i, y]);
            } else {
                break;
            }
        }

        for(let i = y + 1; i < board[x].length; i++) {
            if(at(x, i) !== undefined && at(x, i).color === color) {
                cells.v.push([x, i]);
            } else {
                break;
            }
        }

        return cells;
    }

    return {
        at: at,

        getBoard: function() {
            return board;
        },

        switch: function(x1, y1, x2, y2) {
            let temp = board[x1][y1];
            board[x1][y1] = board[x2][y2];
            board[x2][y2] = temp;
        },

        find: function() {
            let cells_to_remove = {};

            for(let x = 0; x < WIDTH; x++) {
                for(let y = 0; y < HEIGHT; y++) {
                    let neighbors = find_neighbors(x, y);
                    if(neighbors.h.length > MAX_NEIGHBORS) {
                        for(let i = 0; i < neighbors.h.length; i++) {
                            let cell = neighbors.h[i];
                            cells_to_remove[cell] = cell;
                        }
                    }
                    if(neighbors.v.length > MAX_NEIGHBORS) {
                        for(let i = 0; i < neighbors.v.length; i++) {
                            let cell = neighbors.v[i];
                            cells_to_remove[cell] = cell;
                        }
                    }
                }
            }

            let cells = [];

            for(cell in cells_to_remove) {
                cells.push(cells_to_remove[cell]);
            }

            return cells;
        },

        remove: function(cells) {
            for(let i = 0; i < cells.length; i++) {
                let x = cells[i][0];
                let y = cells[i][1];
                board[x][y] = undefined;
            }

            let falling_cells = [];

            for(let x = WIDTH - 1; x >= 0; x--) {
                for(let y = HEIGHT - 1; y >= 0; y--) {
                    let over = 1;
                    if(at(x, y) === undefined) {
                        for(let i = y - 1; i >= 0; i--) {
                            if(at(x, i) !== undefined) {
                                board[x][y] = board[x][i];
                                board[x][i] = undefined;
                                falling_cells.push({
                                    from: [x, i],
                                    to: [x, y],
                                });
                                break;
                            }
                        }
                    }
                }
            }
            return falling_cells;
        },

        fill: function() {
            cells = [];

            for(let x = 0; x < WIDTH; x++) {
                for(let y = 0; y < HEIGHT; y++) {
                    if(at(x, y) === undefined) {
                        let cell = CELLS[Math.random() * CELLS.length | 0];
                        board[x][y] = Cell(cell);
                        cells.push([x, y]);
                    }
                }
            }

            return cells;
        },

        animateing: function(x, y, bool) {
            board[x][y].animateing = bool;
        },
    };
}

function Cell(data) {
    let color = data.color;
    return {
        color: color,
        animateing: false,
        draw: function(ctx, frame, x, y, size) {
            //frame = Math.min(data.frames - 1, frame);
            //frame = Math.max(0, frame);
            ctx.drawImage(data.image, frame * data.size, color * data.size, data.size, data.size, x, y, size, size);
        }
    }
}