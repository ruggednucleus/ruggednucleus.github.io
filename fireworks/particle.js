class Particle {
    constructor(x, y, angle, speed, decay = 0) {
        this.position = new Vector(x, y);
        this.velocity = Vector.fromAngle(angle, speed);
        this.acceleration = new Vector();
        this.lifespan = 255;
        this.decay = decay;
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0);

        this.lifespan -= this.decay;
        if(this.lifespan < 0) {
            this.lifespan = 0;
        }
    }

    done() {
        return this.lifespan <= 0;
    }

    show(ctx, color, radius) {
        ctx.save();
        ctx.globalAlpha = this.lifespan / 255;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}