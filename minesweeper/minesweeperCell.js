"use strict"

class MinesweeperCell {
    constructor(ms, x, y) {
        this.ms = ms;
        this.x = x;
        this.y = y;
        this.mine = false;
        this.false = false;
        this.value = 0;
        this.hidden = true;
        this.border_width = 3;

        this.is_water = false;
        this.water_start = 0;
        this.water_time = 1000;

        this.particles = [];

        this.colors = {
            grass: ["#5adc32", "#50d228"],
            earth: ["#dcc8a0", "#d2be96"],
            water: ["#85b2fa", "#72a5f8"],
            border: "#14be14",
            active_grass: ["#7de45e", "#93e67a"],
            active_earth: ["#eadfc7", "#e2d5bb"],
            numbers: ["#000000", "#305ee6", "#14be14", "#e63c30", "#8f32d1", "#ed8013", "#0fd6d2", "#dde80e", "#e61cdb"],
            mines: [
                "#305ee6", "#0b1f5b", // Blue
                "#14be14", "#0a5c0a", // Green
                "#e63c30", "#5b110b", // Red
                "#8f32d1", "#381353", // Purple
                "#ed8013", "#5f3307", // Orange
                "#0fd6d2", "#075f5e", // Cyan
                "#dde80e", "#5c6006", // Yellow
                "#e61cdb", "#5c0a58"  // Pink
            ],
        }

        this.mineColor = Math.random() * this.colors.mines.length;
        this.mineColor -= this.mineColor % 2;
    }

    show(size) {
        let color = this.colors.grass[(this.x + this.y) % 2];
        this.particles.push(new Particle(this.x * size + size / 2, this.y * size + size / 2, color, false));
    }

    removeFlag(size, flag_image) {
        this.particles.push(new Particle(this.x * size + size / 2, this.y * size + size / 2, "#000", flag_image));
    }

    explode(size) {
        let n = 2 + Math.random() * 2 | 0;
        for(let i = 0; i < n; i++) {
            this.particles.push(new Flower(this.x * size + size / 2, this.y * size + size / 2, size / 2, true))
        }
    }

    growFlowers(size) {
        let n = 2 + Math.random() * 2 | 0;
        let flower_size = size / 2.5;
        let rotation = Math.random() * 360;
        for(let i = 0; i < n; i++) {
            let r = (rotation + 360 / n * i) * Math.PI / 180;
            let x = (this.x * size + size / 2) + size / 4 * Math.cos(r);
            let y = (this.y * size + size / 2) + size / 4 * Math.sin(r);
            this.particles.push(new Flower(x, y, flower_size, false))
        }
    }

    water(time) {
        this.is_water = true;
        this.water_start = time;
    }

    renderParticles(ctx, size) {
        for(let i = 0; i < this.particles.length; i++) {
            this.particles[i].move();
            this.particles[i].show(ctx, size);
            if(this.particles[i].done()) {
                this.particles.splice(i, 1);
                i--;
            }
        }
    }

    drawMine(ctx, size) {
        ctx.fillStyle = this.colors.mines[this.mineColor];
        ctx.fillRect(this.x * size, this.y * size, size, size);
        ctx.fillStyle = this.colors.mines[this.mineColor + 1];
        ctx.beginPath();
        ctx.arc(this.x * size + size / 2, this.y * size + size / 2, size * 0.25, 0, Math.PI * 2);
        ctx.fill();
    }

    drawNumber(ctx, size) {
        if(this.value !== 0) {
            let n = this.value % 8;
            ctx.fillStyle = this.colors.numbers[n];
            let fontSize = size * 0.9;
            ctx.font = fontSize + "px monospace"
            ctx.textAlign = "center";
            ctx.fillText(this.value, this.x * size + size / 2, this.y * size + fontSize * 0.90);
        }
    }

    drawFlag(ctx, size, flag_image) {
        ctx.drawImage(flag_image, 0, 0, flag_image.width, flag_image.height, this.x * size, this.y * size, size, size);
    }

    drawBorder(ctx, size) {
        ctx.fillStyle = this.colors.border;

        if(!this.hidden && !this.mine) {
            let neighbor = this.ms.at(this.x - 1, this.y);
            if(neighbor && neighbor.hidden || (neighbor.mine && !neighbor.hidden)) {
                ctx.fillRect(this.x * size, this.y * size, this.border_width, size);
            }

            neighbor = this.ms.at(this.x + 1, this.y);
            if(neighbor && neighbor.hidden || (neighbor.mine && !neighbor.hidden)) {
                ctx.fillRect(this.x * size + size - this.border_width, this.y * size, this.border_width, size);
            }

            neighbor = this.ms.at(this.x, this.y - 1);
            if(neighbor && neighbor.hidden || (neighbor.mine && !neighbor.hidden)) {
                ctx.fillRect(this.x * size, this.y * size, size, this.border_width);
            }

            neighbor = this.ms.at(this.x, this.y + 1);
            if(neighbor && neighbor.hidden || (neighbor.mine && !neighbor.hidden)) {
                ctx.fillRect(this.x * size, this.y * size + size - this.border_width, size, this.border_width);
            }

            neighbor = this.ms.at(this.x - 1, this.y - 1);
            if(neighbor && neighbor.hidden || (neighbor.mine && !neighbor.hidden)) {
                ctx.fillRect(this.x * size, this.y * size, this.border_width, this.border_width);
            }

            neighbor = this.ms.at(this.x + 1, this.y - 1);
            if(neighbor && neighbor.hidden || (neighbor.mine && !neighbor.hidden)) {
                ctx.fillRect(this.x * size + size - this.border_width, this.y * size, this.border_width, this.border_width);
            }

            neighbor = this.ms.at(this.x - 1, this.y + 1);
            if(neighbor && neighbor.hidden || (neighbor.mine && !neighbor.hidden)) {
                ctx.fillRect(this.x * size, this.y * size + size - this.border_width, this.border_width, this.border_width);
            }

            neighbor = this.ms.at(this.x + 1, this.y + 1);
            if(neighbor && neighbor.hidden || (neighbor.mine && !neighbor.hidden)) {
                ctx.fillRect(this.x * size + size - this.border_width, this.y * size + size - this.border_width, this.border_width, this.border_width);
            }
        }
            /*
        let neighbor = this.ms.at(this.x - 1, this.y);
        if(neighbor && neighbor.hidden !== this.hidden) {
            ctx.fillRect(this.x * size - 2, this.y * size - 2, 4, size + 4);
        }

        neighbor = this.ms.at(this.x, this.y - 1);
        if(neighbor && neighbor.hidden !== this.hidden) {
            ctx.fillRect(this.x * size - 2, this.y * size - 2, size + 4, 4);
        }

        neighbor = this.ms.at(this.x - 1, this.y - 1);
        if(neighbor && neighbor.hidden !== this.hidden) {
            ctx.fillRect(this.x * size - 2, this.y * size - 2, 4, 4);
        }*/
    }

    render(ctx, size, flag_image, active) {
        if(this.hidden) {
            if(active) {
                ctx.fillStyle = this.colors.active_grass[(this.x + this.y) % 2];
            } else {
                ctx.fillStyle = this.colors.grass[(this.x + this.y) % 2];
            }
        } else {
            if(active && this.value !== 0) {
                ctx.fillStyle = this.colors.active_earth[(this.x + this.y) % 2];
            } else {
                ctx.fillStyle = this.colors.earth[(this.x + this.y) % 2];
            }
        }

        ctx.fillRect(this.x * size, this.y * size, size, size);

        if(!this.hidden) {
            if(this.mine) {
                this.drawMine(ctx, size);
            } else {
                this.drawNumber(ctx, size);
            }
        } else if(this.flag) {
            this.drawFlag(ctx, size, flag_image);
        }

        if(this.is_water) {
            ctx.fillStyle = this.colors.water[(this.x + this.y) % 2];
            ctx.save();
            ctx.globalAlpha = (performance.now() - this.water_start) / this.water_time;
            ctx.fillRect(this.x * size, this.y * size, size, size);
            ctx.restore();
        }

        this.drawBorder(ctx, size);
    }
}