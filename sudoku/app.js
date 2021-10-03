const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const sudoku = new Sudoku(3, 3);
const sudoku_renderer = new SudokuRenderer(canvas, sudoku);
const sudoku_solver = new SudokuSolver(sudoku);

const sudoku_select = document.getElementById("sudoku-select");
for(let difficulty in TEST_SUDOKUS) {
    for(let i = 0; i < TEST_SUDOKUS[difficulty].length; i++) {
        const option = document.createElement("option");
        option.innerText = difficulty + " " + (i + 1);
        option.setAttribute("difficulty", difficulty);
        option.setAttribute("index", i);
        sudoku_select.appendChild(option);
    }
}

sudoku_select.addEventListener("change", e => {
    const option = e.target.selectedOptions[0];
    const difficulty = option.getAttribute("difficulty");
    const index = parseInt(option.getAttribute("index"));
    sudoku.fillValues(TEST_SUDOKUS[difficulty][index]);
});

document.getElementById("solve-button").addEventListener("click", () => {
    sudoku_solver.solve();
});

document.getElementById("erase-button").addEventListener("click", () => {
    const active_cell = sudoku_renderer.active_cell;
    if(!active_cell) {
        return;
    }

    sudoku.removeNumber(active_cell.x, active_cell.y);
});

const number_buttons = document.getElementsByClassName("number-button");
for(let button of number_buttons) {
    button.addEventListener("click", () => {
        const active_cell = sudoku_renderer.active_cell;
        if(!active_cell) {
            return;
        }

        sudoku.setNumber(active_cell.x, active_cell.y, parseInt(button.getAttribute("value")));
    });
}

//resizeCanvas();

function loop() {
    sudoku_renderer.draw();
    requestAnimationFrame(loop);
}
loop();

function onClick(event) {
    sudoku_renderer.click(event.x, event.y);
}

function onMousemove(event) {
    sudoku_renderer.hover(event.x, event.y);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("keydown", e => {
    switch(e.key) {
        case "ArrowRight":
            sudoku_renderer.moveActiveCell(1, 0);
            break;
        
        case "ArrowLeft":
            sudoku_renderer.moveActiveCell(-1, 0);
            break;

        case "ArrowUp":
            sudoku_renderer.moveActiveCell(0, -1);
            break;
            
        case "ArrowDown":
            sudoku_renderer.moveActiveCell(0, 1);
            break;

        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            sudoku.setNumber(sudoku_renderer.active_cell.x, sudoku_renderer.active_cell.y, parseInt(e.key));
            break;
    }
})

//window.addEventListener("resize", resizeCanvas);
canvas.addEventListener("click", onClick);
canvas.addEventListener("mousemove", onMousemove);

/*
let sudoku = [];
for(let i = 0; i < 81; i++) {
    sudoku.push(gameScene.getCellById(i).dataValue);
}
sudoku
*/