class Game {
    constructor() {
        this.players = {
            red: 0,
            yellow: 1
        };

        this.width = 7;
        this.height = 6;

        this.depth = 5;

        this.board = this.emptyBoard();

        this.fallingDisc = undefined;
        this.fallSpeed = 0.1;
    }

    aiMoveMax(depth = 5) {
        let maxScore = -Infinity;
        let bestMove = undefined;
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                if(this.board[x][y] === undefined && (y + 1 >= this.height || this.board[x][y + 1] !== undefined)) {
                    this.board[x][y] = this.players.red;
                    let score = this.minimax(this.board, depth, -Infinity, Infinity, false, 0);
                    if(maxScore < score) {
                        maxScore = score;
                        bestMove = {x, y};
                    }
                    this.board[x][y] = undefined;
                }
            }
        }

        console.log("max", bestMove, maxScore)
        if(bestMove !== undefined) {
            this.dropDisc("red", bestMove.x, false);
        }
    }

    aiMoveMin(depth = 5) {
        let minScore = Infinity;
        let bestMove = undefined;
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                if(this.board[x][y] === undefined && (y + 1 >= this.height || this.board[x][y + 1] !== undefined)) {
                    this.board[x][y] = this.players.yellow;
                    let score = this.minimax(this.board, depth, -Infinity, Infinity, true, 0);
                    if(minScore > score) {
                        minScore = score;
                        bestMove = {x, y};
                    }
                    this.board[x][y] = undefined;
                }
            }
        }

        console.log("min", bestMove, minScore)
        if(bestMove !== undefined) {
            this.dropDisc("yellow", bestMove.x, false);
        }
    }

    minimax(position, maxDepth, alpha, beta, maximizingPlayer, depth) {
        const score = this.evaluateBoard();
        if(score.redWon  || score.yellowWon || depth >= maxDepth) {
            //if(depth < maxDepth) {console.log("won", score)}
            return score.redTotalScore - score.yellowTotalScore;
        }
        if(this.boardFull(position)) {
            return 0;
        }

        if(maximizingPlayer) {
            let maxScore = -Infinity;
            for(let x = 0; x < this.width; x++) {
                for(let y = 0; y < this.height; y++) {
                    if(position[x][y] === undefined && (y + 1 >= this.height || this.board[x][y + 1] !== undefined)) {
                        position[x][y] = this.players.red;
                        let score = this.minimax(position, maxDepth, alpha, beta, false, depth + 1);
                        maxScore = Math.max(maxScore, score);
                        alpha = Math.max(alpha, score);
                        position[x][y] = undefined;
                        if(beta <= alpha) {
                            return maxScore;
                        }
                    }
                }
            }
            return maxScore;
        } else {
            let minScore = Infinity;
            for(let x = 0; x < this.width; x++) {
                for(let y = 0; y < this.height; y++) {
                    if(position[x][y] === undefined && (y + 1 >= this.height || this.board[x][y + 1] !== undefined)) {
                        position[x][y] = this.players.yellow;
                        let score = this.minimax(position, maxDepth, alpha, beta, true, depth + 1);
                        minScore = Math.min(minScore, score);
                        beta = Math.min(beta, score);
                        position[x][y] = undefined;
                        if(beta <= alpha) {
                            return minScore;
                        }
                    }
                }
            }
            return minScore;
        }
    }

    evaluateBoard() {
        const board = this.emptyBoard();
        let redTotalScore = 0;
        let yellowTotalScore = 0;
        let redWon = false;
        let yellowWon = false;

        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                if(this.board[x][y] === undefined) {
                    let redScore = 0;
                    let yellowScore = 0;

                    let player;
                    // Left
                    if(x - 1 >= 0 && this.board[x - 1][y] !== undefined) {
                        let neighbors = 1;
                        player = this.board[x - 1][y];
                        for(let i = x - 2; i >= 0; i--) {
                            if(this.board[i][y] === player) {
                                neighbors++;
                            } else {
                                break;
                            }
                        }
                        if(player === this.players.red) {
                            redScore += neighbors;
                        } else {
                            yellowScore += neighbors;
                        }
                    }

                    // Right
                    if(x + 1 < this.width && this.board[x + 1][y] !== undefined) {
                        let neighbors = 1;
                        player = this.board[x + 1][y];
                        for(let i = x + 2; i < this.width; i++) {
                            if(this.board[i][y] === player) {
                                neighbors++;
                            } else {
                                break;
                            }
                        }
                        if(player === this.players.red) {
                            redScore += neighbors;
                        } else {
                            yellowScore += neighbors;
                        }
                    }

                    // Down
                    if(y + 1 < this.height && this.board[x][y + 1] !== undefined) {
                        let neighbors = 1;
                        player = this.board[x][y + 1];
                        for(let i = y + 2; i < this.height; i++) {
                            if(this.board[x][i] === player) {
                                neighbors++;
                            } else {
                                break;
                            }
                        }
                        if(player === this.players.red) {
                            redScore += neighbors;
                        } else {
                            yellowScore += neighbors;
                        }
                    }

                    // Diagonal Up Left
                    if(x - 1 >= 0 && y - 1 >= 0 && this.board[x - 1][y - 1] !== undefined) {
                        let neighbors = 1;
                        player = this.board[x - 1][y - 1];
                        for(let i = 2; x - i >= 0 && y - i >= 0; i++) {
                            if(this.board[x - i][y - i] === player) {
                                neighbors++;
                            } else {
                                break;
                            }
                        }
                        if(player === this.players.red) {
                            redScore += neighbors;
                        } else {
                            yellowScore += neighbors;
                        }
                    }

                    // Diagonal Up Right
                    if(x + 1 < this.width && y - 1 >= 0 && this.board[x + 1][y - 1] !== undefined) {
                        let neighbors = 1;
                        player = this.board[x + 1][y - 1];
                        for(let i = 2; x + i < this.width && y - i >= 0; i++) {
                            if(this.board[x + i][y - i] === player) {
                                neighbors++;
                            } else {
                                break;
                            }
                        }
                        if(player === this.players.red) {
                            redScore += neighbors;
                        } else {
                            yellowScore += neighbors;
                        }
                    }

                    // Diagonal Down Left
                    if(x - 1 >= 0 && y + 1 < this.height && this.board[x - 1][y + 1] !== undefined) {
                        let neighbors = 1;
                        player = this.board[x - 1][y + 1];
                        for(let i = 2; x - i >= 0 && y + i < this.height; i++) {
                            if(this.board[x - i][y + i] === player) {
                                neighbors++;
                            } else {
                                break;
                            }
                        }
                        if(player === this.players.red) {
                            redScore += neighbors;
                        } else {
                            yellowScore += neighbors;
                        }
                    }

                    // Diagonal Down Right
                    if(x + 1 < this.width && y + 1 < this.height && this.board[x + 1][y + 1] !== undefined) {
                        let neighbors = 1;
                        player = this.board[x + 1][y + 1];
                        for(let i = 2; x + i < this.width && y + i < this.height; i++) {
                            if(this.board[x + i][y + i] === player) {
                                neighbors++;
                            } else {
                                break;
                            }
                        }
                        if(player === this.players.red) {
                            redScore += neighbors;
                        } else {
                            yellowScore += neighbors;
                        }
                    }

                    redTotalScore += redScore;
                    yellowTotalScore += yellowScore;
                    board[x][y] = redScore - yellowScore;

                } else {
                    const player = this.board[x][y];
                    let rowLength = 1;
                    for(let i = x + 1; i < this.width; i++) {
                        if(this.board[i][y] === player) {
                            rowLength++;
                        } else {
                            break;
                        }
                    }

                    let columnLength = 1;
                    for(let i = y + 1; i < this.height; i++) {
                        if(this.board[x][i] === player) {
                            columnLength++;
                        } else {
                            break;
                        }
                    }

                    let diagonalLeftLength = 1;
                    for(let i = 1; x - i >= 0 && y + 1 < this.height; i++) {
                        if(this.board[x - i][y + i] === player) {
                            diagonalLeftLength++;
                        } else {
                            break;
                        }
                    }

                    let diagonalRightLength = 1;
                    for(let i = 1; x + i < this.width && y + 1 < this.height; i++) {
                        if(this.board[x + i][y + i] === player) {
                            diagonalRightLength++;
                        } else {
                            break;
                        }
                    }

                    if(rowLength >= 4 || columnLength >= 4 || diagonalLeftLength >= 4 || diagonalRightLength >= 4) {
                        if(player === this.players.red) {
                            redTotalScore = 1000;
                            redWon = true;
                        } else {
                            yellowTotalScore = 1000;
                            yellowWon = true;
                        }
                    }

                    board[x][y] = {
                        rowLength,
                        columnLength,
                        diagonalLeftLength,
                        diagonalRightLength,
                    };
                }
            }
        }

        //console.table(board);
        return {board, redTotalScore, yellowTotalScore, redWon, yellowWon};
    }

    dropDisc(color, x) {
        if(this.fallingDisc) {
            return false;
        }

        if(this.players[color] !== undefined && this.board[x][0] === undefined) {
            for(let y = 1; y <= this.height; y++) {
                if(y === this.height || this.board[x][y] !== undefined) {
                    this.fallingDisc = {
                        color: color,
                        x: x,
                        y: -1,
                        endY: y - 1,
                    }
                    //this.board[x][y - 1] = this.players[color];
                    return true;
                }
            }
        }

        return false;
    }

    emptyBoard() {
        const board = [];
        for(let x = 0; x < this.width; x++) {
            board[x] = new Array(this.height);
        }
        return board;
    }

    boardFull() {
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                if(this.board[x][y] === undefined) {
                    return false;
                }
            }
        }
        return true;
    }

    reset() {
        this.board = this.emptyBoard();
    }

    updateFallingDiscs() {
        if(this.fallingDisc) {
            this.fallingDisc.y += this.fallSpeed;
            if(this.fallingDisc.y >= this.fallingDisc.endY) {
                this.board[this.fallingDisc.x][this.fallingDisc.endY] = this.players[this.fallingDisc.color];
                this.fallingDisc = undefined;
            }
        }
    }

    show(ctx) {
        const cellWidth = ctx.canvas.width / this.width | 0;
        const cellHeight = ctx.canvas.height / this.height | 0;

        ctx.fillStyle = "#0366fc";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.fillStyle = "#034bb0";
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                ctx.beginPath();
                ctx.arc(x * cellWidth + cellWidth / 2,
                        y * cellHeight + cellHeight / 2,
                        cellWidth * 0.4, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                ctx.beginPath();
                ctx.arc(x * cellWidth + cellWidth / 2,
                        y * cellHeight + cellHeight / 2,
                        cellWidth * 0.35, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.restore();

        ctx.save();
        ctx.globalCompositeOperation = "destination-over";
        if(this.fallingDisc) {
            ctx.beginPath();
            ctx.fillStyle = this.fallingDisc.color;
            ctx.arc(this.fallingDisc.x * cellWidth + cellWidth / 2, this.fallingDisc.y * cellHeight + cellHeight / 2, cellWidth * 0.4, 0, Math.PI * 2);
            ctx.fill();
        }

        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                if(this.board[x][y] !== undefined) {
                    ctx.beginPath();
                    ctx.fillStyle = this.board[x][y] === this.players.red ? "red" : "yellow";
                    ctx.arc(x * cellWidth + cellWidth / 2, y * cellHeight + cellHeight / 2, cellWidth * 0.4, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
        ctx.restore();
/*
        ctx.beginPath();
        ctx.lineWidth = 2;
        for(let x = 1; x < this.width; x++) {
            ctx.moveTo(x * cellWidth, 0);
            ctx.lineTo(x * cellWidth, ctx.canvas.height);
        }

        for(let y = 1; y < this.height; y++) {
            ctx.moveTo(0, y * cellHeight);
            ctx.lineTo(ctx.canvas.width, y * cellHeight);
        }
        ctx.stroke();
*/

        //const evaluation = this.evaluateBoard().board;
/*
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                if(this.board[x][y] !== undefined) {
                    ctx.beginPath();
                    ctx.fillStyle = this.board[x][y] === this.players.red ? "red" : "yellow";
                    ctx.arc(x * cellWidth + cellWidth / 2, y * cellHeight + cellHeight / 2, cellWidth * 0.4, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    ctx.fillStyle = "black";
                    ctx.font = (cellHeight * 0.5) + "px sans-serif";
                    ctx.fillText(evaluation[x][y], x * cellWidth + cellWidth / 2.5, y * cellHeight + cellHeight / 1.5);
                }
            }
        }*/
    }
}

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let cellSize = Math.min(window.innerWidth / 7, window.innerHeight / 6) * 0.8 | 0;
cellSize % 2 !== 0 ? cellSize++ : false;
canvas.width = 7 * cellSize;
canvas.height = 6 * cellSize;

const game = new Game();
let aiTurn = false;

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if(aiTurn && game.fallingDisc === undefined) {
        game.aiMoveMin(game.depth);
        aiTurn = false;
    }
    game.updateFallingDiscs();
    game.show(ctx);
    requestAnimationFrame(loop);
}
loop();

canvas.addEventListener("click", e => {
    e.preventDefault();
    const evaluation = game.evaluateBoard();
    if(game.boardFull() || evaluation.redWon || evaluation.yellowWon) {
        game.reset();
        return;
    }

    const x = e.offsetX / (canvas.width / game.width) | 0;
    if(game.dropDisc("red", x)) {
        aiTurn = true;
    }
    
});