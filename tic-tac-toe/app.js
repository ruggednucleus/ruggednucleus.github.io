class Game {
    constructor() {
        this.turn = 0;
        this.player = "x";
        this.opponent = "o";

        this.size = 3;
        this.board = new Array(this.size * this.size);
    }

    aiMove() {
        let maxScore = -Infinity;
        let bestMove = undefined;
        for(let i = 0; i < this.board.length; i++) {
            if(this.board[i] === undefined) {
                this.board[i] = this.player;
                this.turn++;
                let score = this.minimax(this.board, 10, false, 0);
                if(maxScore < score) {
                    maxScore = score;
                    bestMove = i;
                }
                this.board[i] = undefined;
                this.turn--;
            }
        }

        console.log(bestMove, maxScore)
        if(bestMove !== undefined) {
            const x = bestMove % this.size;
            const y = bestMove / this.size | 0;
            this.place(x, y);
        }
    }

    aiMoveMin() {
        let minScore = Infinity;
        let bestMove = undefined;
        for(let i = 0; i < this.board.length; i++) {
            if(this.board[i] === undefined) {
                this.board[i] = this.opponent;
                this.turn++;
                let score = this.minimax(this.board, 10, true, 0);
                if(minScore > score) {
                    minScore = score;
                    bestMove = i;
                }
                this.board[i] = undefined;
                this.turn--;
            }
        }

        console.log("min", bestMove, minScore)
        if(bestMove !== undefined) {
            const x = bestMove % this.size;
            const y = bestMove / this.size | 0;
            this.place(x, y);
        }
    }

    evaluate() {
        for(let x = 0; x < 3; x++) {
            if(this.board[x] === this.board[3 + x] && this.board[3 + x] === this.board[6 + x]) {
                if(this.board[x] === this.player) {
                    return 1;
                } else if(this.board[x] === this.opponent) {
                    return -1;
                }
            }
        }
        for(let y = 0; y < 3; y++) {
            if(this.board[y * 3] === this.board[y * 3 + 1] && this.board[y * 3 + 1] === this.board[y * 3 + 2]) {
                if(this.board[y * 3] === this.player) {
                    return 1;
                } else if(this.board[y * 3] === this.opponent) {
                    return -1;
                }
            }
        }
        if(this.board[0] === this.board[4] && this.board[4] === this.board[8]) {
            if(this.board[0] === this.player) {
                return 1;
            } else if(this.board[0] === this.opponent) {
                return -1;
            }
        }
        if(this.board[2] === this.board[4] && this.board[4] === this.board[6]) {
            if(this.board[2] === this.player) {
                return 1;
            } else if(this.board[2] === this.opponent) {
                return -1;
            }
        }

        return 0;
    }

    minimax(position, maxDepth, maximizingPlayer, depth) {
        const score = this.evaluate();
        if(score !== 0) {
            return score;
        }
        if(this.boardFull(position)) {
            return 0;
        }

        if(maximizingPlayer) {
            let maxScore = -Infinity;
            for(let i = 0; i < position.length; i++) {
                if(position[i] === undefined) {
                    position[i] = this.player;
                    let score = this.minimax(position, maxDepth, false, depth + 1);
                    maxScore = Math.max(maxScore, score);
                    position[i] = undefined;
                }
            }
            return maxScore;
        } else {
            let minScore = Infinity;
            for(let i = 0; i < position.length; i++) {
                if(position[i] === undefined) {
                    position[i] = this.opponent;
                    let score = this.minimax(position, maxDepth, true, depth + 1);
                    minScore = Math.min(minScore, score);
                    position[i] = undefined;
                }
            }
            return minScore;
        }
    }

    place(x, y) {
        const index = y * this.size + x;
        if(index < this.board.length && this.board[index] === undefined) {
            this.board[index] = this.turn % 2 ? "o" : "x";
            this.turn++;
            return true;
        }
        return false;
    }

    gameOver(board = this.board) {
        let player = 0;
        for(let x = 0; x < this.size; x++) {
            player = board[x];
            if(player !== undefined) {
                for(let y = 1; y < this.size; y++) {
                    if(board[y * this.size + x] !== player) {
                        break;
                    } else if(y === this.size - 1) {
                        return {player};
                    } 
                }
            }
        }

        for(let y = 0; y < this.size; y++) {
            player = board[y * this.size];
            if(player !== undefined) {
                for(let x = 1; x < this.size; x++) {
                    if(board[y * this.size + x] !== player) {
                        break;
                    } else if(x === this.size - 1) {
                        return {player};
                    } 
                }
            }
        }

        player = board[0];
        for(let i = 1; i < this.size && player !== undefined; i++) {
            if(board[i * this.size + i] !== player) {
                break;
            } else if(i === this.size - 1) {
                return {player};
            } 
        }

        player = board[this.size - 1];
        for(let i = this.size - 1; i >= 0 && player !== undefined; i--) {
            if(board[(this.size - i - 1) * this.size + i] !== player) {
                break;
            } else if(i === 0) {
                return {player};
            } 
        }

        let full = true;
        for(let i = 0; i < board.length; i++) {
            if(board[i] === undefined) {
                full = false;
                break;
            }
        }

        if(full) {
            return {tie: true};
        }

        return false;
    }

    gameWon(board = this.board) {
        let player = 0;
        for(let x = 0; x < this.size; x++) {
            player = board[x];
            if(player !== undefined) {
                for(let y = 1; y < this.size; y++) {
                    if(board[y * this.size + x] !== player) {
                        break;
                    } else if(y === this.size - 1) {
                        return true;
                    } 
                }
            }
        }

        for(let y = 0; y < this.size; y++) {
            player = board[y * this.size];
            if(player !== undefined) {
                for(let x = 1; x < this.size; x++) {
                    if(board[y * this.size + x] !== player) {
                        break;
                    } else if(x === this.size - 1) {
                        return true;
                    } 
                }
            }
        }

        player = board[0];
        for(let i = 1; i < this.size && player !== undefined; i++) {
            if(board[i * this.size + i] !== player) {
                break;
            } else if(i === this.size - 1) {
                return true;
            } 
        }

        player = board[this.size - 1];
        for(let i = this.size - 1; i >= 0 && player !== undefined; i--) {
            if(board[(this.size - i - 1) * this.size + i] !== player) {
                break;
            } else if(i === 0) {
                return true;
            } 
        }

        return false;
    }

    boardFull(board = this.board) {
        for(let i = 0; i < board.length; i++) {
            if(board[i] === undefined) {
                return false;
            }
        }
        return true;
    }

    reset() {
        this.turn = 0;
        this.board = new Array(this.size * this.size);
    }

    show(ctx) {
        const cellWidth = ctx.canvas.width / this.size | 0;
        const cellHeight = ctx.canvas.height / this.size | 0;

        ctx.lineWidth = 4;
        ctx.beginPath();
/*
        ctx.moveTo(2, 0);
        ctx.lineTo(2, ctx.canvas.height);
        ctx.moveTo(0, 2);
        ctx.lineTo(ctx.canvas.width, 2);

        ctx.moveTo(ctx.canvas.width - 2, 0);
        ctx.lineTo(ctx.canvas.width - 2, ctx.canvas.height);
        ctx.moveTo(0, ctx.canvas.height - 2);
        ctx.lineTo(ctx.canvas.width, ctx.canvas.height - 2);*/

        for(let i = 1; i < this.size; i++) {
            ctx.moveTo(i * cellWidth, 0);
            ctx.lineTo(i * cellWidth, ctx.canvas.height);
            ctx.moveTo(0, i * cellHeight);
            ctx.lineTo(ctx.canvas.width, i * cellHeight);
        }

        for(let x = 0; x < this.size; x++) {
            for(let y = 0; y < this.size; y++) {
                const index = y * this.size + x;
                switch(this.board[index]) {
                    case "x":
                        ctx.moveTo(x * cellWidth + cellWidth * 0.2, y * cellHeight + cellHeight * 0.2);
                        ctx.lineTo(x * cellWidth + cellWidth * 0.8, y * cellHeight + cellHeight * 0.8);

                        ctx.moveTo(x * cellWidth + cellWidth * 0.8, y * cellHeight + cellHeight * 0.2);
                        ctx.lineTo(x * cellWidth + cellWidth * 0.2, y * cellHeight + cellHeight * 0.8);
                        break;

                    case "o":
                        ctx.moveTo(x * cellWidth + cellWidth * 0.8, y * cellHeight + cellHeight * 0.5);
                        ctx.arc(x * cellWidth + cellWidth * 0.5, y * cellHeight + cellHeight * 0.5, cellWidth * 0.3, 0, Math.PI * 2);
                        break;
                }
            }
        }

        ctx.stroke();
    }
}

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const canvasSize = Math.min(window.innerHeight * 0.9, window.innerWidth * 0.9);
canvas.width = canvasSize;
canvas.height = canvasSize;

const game = new Game();
//game.aiMove();
render();

canvas.addEventListener("click", e => {
    if(game.boardFull() || game.gameWon()) {
        game.reset();
        //game.aiMove();
        render();
        return;
    }

    const x = (e.pageX - canvas.offsetLeft) / (canvasSize / 3) | 0;
    const y = (e.pageY - canvas.offsetTop) / (canvasSize / 3) | 0;

    if(game.place(e.offsetX / (canvasSize / 3) | 0, e.offsetY / (canvasSize / 3) | 0) && !game.boardFull() && !game.gameWon()) {
        game.aiMoveMin();
    }
    render();
});

function move() {
    if(game.boardFull() || game.evaluate() !== 0) {
        game.reset();
        render();
        return;
    }

    if(game.turn % 2) {
        game.aiMoveMin();
    } else {
        game.aiMove();
    }

    render();
}

function render() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    game.show(ctx);
}