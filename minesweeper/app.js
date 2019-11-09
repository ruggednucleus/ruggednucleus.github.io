"use strict"

let canvas, ctx, minesweeperBoard, cells, ms;

function loadImage(src, callback) {
    let image = new Image();
    image.src = src;
    image.onload = () => callback(image);
}

function startGame(flag_icon) {
    let width =  18 // 10,18,24;
    let height = 14 //  8,14,20;
    let mines =  40 // 10,40,99;

    if(window.innerWidth < window.innerHeight) {
        let temp = width;
        width = height;
        height = temp;
    }

    let size = 40;

    ms = new Minesweeper(size, flag_icon);
    canvas = ms.canvas;

    document.body.appendChild(canvas);

    ms.start(width, height, mines)

    return
/*
    let canvasWidth = width * size;
    let canvasHeight = height * size;

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    let mousedown = 0;

    minesweeperBoard = new MinesweeperBoard(width, height, mines);
    cells = minesweeperBoard.board;
    let active_cells = [];

    function showCell(x, y) {
        let cells = minesweeperBoard.show(x, y);
        for(let cell of cells) {
            cell.show(size);
        }
    }

    function loop() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        for(let cell of cells) {
            let active = active_cells.includes(cell);
            cell.render(ctx, size, flag_icon, active);
        }

        for(let cell of cells) {
            cell.renderParticles(ctx, size);
        }
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    canvas.addEventListener("mousedown", (e) => {
        e.preventDefault();
        let x = e.offsetX / size | 0;
        let y = e.offsetY / size | 0;
        mousedown = e.which;
        let cell;

        switch(e.which) {
            case 1:
                showCell(x, y);
                break;
            case 2:
                cell = minesweeperBoard.at(x, y);
                let neighbors = minesweeperBoard.getNeighbors(minesweeperBoard.index(x, y));
                let flags = 0;
                active_cells = [];
                for(let neighbor of neighbors) {
                    if(neighbor.hidden && !neighbor.flag) {
                        active_cells.push(neighbor);
                    } else if(neighbor.flag) {
                        flags++;
                    }
                }

                if(!cell.hidden && flags === cell.value) {
                    active_cells.forEach(element => {
                        showCell(element.x, element.y);
                    });
                    
                    active_cells = [cell];
                } else {
                    active_cells.push(cell);
                }
                break;
            case 3:
                cell = minesweeperBoard.flag(x, y);
                if(cell.hidden && !cell.flag) {
                    cell.removeFlag(size, flag_icon);
                }
                break;
        }
    });

    window.addEventListener("mouseup", (e) => {
        e.preventDefault();
        let x = e.offsetX / size | 0;
        let y = e.offsetY / size | 0;
        active_cells = [minesweeperBoard.at(x, y)];

        mousedown = 0;
    });
    
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());

    canvas.addEventListener("mousemove", (e) => {
        e.preventDefault();
        let x = e.offsetX / size | 0;
        let y = e.offsetY / size | 0;

        let cell = minesweeperBoard.at(x, y);
        let neighbors = minesweeperBoard.getNeighbors(minesweeperBoard.index(x, y));
        if(mousedown === 2) {
            active_cells = [];
            for(let neighbor of neighbors) {
                if(neighbor.hidden && !neighbor.flag) {
                    active_cells.push(neighbor);
                }
            }
            active_cells.push(cell);
        } else {
            active_cells = [cell];
        }
    });*/
}

function init() {
    loadImage("flag_icon.png", startGame);
}