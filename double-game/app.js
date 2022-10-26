class ColourGenerator {
    static hue = Math.random();
    static golden_ratio_conjugate = 0.618033988749895;

    static hsv_to_rgb(h, s, v) {
        let r, g, b, i, f, p, q, t;
        if (arguments.length === 1) {
            s = h.s, v = h.v, h = h.h;
        }
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }

        return `rgb(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)})`

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    static generate(n) {
        //this.hue += this.golden_ratio_conjugate;
        //this.hue %= 1;
        return this.hsv_to_rgb((this.hue + this.golden_ratio_conjugate * n) % 1, 0.5, 0.95);
    }
}

const game = new Game();
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const block_size = 100;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const game_width = game.width * block_size;
const game_height = game.height * block_size;

const game_offset_x = (canvas.width / 2) - (game_width / 2);
const game_offset_y = (canvas.height / 2.5) - (game_height / 2);

function loop() {
    ctx.fillStyle = "#1f1f1f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(game_offset_x, game_offset_y)
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
    ctx.fillText(game.current_block, x, y, block_size * 0.9)

    requestAnimationFrame(loop);
}

loop();

canvas.addEventListener("click", (e) => {
    const coloum = (e.offsetX - game_offset_x) / block_size | 0;
    game.place_block(coloum)
});