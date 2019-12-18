class Firework {
    constructor(x, y, angle, speed) {
        this.firework = new Particle(x, y, angle, speed);
        this.particles = [];
        this.exploded = false;

        const colors = [Math.random() * 255, 255, 0]
        this.color = `rgb(
            ${colors.splice(colors.length * Math.random() | 0, 1)[0]},
            ${colors.splice(colors.length * Math.random() | 0, 1)[0]},
            ${colors[0]}
        )`;
    }

    update(gravity) {
        if(!this.exploded) {
            this.firework.applyForce(gravity);
            this.firework.update();
            if(this.firework.velocity.y >= 0) {
                this.explode();
            }
        } else {
            for(let i = 0; i < this.particles.length; i++) {
                if(this.particles[i].done()) {
                    this.particles.splice(i, 1);
                    i--;
                } else {
                    this.particles[i].applyForce(gravity);
                    this.particles[i].update();
                    this.particles[i].velocity.mult(0.95)
                }
            }
        }
    }

    explode() {
        const x = this.firework.position.x;
        const y = this.firework.position.y;
        for(let i = 0; i < 100; i++) {
            const particle = new Particle(x, y, Math.random() * 360, Math.random() * 10, 4);
            particle.velocity.add(this.firework.velocity);
            this.particles.push(particle);
        }
        this.firework = null;
        this.exploded = true;
    }

    show(ctx, radius) {
        if(!this.exploded) {
            this.firework.show(ctx, this.color, radius);
        }else {
            for(let particle of this.particles) {
                particle.show(ctx, this.color, radius);
            }
        }
    }
}