/**
 * 
 * To do:
 *  Ghost block;
 *  trække nye blocks fra en pose
 *  prøve at blocken deler sig 
 *
 */

const game = new Game();
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const block_size = Math.min(canvas.width * 0.9 / game.width, canvas.height * 0.7 / game.height);

const game_width = game.width * block_size;
const game_height = game.height * block_size;

const game_offset_x = (canvas.width / 2) - (game_width / 2);
const game_offset_y = (canvas.height / 2.5) - (game_height / 2);

function loop() {
    ctx.fillStyle = "#1f1f1f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(game_offset_x, game_offset_y);
    game.update();
    game.render(ctx, block_size);
    ctx.restore();

    let x = game_offset_x + game_width / 2;
    let y = game_offset_y + game_height + block_size * 0.9;

    ctx.strokeStyle = "#FFF";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(x - block_size * 1.2 / 2, y - block_size * 1.2 / 2, block_size * 1.2, block_size * 1.2, block_size * 0.1)
    ctx.stroke();

    ctx.fillStyle = ColourGenerator.generate(game.current_block);
    ctx.beginPath();
    ctx.roundRect(x - block_size / 2, y - block_size / 2, block_size, block_size, block_size * 0.1)
    ctx.fill();

    ctx.fillStyle = "#FFF";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"
    ctx.font = `${block_size * 0.5}px monospace`;
    ctx.fillText(2**game.current_block, x, y, block_size * 0.9)

    requestAnimationFrame(loop);
}

loop();

canvas.addEventListener("click", (e) => {
    const coloum = (e.offsetX - game_offset_x) / block_size | 0;
    game.place_block(coloum)
});