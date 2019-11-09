class Particle {
    constructor(x, y, color, flag) {
        this.position = new Vector(x, y);
        this.velocity = new Vector((Math.random() * 2 - 1) * 2, (Math.random() - 1) * 5);
        //this.velocity.setMagnitude(2)
        this.accelertion = new Vector();
        this.gravity = new Vector(0, 0.2);
        this.life = 1;
        this.decay = 0.02;
        this.flag = flag;
        this.color = color
        this.rotation = 0;
        this.rotation_speed = (Math.random() * 2 - 1) * 0.1;
    }

    done() {
        return this.life <= 0;
    }

    move() {
        this.velocity.add(this.gravity);
        this.velocity.mult(1)
        this.position.add(this.velocity);

        this.life -= this.decay;
        this.rotation += this.rotation_speed;
    }

    renderFlag(ctx, size) {
        let s = size * this.life;
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(this.flag, 0, 0, this.flag.width, this.flag.height, -s / 2, -s / 2, s, s);
        ctx.restore();
    }

    show(ctx, size) {
        if(this.flag) {
            this.renderFlag(ctx, size);
        } else {
            ctx.fillStyle = this.color;
            let s = size * this.life;
            ctx.save();
            ctx.translate(this.position.x, this.position.y);
            ctx.rotate(this.rotation);
            ctx.fillRect(-s / 2, -s / 2, s, s);
            ctx.restore();
        }
    }
}