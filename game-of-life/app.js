const CANVAS = document.querySelector("canvas");
const CTX = CANVAS.getContext("2d");


let url = new URL(window.location);

const CELL_SIZE = parseInt(url.searchParams.get("size")) || 4;
const BOARD_WIDTH = (window.innerWidth / CELL_SIZE) * 0.9 | 0;
const BOARD_HEIGHT = (window.innerHeight / CELL_SIZE) * 0.9 | 0;

CANVAS.width = BOARD_WIDTH * CELL_SIZE;
CANVAS.height = BOARD_HEIGHT * CELL_SIZE;

const board = new Board(BOARD_WIDTH, BOARD_HEIGHT);

const delay = parseInt(url.searchParams.get("delay")) || 100;
let last_update = 0;
let playing = false;
const random_chance = 0.5;

function loop() {
    let dt = performance.now();
    if(playing && performance.now() - last_update > delay) {
        last_update = performance.now();
        board.update();    
    }

    board.draw();
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

let mousedown = false;
let removeCells = false;
let touch = false;

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
});

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
    playing = !playing;
    board.draw(false);
    if(playing) {
        start.innerText = "Stop";
    } else {
        start.innerText = "Start";
    }
});

const step = document.getElementById("step");
step.addEventListener("click", () => {
    playing = false;
    board.update();
});

const random = document.getElementById("random");
random.addEventListener("click", () => {
    board.fillRandom(random_chance);
})

const clear = document.getElementById("clear");
clear.addEventListener("click", () => {
    playing = false;
    board.clearBoard();
    start.innerText = "Start";
})