const CANVAS = document.querySelector("canvas");
const CTX = CANVAS.getContext("2d");

const CELL_SIZE = 40;
const BOARD_WIDTH = (window.innerWidth / CELL_SIZE | 0) * 0.9 - (window.innerWidth / CELL_SIZE | 0) * 0.9 % 2;
const BOARD_HEIGHT = (window.innerHeight / CELL_SIZE | 0) * 0.9 - (window.innerHeight / CELL_SIZE | 0) * 0.9 % 2;;

CANVAS.width = CELL_SIZE * BOARD_WIDTH;
CANVAS.height = CELL_SIZE * BOARD_HEIGHT;

const board = new Board(BOARD_WIDTH, BOARD_HEIGHT);
console.log(board);

const delay = 200;
let last_update = 0;
let PLAYING = false;

function loop() {
    if(PLAYING && performance.now() - last_update > delay) {
        last_update = performance.now();
        board.update();
    }

    board.draw();
    
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

let mousedown = false;
let touch = false;
let removeCells = false;

CANVAS.addEventListener("mousedown", e => {
    mousedown = true;

    let x = e.offsetX / CELL_SIZE | 0;
    let y = e.offsetY / CELL_SIZE | 0;

    removeCells = !board.isEmpty(x, y);

    if(removeCells) {
        board.removeCell(x, y);
    } else {
        board.addCell(x, y);
    }
});

CANVAS.addEventListener("mousemove", e => {
    if(mousedown) {
        let x = e.offsetX / CELL_SIZE | 0;
        let y = e.offsetY / CELL_SIZE | 0;
        if(removeCells) {
            board.removeCell(x, y);
        } else {
            board.addCell(x, y);
        }
    }
})

document.addEventListener("mouseup", e => {
    mousedown = false;
})

CANVAS.addEventListener("touchstart", e => {
    e.preventDefault();
    touch = true;

    let x = (e.touches[0].pageX - CANVAS.offsetLeft) / CELL_SIZE | 0;
    let y = (e.touches[0].pageY - CANVAS.offsetTop) / CELL_SIZE | 0;

    removeCells = !board.isEmpty(x, y);

    if(removeCells) {
        board.removeCell(x, y);
    } else {
        board.addCell(x, y);
    }
});

CANVAS.addEventListener("touchmove", e => {
    if(touch) {
        let x = (e.touches[0].pageX - CANVAS.offsetLeft) / CELL_SIZE | 0;
        let y = (e.touches[0].pageY - CANVAS.offsetTop) / CELL_SIZE | 0;
        if(removeCells) {
            board.removeCell(x, y);
        } else {
            board.addCell(x, y);
        }
    }
})

document.addEventListener("touchend", e => {
    touch = false;
})









const start = document.getElementById("start");
start.addEventListener("click", () => {
    PLAYING = !PLAYING;
    board.draw(false);
});

const step = document.getElementById("step");
step.addEventListener("click", () => {
    PLAYING = false;
    board.update();
});

const clear = document.getElementById("clear");
clear.addEventListener("click", () => {
    PLAYING = false;
    board.clearBoard();
})