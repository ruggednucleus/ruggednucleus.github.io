class Ant {
    constructor(position = new Vector(0, 0)) {
        this.maxSpeed = 1;
        this.steerStrength = 2;
        this.wanderStrength = 0.2;

        this.position = position;
        this.velocity = new Vector(0, 0);
        this.desiredDirection = new Vector(0, 0);
    }

    update(target, deltaTime) {
        //const desiredDirection = Vector.sub(target, this.position).normalize();
        this.desiredDirection = Vector.add(this.desiredDirection, Vector.randomVector().mult(this.wanderStrength)).normalize();

        const desiredVelocity = Vector.mult(this.desiredDirection, this.maxSpeed);
        const desiredSteeringForce = Vector.sub(desiredVelocity, this.velocity).mult(this.steerStrength);
        const acceleration = desiredSteeringForce;
        acceleration.limit(this.steerStrength);

        this.velocity = Vector.add(this.velocity, Vector.mult(acceleration, deltaTime)).limit(this.maxSpeed);
        this.position.add(this.velocity);
    }

    draw(time, scale) {
        let rad = time / (100 * scale)

        ctx.save()
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.velocity.getRad());
        ctx.scale(scale, scale)
        ctx.fillStyle = "black";
        
        ctx.beginPath()
        ctx.ellipse(0, 0, 10, 4, 0, 0, Math.PI * 2);
        ctx.ellipse(-15, 0, 10, 7, 0, 0, Math.PI * 2);
        ctx.ellipse(10, 0, 8, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(20, -10);
        ctx.lineTo(30, -10)
        ctx.moveTo(10, 0);
        ctx.lineTo(20, 10);
        ctx.lineTo(30, 10);
        ctx.stroke();

        ctx.save();
        ctx.rotate((Math.sin(rad) + 1) * 0.1 - 0.1);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(5, -10);
        ctx.lineTo(15, -15);
        ctx.moveTo(0, 0);
        ctx.lineTo(5, 10);
        ctx.lineTo(15, 15);

        ctx.moveTo(0, 0);
        ctx.lineTo(-5, -10);
        ctx.lineTo(-20, -15);
        ctx.moveTo(0, 0);
        ctx.lineTo(-5, 10);
        ctx.lineTo(-20, 15)
        ctx.restore();

        ctx.save();
        ctx.rotate( -((Math.sin(rad) + 1) * 0.1 - 0.1));
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -10);
        ctx.lineTo(-5, -20);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 10);
        ctx.lineTo(-5, 20);
        ctx.restore();

        ctx.stroke();

        ctx.restore();
    }
}